
import { ListingItem } from '../types';
import html2canvas from 'html2canvas';

export const generateShareImage = async (item: ListingItem, formattedPrice: string) => {
  const container = document.createElement('div');
  container.id = 'flyer-generator';
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '1080px';
  container.style.minHeight = '1500px';
  container.style.backgroundColor = '#f8fafc';
  container.style.fontFamily = "'Poppins', sans-serif";
  document.body.appendChild(container);

  const mainImage = item.images[0];
  const secondaryImage = item.images[1] || item.images[0];
  
  let days = "5";
  let nights = "4";
  if ('durationLabel' in item && item.durationLabel) {
      const match = item.durationLabel.match(/(\d+)\s*DÍAS?\s*\/\s*(\d+)\s*NOCHES?/i);
      if (match) { days = match[1]; nights = match[2]; }
  }

  container.innerHTML = `
    <div class="relative w-full h-full bg-white flex flex-col items-center overflow-hidden">
        <div class="w-full h-8 bg-lime-500"></div>
        <div class="w-full text-center pt-12 pb-8 px-12">
            <h1 class="text-6xl font-black text-green-700 uppercase mb-2 leading-tight">${item.title}</h1>
            <h2 class="text-2xl font-bold text-gray-500 uppercase tracking-widest">📍 ${item.location}</h2>
        </div>
        <div class="relative w-full px-10 h-[650px] flex gap-4 mb-10">
            <div class="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-gray-100">
                <img src="${mainImage}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
            </div>
            <div class="absolute bottom-10 right-16 bg-lime-400 text-green-950 px-10 py-6 rounded-2xl shadow-2xl border-4 border-white">
                <div class="text-5xl font-black">${days} Días</div>
                <div class="text-3xl font-bold opacity-70">${nights} Noches</div>
            </div>
        </div>
        <div class="w-full px-12 py-10 bg-green-50 text-center">
            <h3 class="text-4xl font-bold text-green-900 mb-2">Reserva con Floripa Fácil</h3>
            <div class="text-7xl font-black text-green-600 mt-4">${formattedPrice}</div>
            <div class="text-lg text-gray-500 mt-4 font-medium">* Tarifas vigentes para temporada 2025/2026.</div>
        </div>
        <div class="w-full bg-green-900 py-10 px-12 flex justify-between items-center text-white mt-auto">
             <div class="flex items-center gap-6">
                 <img src="https://i.postimg.cc/mD8G8h4H/Logo-Floripa-Facil.png" style="height: 100px; width: auto; filter: brightness(0) invert(1);" crossorigin="anonymous"/>
             </div>
             <div class="text-right">
                 <p class="font-bold text-3xl">+55 48 99123-4567</p>
                 <p class="text-lime-400 text-xl font-medium">hola@floripafacil.com</p>
             </div>
        </div>
    </div>
  `;

  try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const canvas = await html2canvas(container, {
          useCORS: true,
          scale: 2,
          backgroundColor: '#ffffff',
          width: 1080,
          windowWidth: 1080
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `FloripaFacil_${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      link.click();
  } catch (error) {
      console.error("Flyer error:", error);
  } finally {
      document.body.removeChild(container);
  }
};
