/**
 * Downloads the plan as a PDF file
 * @param {object} plan - The plan object to export
 */
export const downloadPDF = async (plan) => {
  try {
    const response = await fetch('http://localhost:4000/api/export/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan })
    });

    if (!response.ok) throw new Error('PDF generation failed');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plan-${plan.goal.substring(0, 30)}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to generate PDF. Please ensure the backend is running.');
  }
};
