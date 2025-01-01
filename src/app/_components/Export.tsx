'use client';

import React, { useState } from 'react';

function Export({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  const [format, setFormat] = useState('jpeg'); // Default format

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert('No canvas found!');
      return;
    }

    const link = document.createElement('a');

    if (format === 'jpeg' || format === 'png') {
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      link.href = canvas.toDataURL(mimeType);
      link.download = `canvas.${format}`;
    } else if (format === 'svg') {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgData = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
          <foreignObject width="100%" height="100%">
            <div xmlns="http://www.w3.org/1999/xhtml">
              ${ctx.canvas.outerHTML}
            </div>
          </foreignObject>
        </svg>
      `;

      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      link.href = url;
      link.download = 'canvas.svg';
    } else if (format === 'pdf') {
      import('jspdf').then(jsPDF => {
        const pdf = new jsPDF.jsPDF();
        const imgData = canvas.toDataURL('image/jpeg');
        pdf.addImage(imgData, 'JPEG', 10, 10, canvas.width / 10, canvas.height / 10);
        pdf.save('canvas.pdf');
      });
      return; // Skip link click for PDF
    }

    link.click();
  };

  return (
    <div className="flex items-center space-x-4 justify-center mt-4">
      <button
        onClick={handleExport}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Export Canvas
      </button>
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="border border-gray-300 p-2 rounded"
      >
        <option value="jpeg">JPEG</option>
        <option value="png">PNG</option>
        <option value="svg">SVG</option>
        <option value="pdf">PDF</option>
      </select>
    </div>
  );
}

export default Export;
