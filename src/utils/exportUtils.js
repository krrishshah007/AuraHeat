import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Export dataset to CSV
export const exportToCSV = (data, filename = 'aurheat_climate_export.csv') => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => 
    Object.values(row).map(val => 
      typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    ).join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export element to PDF Advisory
export const exportToPDF = async (elementId, filename = 'aurheat_advisory_report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    // Generate programmatic PDF fallback if DOM element not supplied directly
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38);
    doc.text('🔥 AurHeat Emergency Heatwave Advisory', 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 32);
    doc.text('National Disaster Management Authority - Climate Warning Notice', 14, 40);
    doc.line(14, 45, 196, 45);
    
    doc.setFontSize(14);
    doc.text('Safety Directives:', 14, 55);
    doc.setFontSize(11);
    doc.text('1. Restrict outdoor physical activities between 11:00 AM and 4:00 PM.', 14, 65);
    doc.text('2. Drink at least 3-4 liters of oral rehydration fluids daily.', 14, 73);
    doc.text('3. Monitor vulnerable individuals (infants, elderly, chronic illness patients).', 14, 81);
    doc.text('4. Contact Emergency Helpline: 112 or 108 for heatstroke emergency.', 14, 89);
    
    doc.save(filename);
    return;
  }

  try {
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error('PDF Export Error:', error);
  }
};
