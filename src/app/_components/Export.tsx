'use client';

import React, { useState } from 'react';

function Export({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement> }) {
  const [format, setFormat] = useState('jpeg'); // Default format
  const [gridWidth, setGridWidth] = useState(16); // Default grid width
  const [gridHeight, setGridHeight] = useState(16); // Default grid height
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false); // Advanced mode toggle
  

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10) || 1;
      setGridWidth(value);
      if (!isAdvanced) setGridHeight(value); // Sync height if not advanced
    };


    const handleExport = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        alert('No canvas found!');
        return;
      }
    
      const link = document.createElement('a');
    
      if (format === 'jpeg' || format === 'png') {
        exportImage(canvas, format, link);
      } else if (format === 'svg') {
        exportSVG(canvas, link);
      } else if (format === 'pdf') {
        exportPDF(canvas);
      }
    
      link.click();
    };
    
    const exportImage = (canvas: HTMLCanvasElement, format: string, link: HTMLAnchorElement) => {
      const tempCanvas = document.createElement('canvas');
      const tempContext = tempCanvas.getContext('2d');
    
      const scale = 10; // Adjust for higher resolution
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;
    
      if (tempContext) {
        // Set white background only for JPEG
        if (format === 'jpeg') {
          tempContext.fillStyle = 'white';
          tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height); // Fill white background
        }
    
        tempContext.scale(scale, scale);
        tempContext.drawImage(canvas, 0, 0);
      }
    
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      link.href = tempCanvas.toDataURL(mimeType, format === 'jpeg' ? 0.95 : 1.0); // Adjust quality
      link.download = `canvas.${format}`;
    };
    
    const exportSVG = (canvas: HTMLCanvasElement, link: HTMLAnchorElement) => {
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
    };
    
    const exportPDF = (canvas: HTMLCanvasElement) => {
      import('jspdf').then((jsPDF) => {
        const pdf = new jsPDF.jsPDF();
        const tempCanvas = document.createElement('canvas');
        const tempContext = tempCanvas.getContext('2d');
    
        const scale = 2; // Adjust for higher resolution
        tempCanvas.width = canvas.width * scale;
        tempCanvas.height = canvas.height * scale;
    
        if (tempContext) {
          tempContext.scale(scale, scale);
          tempContext.drawImage(canvas, 0, 0);
        }
    
        const imgData = tempCanvas.toDataURL('image/jpeg', 0.95); // Higher quality JPEG
        pdf.addImage(imgData, 'JPEG', 10, 10, canvas.width / 10, canvas.height / 10);
        pdf.save('canvas.pdf');
      });
    };
    
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;
    setGridHeight(value);
    if (!isAdvanced) setGridWidth(value); // Sync width if not advanced
  };

  const handleCheckboxToggle = () => {
    setIsAdvanced(!isAdvanced);
  };

  const handleModalSubmit = () => {
    setModalOpen(false);
  };
  return (
    <div>
    <div className="flex items-center space-x-4 justify-center mt-4">
      <button
        onClick={handleExport}
        className="bg-blue-500 text-black px-4 py-2 rounded"
      >
        Export Canvas
      </button>
      <select
        value={format}
        onChange={(e) => setFormat(e.target.value)}
        className="border border-gray-300 p-2 rounded text-black"
      >
        <option value="jpeg">JPEG</option>
        <option value="png">PNG</option>
        <option value="svg">SVG</option>
        <option value="pdf">PDF</option>
      </select>
    </div>

    <div className='mt-4'>
       {/* Customize Grid Button */}
       <div className="text-center mt-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 px-4 py-2 rounded text-black"
        >
          Customize Grid
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h4 className="text-lg font-semibold mb-4 text-black">Customize Grid</h4>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black">Grid Width</label>
              <input
                type="number"
                value={gridWidth}
                onChange={handleWidthChange}
                className="border border-gray-300 p-2 rounded w-full text-black"
                min="1"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-black">Grid Height</label>
              <input
                type="number"
                value={gridHeight}
                onChange={handleHeightChange}
                className="border border-gray-300 p-2 rounded w-full text-black"
                min="1"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center text-black">
                <input
                  type="checkbox"
                  checked={isAdvanced}
                  onChange={handleCheckboxToggle}
                  className="mr-2 text-black"
                />
                Enable Advanced Options
              </label>
            </div>

            <div className="text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded text-black"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
    </div>

  );
}

export default Export;
