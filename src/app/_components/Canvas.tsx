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
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000'); // Colour for cells

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
    context.lineWidth = 0.00000000000001;

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

      // Fill the clicked cell with the selected colour
      ctx.fillStyle = selectedColor;
      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      // Optional: Log coordinates
      console.log(`Clicked Cell: (${x}, ${y})`);
    }
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
    </div>
  );
}

export default Canvas;
