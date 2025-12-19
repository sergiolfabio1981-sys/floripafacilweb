
import { ListingItem } from '../types';
import html2canvas from 'html2canvas';

export const generateShareImage = async (item: ListingItem, formattedPrice: string) => {
  // 1. Create a hidden container for the Flyer
  const container = document.createElement('div');
  container.id = 'flyer-generator';
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '1080px'; // Standard social media vertical width
  container.style.minHeight = '1500px'; // Increased height to prevent overlaps
  container.style.backgroundColor = '#f8fafc'; // slate-50
  container.style.fontFamily = "'Poppins', sans-serif";
  document.body.appendChild(container);

  // 2. Prepare Data
  const mainImage = item.images[0];
  const secondaryImage = item.images[1] || item.images[0];
  const tertiaryImage = item.images[2] || item.images[0];
  
  // Parse Duration
  let days = "8";
  let nights = "7";
  if ('durationLabel' in item && item.durationLabel) {
      const match = item.durationLabel.match(/(\d+)\s*DÍAS?\s*\/\s*(\d+)\s*NOCHES?/i);
      if (match) {
          days = match[1];
          nights = match[2];
      }
  } else if (item.type === 'rental') {
      days = "?";
      nights = "?";
  }

  // Parse Dates
  let datesHtml = '';
  if ('availableDates' in item && item.availableDates && item.availableDates.length > 0) {
      // Take up to 8 dates to avoid overflow, split into 2 columns in HTML
      datesHtml = item.availableDates.slice(0, 8).map(d => `
        <div class="flex items-center gap-2 mb-3">
            <div class="w-3 h-3 rounded-full bg-[#06b6d4] flex-shrink-0"></div>
            <span class="text-lg text-slate-700 font-semibold whitespace-nowrap">${d}</span>
        </div>
      `).join('');
  } else if ('departureDate' in item) {
      datesHtml = `
        <div class="flex items-center gap-3 mb-2 col-span-2 justify-center">
            <div class="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
            <span class="text-2xl text-slate-700 font-semibold">Salida: ${(item as any).departureDate}</span>
        </div>`;
  }

  // 3. Build HTML Structure
  // Added more vertical spacing (gap, margin-bottom) to prevent overlaps
  // Changed price font size from text-8xl to text-7xl to fit "USD" prefix
  container.innerHTML = `
    <div class="relative w-full h-full bg-[#f0f9ff] flex flex-col items-center pb-0 overflow-hidden box-border">
        
        <!-- Header Brand Line -->
        <div class="w-full h-6 bg-[#0e3c63]"></div>

        <!-- Title Section -->
        <div class="w-full text-center pt-12 pb-8 px-12">
            <h1 class="text-5xl font-black text-[#0891b2] uppercase leading-tight tracking-tight drop-shadow-sm mb-4" style="color: #0891b2; line-height: 1.2;">
                ${item.title}
            </h1>
            <h2 class="text-2xl font-bold text-[#0e3c63] uppercase tracking-widest" style="color: #0e3c63;">
                ${item.location}
            </h2>
        </div>

        <!-- Collage Section -->
        <div class="relative w-full px-10 h-[600px] flex gap-6 mb-12">
            <!-- Left Large Image -->
            <div class="w-2/3 h-full rounded-tl-[60px] rounded-br-[60px] overflow-hidden shadow-2xl border-8 border-white relative z-10 bg-gray-200">
                <img src="${mainImage}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
            </div>
            
            <!-- Right Small Images Column -->
            <div class="w-1/3 h-full flex flex-col gap-6 pt-12">
                 <div class="w-full h-1/2 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-200">
                    <img src="${secondaryImage}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
                 </div>
                 <div class="w-full h-1/2 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-200">
                    <img src="${tertiaryImage}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
                 </div>
            </div>

            <!-- Duration Badge Overlay -->
            <div class="absolute top-12 right-6 bg-white px-8 py-6 shadow-2xl z-20 flex flex-col items-center justify-center border-l-[10px] border-[#0e3c63]">
                <div class="flex items-baseline gap-3">
                    <span class="text-7xl font-black text-[#0e3c63]">${days}</span>
                    <span class="text-5xl font-light text-gray-300">|</span>
                    <span class="text-7xl font-black text-[#0e3c63]">${nights}</span>
                </div>
                <div class="flex items-center gap-10 mt-2 w-full justify-between px-2">
                    <span class="text-base font-bold tracking-widest text-[#0891b2]">DÍAS</span>
                    <span class="text-base font-bold tracking-widest text-[#0891b2]">NOCHES</span>
                </div>
            </div>
        </div>

        <!-- Icons / Services Row -->
        <div class="flex justify-center gap-16 mb-12 w-full px-10">
            <div class="flex flex-col items-center gap-3">
                <div class="p-4 border-4 border-[#0e3c63] rounded-2xl text-[#0e3c63]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <span class="text-lg font-bold text-[#0e3c63] tracking-wider">HOTEL</span>
            </div>
            ${(item as any).includesFlight ? `
            <div class="flex flex-col items-center gap-3">
                <div class="p-4 border-4 border-[#0e3c63] rounded-2xl text-[#0e3c63]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <span class="text-lg font-bold text-[#0e3c63] tracking-wider">VUELOS</span>
            </div>` : ''}
            <div class="flex flex-col items-center gap-3">
                <div class="p-4 border-4 border-[#0e3c63] rounded-2xl text-[#0e3c63]">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
                <span class="text-lg font-bold text-[#0e3c63] tracking-wider">TRASLADOS</span>
            </div>
        </div>

        <!-- Dates Box (Fixed layout to avoid overlap) -->
        <div class="w-[90%] mx-auto mt-6 mb-10">
            <div class="relative border-4 border-[#0891b2] bg-white rounded-xl pt-12 pb-10 px-8">
                <div class="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#0891b2] px-10 py-3 rounded-full shadow-lg">
                    <h3 class="text-2xl font-bold text-white tracking-wider uppercase">Fechas de Salida</h3>
                </div>
                <div class="grid grid-cols-2 gap-x-8 gap-y-2 justify-items-center">
                    ${datesHtml || '<p class="text-2xl text-gray-500 italic col-span-2">Consultar Disponibilidad</p>'}
                </div>
            </div>
        </div>

        <!-- Price & CTA Footer -->
        <div class="mt-auto mb-10 text-center w-full bg-white py-10 shadow-inner">
            <h2 class="text-6xl font-black italic text-[#0e3c63] mb-4" style="font-family: sans-serif;">¡Reserva Ahora!</h2>
            <div class="text-3xl text-slate-500 font-medium tracking-wide">Precio FINAL por Persona</div>
            <div class="text-7xl font-black text-[#0891b2] mt-4 tracking-tight drop-shadow-sm">${formattedPrice}</div>
            <div class="text-lg text-slate-400 mt-4 font-medium">* Tarifas sujetas a disponibilidad y cambios.</div>
        </div>

        <!-- Brand Footer -->
        <div class="w-full bg-[#0e3c63] py-8 px-12 flex justify-between items-center text-white mt-auto">
             <div class="flex items-center gap-4">
                 <img src="https://i.ibb.co/VWjb9tVp/Logo-ABRAS.png" style="height: 80px; width: auto;" crossorigin="anonymous"/>
             </div>
             <div class="text-right">
                 <p class="font-bold text-2xl tracking-wide">+54 9 11 4063 2644</p>
                 <p class="text-cyan-400 text-xl">info@abrastravel.com</p>
             </div>
        </div>

    </div>
  `;

  // 4. Capture
  try {
      // Small delay to ensure images inside html are loaded
      await new Promise(resolve => setTimeout(resolve, 800));

      const canvas = await html2canvas(container, {
          useCORS: true, // Critical for external images
          scale: 2, // High resolution
          backgroundColor: '#f8fafc',
          width: 1080,
          windowWidth: 1080
      });

      const image = canvas.toDataURL("image/png");
      
      // 5. Download
      const link = document.createElement('a');
      link.href = image;
      link.download = `ABRAS_Travel_${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
      link.click();

  } catch (error) {
      console.error("Error generating image:", error);
      alert("No se pudo generar la imagen. Intenta de nuevo.");
  } finally {
      document.body.removeChild(container);
  }
};
