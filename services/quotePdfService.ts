
import { ListingItem } from '../types';

interface QuoteData {
    clientName: string;
    destination: string;
    origin: string;
    dates: string;
    passengers: number;
    price: number;
    description: string;
    guideText: string;
    imageUrl: string;
}

// Helper to load image
const getDataUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return null;
  }
};

export const generateQuotePDF = async (data: QuoteData) => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Colors
  const cyanColor = [8, 145, 178];
  const orangeColor = [249, 115, 22];
  const darkColor = [30, 41, 59];

  // Helper for footer
  const addFooter = (pageNumber: number) => {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("ABRAS Travel - +54 9 11 4063 2644 - info@abrastravel.com", 105, 290, { align: 'center' });
      doc.text(`Página ${pageNumber}`, 200, 290, { align: 'right' });
  };

  // --- PAGE 1: PORTADA ---
  // Background Header
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 297, 'F'); // Full dark background for cover elegance? No, let's do header.
  
  // Clean White Background for Cover
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, 210, 297, 'F');

  // Big Header
  doc.setFillColor(...cyanColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Logo Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(255, 255, 255);
  doc.text("ABRAS", 20, 28);
  doc.setTextColor(...orangeColor);
  doc.text("Travel", 65, 28);

  // Proposal Title
  doc.setFontSize(22);
  doc.setTextColor(...darkColor);
  doc.text("PROPUESTA DE VIAJE", 105, 70, { align: 'center' });
  
  doc.setDrawColor(...orangeColor);
  doc.setLineWidth(1);
  doc.line(70, 75, 140, 75);

  // Client Info Box
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(30, 90, 150, 60, 3, 3, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(...cyanColor);
  doc.text("PREPARADO PARA:", 105, 105, { align: 'center' });
  
  doc.setFontSize(24);
  doc.setTextColor(...darkColor);
  doc.text(data.clientName.toUpperCase(), 105, 120, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 105, 135, { align: 'center' });

  // Destination Image (Cover)
  if (data.imageUrl) {
      const imgData = await getDataUrl(data.imageUrl);
      if (imgData) {
          doc.addImage(imgData, 'JPEG', 30, 170, 150, 90);
      }
  }

  // Destination Name
  doc.setFontSize(18);
  doc.setTextColor(...darkColor);
  doc.text(data.destination.toUpperCase(), 105, 275, { align: 'center' });

  addFooter(1);

  // --- PAGE 2: DETALLES ---
  doc.addPage();
  
  // Header Strip
  doc.setFillColor(...cyanColor);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("DETALLES DE LA PROPUESTA", 15, 13);

  let y = 40;

  // Itinerary / Description
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...darkColor);
  doc.text("RESUMEN DEL SERVICIO", 15, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(data.description, 180);
  doc.text(descLines, 15, y);
  y += (descLines.length * 6) + 15;

  // Details Grid
  doc.setFillColor(240, 248, 255);
  doc.rect(15, y, 180, 40, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  
  let gridY = y + 10;
  doc.text(`• ORIGEN: ${data.origin}`, 20, gridY);
  doc.text(`• DESTINO: ${data.destination}`, 110, gridY);
  
  gridY += 10;
  doc.text(`• FECHAS: ${data.dates}`, 20, gridY);
  doc.text(`• PASAJEROS: ${data.passengers}`, 110, gridY);

  y += 55;

  // Price
  doc.setFontSize(16);
  doc.setTextColor(...orangeColor);
  doc.text("INVERSIÓN TOTAL", 15, y);
  y += 10;
  
  doc.setFontSize(28);
  doc.setTextColor(...darkColor);
  doc.text(`USD ${data.price.toLocaleString()}`, 15, y);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  y += 8;
  doc.text("* Tarifas sujetas a disponibilidad y cambios sin previo aviso.", 15, y);
  doc.text("* Impuestos incluidos.", 15, y + 5);

  addFooter(2);

  // --- PAGE 3: GUIA TURISTICA ---
  if (data.guideText) {
      doc.addPage();
      
      // Header Strip
      doc.setFillColor(...orangeColor);
      doc.rect(0, 0, 210, 20, 'F');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(`DESCUBRÍ ${data.destination.toUpperCase()}`, 15, 13);

      y = 40;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      
      const guideLines = doc.splitTextToSize(data.guideText, 180);
      doc.text(guideLines, 15, y);
      
      // Add Image again if space permits or another one
      if (data.imageUrl && guideLines.length < 25) {
           const imgY = y + (guideLines.length * 7) + 20;
           const imgData = await getDataUrl(data.imageUrl);
           if (imgData) {
               doc.addImage(imgData, 'JPEG', 30, imgY, 150, 80);
           }
      }

      addFooter(3);
  }

  doc.save(`Presupuesto_${data.clientName.replace(/\s/g, '_')}.pdf`);
};
