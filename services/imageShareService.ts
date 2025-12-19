
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
  container.style.backgroundColor = '#ffffff';
  container.style.fontFamily = "'Poppins', sans-serif";
  document.body.appendChild(container);

  const mainImage = item.images[0];
  const logoUrl = "https://i.postimg.cc/9f0v8G0D/Logo-Floripa-Facil-Dark.png";
  
  let duration = "BRASIL 2025/2026";
  if ('durationLabel' in item && item.durationLabel) duration = item.durationLabel;
  else if ('duration' in item && item.duration) duration = item.duration;

  container.innerHTML = `
    <div class="relative w-full h-full bg-white flex flex-col items-center overflow-hidden">
        <div class="w-full h-12 bg-lime-500"></div>
        
        <div class="w-full px-12 pt-16 pb-10 flex items-center justify-between">
            <div class="max-w-[70%]">
                <h1 class="text-7xl font-black text-green-700 uppercase leading-none mb-2 tracking-tighter">${item.title}</h1>
                <h2 class="text-3xl font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">📍 ${item.location}</h2>
            </div>
            <img src="${logoUrl}" style="height: 180px; width: 180px; border-radius: 50%; border: 6px solid #f0fdf4;" crossorigin="anonymous" />
        </div>

        <div class="relative w-[1000px] h-[700px] mb-12">
            <div class="w-full h-full rounded-[40px] overflow-hidden shadow-2xl border-[12px] border-white bg-slate-100">
                <img src="${mainImage}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
            </div>
            <div class="absolute -bottom-8 -right-8 bg-lime-400 text-green-950 px-12 py-8 rounded-3xl shadow-2xl border-[6px] border-white">
                <div class="text-4xl font-black uppercase tracking-tighter">${duration}</div>
            </div>
        </div>

        <div class="w-[1000px] px-12 py-12 bg-green-50 rounded-[40px] text-center mb-16 border-2 border-green-100">
            <h3 class="text-4xl font-bold text-green-900 mb-4 tracking-tight">Tu viaje empieza aquí, con Floripa Fácil</h3>
            <div class="text-[110px] font-black text-green-600 leading-none">${formattedPrice}</div>
            <div class="text-2xl text-gray-500 mt-6 font-medium uppercase tracking-widest italic">* Consulta disponibilidad y medios de pago</div>
        </div>

        <div class="w-full bg-green-950 py-14 px-16 flex justify-between items-center text-white mt-auto">
             <div>
                 <p class="text-lime-400 text-xl font-bold uppercase tracking-widest mb-1">Reserva por WhatsApp</p>
                 <p class="font-black text-5xl tracking-tighter">+55 48 99123-4567</p>
             </div>
             <div class="text-right">
                 <p class="text-2xl font-bold text-white/80">hola@floripafacil.com</p>
                 <p class="text-lg text-lime-500 font-medium">www.floripafacil.com</p>
             </div>
        </div>
    </div>
  `;

  try {
      // Esperar un poco más para que las imágenes externas (crossOrigin) terminen de cargar
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const canvas = await html2canvas(container, {
          useCORS: true,
          allowTaint: false,
          scale: 1.5,
          backgroundColor: '#ffffff',
          width: 1080,
          windowWidth: 1080,
          logging: false
      });
      
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `Flyer_FloripaFacil_${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      link.click();
  } catch (error) {
      console.error("Error al generar flyer:", error);
      alert("Error al generar la imagen. Asegúrese de que su logo sea un enlace directo público.");
  } finally {
      if (document.body.contains(container)) {
          document.body.removeChild(container);
      }
  }
};
