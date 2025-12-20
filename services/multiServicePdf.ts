
import { ListingItem, Seller } from '../types';

export const generateMultiServicePDF = async (
  items: any[], 
  total: number, 
  reservation: number, 
  currency: string,
  seller?: Seller | null
) => {
  const jspdfLib = (window as any).jspdf;
  
  if (!jspdfLib) {
      alert("La librería de PDF aún se está cargando.");
      return;
  }

  try {
      const { jsPDF } = jspdfLib;
      const doc = new jsPDF('p', 'mm', 'a4');
      
      const greenPrimary = [22, 163, 74];
      const limeSecondary = [132, 204, 22];
      const darkText = [31, 41, 55];

      // Header
      doc.setFillColor(...greenPrimary);
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("FLORIPA FÁCIL", 15, 20);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("TU VIAJE A MEDIDA EN BRASIL", 15, 26);

      // Seller Info in Header
      if (seller) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("AGENTE DE VIAJES:", 200, 15, { align: 'right' });
        doc.setFont("helvetica", "normal");
        doc.text(seller.name.toUpperCase(), 200, 21, { align: 'right' });
        doc.text(`WhatsApp: ${seller.phone}`, 200, 27, { align: 'right' });
        doc.text(seller.email, 200, 33, { align: 'right' });
      } else {
        doc.text("ATENCIÓN AL CLIENTE", 200, 20, { align: 'right' });
        doc.text("+54 9 11 4063 2644", 200, 26, { align: 'right' });
      }

      let y = 60;
      doc.setTextColor(...darkText);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("ITINERARIO DE SERVICIOS COTIZADOS", 15, y);
      doc.setDrawColor(...limeSecondary);
      doc.line(15, y + 2, 110, y + 2);
      y += 15;

      // List Items
      items.forEach((pItem, index) => {
        const item = pItem.item;
        
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(15, y, 180, 28, 2, 2, 'F');
        
        doc.setFontSize(11);
        doc.setTextColor(...greenPrimary);
        doc.text(`${index + 1}. ${item.title.toUpperCase()}`, 20, y + 8);
        
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        const detail = `${pItem.quantity} pax | ${pItem.days || 1} días | Ubicación: ${item.location}`;
        doc.text(detail, 20, y + 14);
        doc.text(`Fecha prevista: ${pItem.date || 'A confirmar'}`, 20, y + 20);
        
        doc.setFontSize(11);
        doc.setTextColor(...darkText);
        doc.setFont("helvetica", "bold");
        doc.text(`${currency} ${pItem.calculatedPrice.toLocaleString()}`, 190, y + 15, { align: 'right' });
        
        y += 32;
        if (y > 250) { doc.addPage(); y = 20; }
      });

      y += 10;
      // Summary Box
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(110, y, 85, 45, 3, 3, 'F');
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("VALOR TOTAL SERVICIOS:", 115, y + 10);
      doc.text(`${currency} ${total.toLocaleString()}`, 190, y + 10, { align: 'right' });

      doc.setFontSize(11);
      doc.setTextColor(...greenPrimary);
      doc.setFont("helvetica", "bold");
      doc.text("SEÑA DE RESERVA (40%):", 115, y + 22);
      doc.text(`${currency} ${reservation.toLocaleString()}`, 190, y + 22, { align: 'right' });

      doc.setTextColor(200, 0, 0);
      doc.text("SALDO EN BRASIL (60%):", 115, y + 35);
      const balance = total - reservation;
      doc.text(`${currency} ${balance.toLocaleString()}`, 190, y + 35, { align: 'right' });

      // Footer
      const footerY = 280;
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Este presupuesto tiene una validez de 48 horas. Precios sujetos a disponibilidad.", 105, footerY, { align: 'center' });
      
      if (seller) {
        doc.setTextColor(...greenPrimary);
        doc.setFont("helvetica", "bold");
        doc.text(`CONSULTAS: ${seller.name} - ${seller.phone}`, 105, footerY + 5, { align: 'center' });
      }

      doc.save(`Cotizacion_FloripaFacil_${Date.now()}.pdf`);
  } catch (err) {
      console.error(err);
      alert("Error al generar PDF");
  }
};
