
import { ListingItem } from '../types';
import html2canvas from 'html2canvas';

export const generateShareImage = async (item: ListingItem, formattedPrice: string) => {
  const container = document.createElement('div');
  container.id = 'flyer-generator';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '1080px';
  container.style.minHeight = '1350px';
  container.style.backgroundColor = '#ffffff';
  document.body.appendChild(container);

  const mainImage = item.images[0];
  const logoUrl = "https://i.ibb.co/L6WvF7X/Logo-Floripa-Facil.png"; 
  
  let duration = "TEMPORADA 2025/2026";
  if ('durationLabel' in item && item.durationLabel) duration = item.durationLabel;
  else if ('duration' in item && item.duration) duration = item.duration;

  container.innerHTML = `
    <div style="width: 100%; height: 100%; background-color: #ffffff; padding: 0; margin: 0; font-family: sans-serif;">
        <div style="width: 100%; height: 20px; background-color: #16a34a;"></div>
        
        <div style="padding: 60px 80px; display: flex; align-items: center; justify-content: space-between;">
            <div style="max-width: 70%;">
                <h1 style="font-size: 72px; font-weight: 900; color: #16a34a; margin: 0; line-height: 0.9; text-transform: uppercase;">${item.title}</h1>
                <h2 style="font-size: 32px; font-weight: 700; color: #94a3b8; margin-top: 15px; text-transform: uppercase;">📍 ${item.location}</h2>
            </div>
            <div style="width: 160px; height: 160px; background: #f8fafc; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 8px solid #f0fdf4;">
                <img src="${logoUrl}" style="width: 130px; height: auto;" crossorigin="anonymous" />
            </div>
        </div>

        <div style="padding: 0 80px;">
            <div style="width: 100%; height: 600px; border-radius: 40px; overflow: hidden; position: relative; border: 15px solid #ffffff; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
                <img src="${mainImage}" style="width: 100%; height: 100%; object-fit: cover;" crossorigin="anonymous" />
                <div style="position: absolute; bottom: 30px; right: 30px; background-color: #a3e635; color: #064e3b; padding: 20px 40px; border-radius: 20px; font-weight: 900; font-size: 32px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                    ${duration}
                </div>
            </div>
        </div>

        <div style="margin: 60px 80px; padding: 60px; background-color: #f0fdf4; border-radius: 40px; border: 3px solid #dcfce7; text-align: center;">
            <h3 style="font-size: 36px; color: #166534; font-weight: 700; margin-bottom: 20px;">Tu próxima aventura comienza aquí</h3>
            <div style="font-size: 110px; font-weight: 900; color: #16a34a; line-height: 1;">${formattedPrice}</div>
            <p style="font-size: 24px; color: #64748b; margin-top: 30px; font-style: italic;">* Consulta financiación y disponibilidad con Floripa Fácil</p>
        </div>

        <div style="width: 100%; background-color: #064e3b; padding: 60px 80px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
             <div>
                 <p style="font-size: 20px; font-weight: 700; color: #a3e635; text-transform: uppercase; margin-bottom: 5px;">RESERVA AHORA</p>
                 <p style="font-size: 48px; font-weight: 900;">+54 9 11 4063 2644</p>
             </div>
             <div style="text-align: right;">
                 <p style="font-size: 24px; font-weight: 700;">www.floripafacil.com</p>
                 <p style="font-size: 18px; color: #a3e635;">#FloripaFacil</p>
             </div>
        </div>
    </div>
  `;

  try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const canvas = await html2canvas(container, {
          useCORS: true,
          scale: 1,
          backgroundColor: '#ffffff',
          logging: false,
          width: 1080,
          windowWidth: 1080
      });
      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Flyer_FloripaFacil_${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.jpg`;
      link.click();
  } catch (error) {
      console.error("Flyer generation error:", error);
      alert("Problema al generar flyer.");
  } finally {
      if (document.body.contains(container)) document.body.removeChild(container);
  }
};