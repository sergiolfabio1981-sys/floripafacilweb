
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

const getDataUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch (error) { return null; }
};

export const generateQuotePDF = async (data: QuoteData) => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  
  const greenPrimary = [22, 163, 74];
  const limeSecondary = [132, 204, 22];
  const darkText = [31, 41, 55];

  const addFooter = (pageNumber: number) => {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Floripa Fácil - Turismo Receptivo - Florianópolis, Brasil", 105, 290, { align: 'center' });
      doc.text(`Página ${pageNumber}`, 200, 290, { align: 'right' });
  };

  // --- PAGE 1: PORTADA ---
  doc.setFillColor(...greenPrimary);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text("FLORIPA FÁCIL", 20, 30);
  
  doc.setFontSize(22);
  doc.setTextColor(...darkText);
  doc.text("PROPUESTA DE TURISMO", 105, 75, { align: 'center' });
  
  doc.setDrawColor(...limeSecondary);
  doc.setLineWidth(1);
  doc.line(70, 80, 140, 80);

  doc.setFillColor(240, 253, 244);
  doc.roundedRect(30, 95, 150, 55, 3, 3, 'F');
  doc.setFontSize(14);
  doc.setTextColor(...greenPrimary);
  doc.text("CLIENTE:", 105, 110, { align: 'center' });
  doc.setFontSize(22);
  doc.setTextColor(...darkText);
  doc.text(data.clientName.toUpperCase(), 105, 125, { align: 'center' });

  if (data.imageUrl) {
      const imgData = await getDataUrl(data.imageUrl);
      if (imgData) doc.addImage(imgData, 'JPEG', 30, 165, 150, 95);
  }

  doc.setFontSize(18);
  doc.setTextColor(...greenPrimary);
  doc.text(data.destination.toUpperCase(), 105, 275, { align: 'center' });
  addFooter(1);

  // --- PAGE 2: SERVICIOS ---
  doc.addPage();
  doc.setFillColor(...greenPrimary);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("DETALLES DE LA COTIZACIÓN", 15, 13);

  let y = 40;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...darkText);
  doc.text("ITINERARIO Y SERVICIOS", 15, y);
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  const descLines = doc.splitTextToSize(data.description, 180);
  doc.text(descLines, 15, y);
  y += (descLines.length * 6) + 20;

  doc.setFillColor(247, 254, 231);
  doc.rect(15, y, 180, 45, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  let gridY = y + 10;
  doc.text(`• ORIGEN: ${data.origin}`, 25, gridY);
  doc.text(`• FECHA: ${data.dates}`, 25, gridY + 12);
  doc.text(`• PERSONAS: ${data.passengers}`, 25, gridY + 24);

  y += 65;
  doc.setFontSize(18);
  doc.setTextColor(...greenPrimary);
  doc.text("INVERSIÓN TOTAL", 15, y);
  doc.setFontSize(32);
  doc.setTextColor(...darkText);
  doc.text(`USD ${data.price.toLocaleString()}`, 15, y + 15);

  addFooter(2);
  doc.save(`FloripaFacil_Cotizacion_${data.clientName.replace(/\s/g, '_')}.pdf`);
};
