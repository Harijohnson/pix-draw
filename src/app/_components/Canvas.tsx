'use client';

import React, { useEffect, useRef, useState } from 'react';

interface CanvasProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>; // Optional canvasRef prop
}

function Canvas({ canvasRef }: CanvasProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null); // Internal ref if no prop is passed
  const [cellSize] = useState(25); // Size of each cell in pixels
  const [gridWidth, setGridWidth] = useState(16); // Default grid width
  const [gridHeight, setGridHeight] = useState(16); // Default grid height
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAdvanced, setIsAdvanced] = useState(false); // Advanced mode toggle
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  const actualCanvasRef = canvasRef || internalCanvasRef; // Use the passed ref or the internal one

  useEffect(() => {
    const canvas = actualCanvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      setCtx(context);
      if (context) {
        canvas.width = gridWidth * cellSize;
        canvas.height = gridHeight * cellSize;
        drawGrid(context);
      }
    }
  }, [gridWidth, gridHeight]);

  const drawGrid = (context: CanvasRenderingContext2D) => {
    context.clearRect(0, 0, gridWidth * cellSize, gridHeight * cellSize);

    context.strokeStyle = '#ccc';
    context.lineWidth = 0.5;

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        context.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (ctx && actualCanvasRef.current) {
      const rect = actualCanvasRef.current.getBoundingClientRect();
      const x = Math.floor((event.clientX - rect.left) / cellSize);
      const y = Math.floor((event.clientY - rect.top) / cellSize);

      // Fill the clicked cell with black
      ctx.fillStyle = 'black';
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      // Optional: Log coordinates
      console.log(`Clicked Cell: (${x}, ${y})`);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 1;
    setGridWidth(value);
    if (!isAdvanced) setGridHeight(value); // Sync height if not advanced
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
      <h3 className="text-center py-3">Pix Draw</h3>
      <div className="flex justify-center items-center text-center px-4 py-2">
        <canvas
          ref={actualCanvasRef}
          className="border border-white shadow-lg cursor-pointer bg-white"
          onClick={handleCanvasClick}
        ></canvas>
      </div>

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
  );
}

export default Canvas;
