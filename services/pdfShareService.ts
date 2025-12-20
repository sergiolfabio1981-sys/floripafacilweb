
import { ListingItem } from '../types';

// Helper to load image from URL to Base64
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
    console.error("Error loading image for PDF", error);
    return null;
  }
};

export const generateSharePDF = async (item: ListingItem, formattedPrice: string) => {
  const { jsPDF } = (window as any).jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Styles
  const cyanColor = [8, 145, 178]; // Cyan-600
  const orangeColor = [249, 115, 22]; // Orange-500
  const darkColor = [30, 41, 59]; // Slate-800
  const lightGray = [241, 245, 249]; // Slate-100
  const textGray = [71, 85, 105]; // Slate-600

  // 1. BRAND HEADER
  // Background
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, 210, 30, 'F');
  
  // Logo Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...cyanColor);
  doc.text("FLORIPA", 15, 20);
  doc.setTextColor(...orangeColor);
  doc.text("FÁCIL", 55, 20);
  
  // Contact Info in Header
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text("www.floripafacil.com", 200, 12, { align: 'right' });
  doc.text("+54 9 11 4063 2644", 200, 18, { align: 'right' });
  doc.text("hola@floripafacil.com", 200, 24, { align: 'right' });

  // 2. HERO IMAGE
  let currentY = 30;
  const imageUrl = item.images[0];
  if (imageUrl) {
      try {
          const imgData = await getDataUrl(imageUrl);
          if (imgData) {
              doc.addImage(imgData, 'JPEG', 0, 30, 210, 90); // Full width image
          }
      } catch (e) {
          console.error(e);
      }
  }
  currentY += 95; // Move below image

  // 3. TITLE & PRICE BLOCK
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(...darkColor);
  
  // Title wrapping
  const titleLines = doc.splitTextToSize(item.title.toUpperCase(), 130);
  doc.text(titleLines, 15, currentY);
  
  // Price Tag (Right Side)
  doc.setFillColor(...orangeColor);
  doc.roundedRect(150, currentY - 10, 50, 25, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text("PRECIO FINAL", 175, currentY - 2, { align: 'center' });
  doc.setFontSize(16);
  doc.text(formattedPrice, 175, currentY + 8, { align: 'center' });

  currentY += (titleLines.length * 10) + 10;

  // Location
  doc.setFontSize(12);
  doc.setTextColor(...textGray);
  doc.setFont("helvetica", "normal");
  doc.text(`📍 ${item.location}`, 15, currentY - 10);

  // Divider
  doc.setDrawColor(220, 220, 220);
  doc.line(15, currentY, 195, currentY);
  currentY += 10;

  // 4. DETAILED SECTIONS
  
  // -- RESUMEN --
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...cyanColor);
  doc.text("RESUMEN DEL VIAJE", 15, currentY);
  currentY += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);
  const descLines = doc.splitTextToSize(item.description, 180);
  doc.text(descLines, 15, currentY);
  currentY += (descLines.length * 6) + 10;

  // -- FECHAS & DETALLES --
  // Two columns layout
  const col1X = 15;
  const col2X = 110;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...cyanColor);
  doc.text("FECHAS DE SALIDA", col1X, currentY);
  doc.text("SERVICIOS INCLUIDOS", col2X, currentY);
  currentY += 8;

  const startListY = currentY;
  let col1Y = startListY;
  let col2Y = startListY;

  // Col 1: Dates
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);

  if ('availableDates' in item && (item as any).availableDates.length > 0) {
      (item as any).availableDates.forEach((date: string) => {
          doc.text(`• ${date}`, col1X, col1Y);
          col1Y += 6;
      });
  } else if (item.type === 'worldcup' || item.type === 'installment') {
       doc.text(`• Salida Programada: ${(item as any).departureDate}`, col1X, col1Y);
       col1Y += 6;
  } else {
      doc.text("• Consultar disponibilidad", col1X, col1Y);
      col1Y += 6;
  }

  // Col 2: Services
  const services = [];
  if ((item as any).includesFlight) services.push("Aéreos Ida y Vuelta");
  if (item.type === 'trip' || item.type === 'worldcup') {
      services.push("Alojamiento Seleccionado");
      services.push("Traslados In/Out");
      services.push("Asistencia al Viajero");
  }
  if (item.type === 'hotel') {
      services.push(...((item as any).amenities || []).slice(0, 5));
  }
  if (item.type === 'rental') {
      services.push("Propiedad Entera");
      services.push(...((item as any).amenities || []).slice(0, 4));
  }
  if (item.type === 'excursion') {
      services.push(`Duración: ${(item as any).duration}`);
      services.push("Guía Especializado");
  }

  services.forEach(svc => {
      doc.setTextColor(34, 197, 94); // Green
      doc.text("✓", col2X, col2Y);
      doc.setTextColor(60, 60, 60);
      doc.text(svc, col2X + 5, col2Y);
      col2Y += 6;
  });

  currentY = Math.max(col1Y, col2Y) + 20;

  // 5. FOOTER CALL TO ACTION
  doc.setFillColor(255, 247, 237); 
  doc.setDrawColor(...orangeColor);
  doc.roundedRect(15, currentY, 180, 35, 3, 3, 'FD'); 

  doc.setFontSize(14);
  doc.setTextColor(...orangeColor);
  doc.setFont("helvetica", "bold");
  doc.text("¿TE INTERESA ESTA PROPUESTA?", 105, currentY + 12, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  doc.text("Contáctanos ahora por WhatsApp para reservar tu lugar.", 105, currentY + 22, { align: 'center' });
  doc.text("+54 9 11 4063 2644", 105, currentY + 28, { align: 'center' });

  const cleanTitle = item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`Floripa_Facil_${cleanTitle}.pdf`);
};
