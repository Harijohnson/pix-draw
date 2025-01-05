import React, { useState } from 'react';
import ColorPicker from './ColorPicker';

const Edit: React.FC = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#ffffff');

  const handleColorChange = (color: string) => {
    setSelectedColor(color); // Update the selected color
  };

  const handleConfirm = () => {
    setShowPicker(false); // Close the color picker on confirmation
  };

  return (
    <div className="text-center space-y-4">
      <h1 className="text-xl font-bold">Edit</h1>

      {/* Toggle Button */}
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setShowPicker((prev) => !prev)}
      >
        {showPicker ? 'Close Color Picker' : 'Open Color Picker'}
      </button>

      {/* Color Picker */}
      {showPicker && (
        <div className="mt-4">
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={handleColorChange}
            onClose={handleConfirm} // Explicit close logic
          />
        </div>
      )}

      {/* Display Selected Color */}
      <p
        className="mt-4 text-lg font-medium"
        style={{ color: selectedColor }}
      >
        Selected Color: {selectedColor}
      </p>
    </div>
  );
};

export default Edit;
