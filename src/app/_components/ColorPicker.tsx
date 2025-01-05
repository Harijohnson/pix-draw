'use client'

import React, { useState, useEffect, useRef } from 'react'

const ColorPicker: React.FC = () => {
  const [color, setColor] = useState('#FF0000') // Start with red
  const [hue, setHue] = useState(0) // Initial hue
  const [saturation, setSaturation] = useState(100) // Initial saturation
  const [lightness, setLightness] = useState(50) // Initial lightness
  const [position, setPosition] = useState({ x: 100, y: 0 }) // Start position for the pointer
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const hueSliderRef = useRef<HTMLDivElement>(null)

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100
    const a = s * Math.min(l, 1 - l) / 100
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
  }

  const handleColorChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!colorPickerRef.current) return

    const rect = colorPickerRef.current.getBoundingClientRect()
    const x = Math.min(Math.max(('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left, 0), rect.width)
    const y = Math.min(Math.max(('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top, 0), rect.height)

    const newSaturation = (x / rect.width) * 100
    const newLightness = 100 - (y / rect.height) * 100

    setSaturation(newSaturation)
    setLightness(newLightness)

    setColor(hslToHex(hue, newSaturation, newLightness))
    setPosition({ x, y })
  }

  const handleHueChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!hueSliderRef.current) return

    const rect = hueSliderRef.current.getBoundingClientRect()
    const x = Math.min(Math.max(('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left, 0), rect.width)

    const newHue = Math.round((x / rect.width) * 360)
    setHue(newHue)
    setColor(hslToHex(newHue, saturation, lightness)) // Keep current saturation and lightness
  }

  const handleMouseDown = (handler: typeof handleColorChange | typeof handleHueChange) => (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    handler(e)
    document.addEventListener('mousemove', handler as any)
    document.addEventListener('touchmove', handler as any)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('touchend', handleMouseUp)
  }

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleColorChange as any)
    document.removeEventListener('touchmove', handleColorChange as any)
    document.removeEventListener('mousemove', handleHueChange as any)
    document.removeEventListener('touchmove', handleHueChange as any)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('touchend', handleMouseUp)
  }

  // Copy color to clipboard
  const exportColor = () => {
    navigator.clipboard.writeText(color)
      .then(() => alert(`Color ${color} copied to clipboard!`))
      .catch(() => alert('Failed to copy color to clipboard.'))
  }

  return (
    <div className="flex items-center justify-center ">
      <div className="w-[20vw] h-[50vh] shadow-lg rounded-lg flex flex-col items-center justify-center p-2 bg-white">
        {/* Color picker (saturation and lightness) */}
        <div 
          ref={colorPickerRef}
          className="w-full h-4/5 rounded-lg cursor-crosshair relative overflow-hidden"
          style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }} // Background with fixed hue
          onMouseDown={handleMouseDown(handleColorChange)}
          onTouchStart={handleMouseDown(handleColorChange)}
          role="slider"
          aria-label="Color saturation and lightness"
          aria-valuetext={color}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
          <div 
            className="absolute w-4 h-4 -mt-2 -ml-2 border-2 border-white rounded-full pointer-events-none"
            style={{
              left: position.x,
              top: position.y,
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Hue slider */}
        <div 
          ref={hueSliderRef}
          className="w-full h-8 rounded-lg cursor-pointer relative"
          style={{ background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }}
          onMouseDown={handleMouseDown(handleHueChange)}
          onTouchStart={handleMouseDown(handleHueChange)}
          role="slider"
          aria-label="Color hue"
          aria-valuetext={`${hue} degrees`}
        >
          <div 
            className="absolute h-full w-1 pointer-events-none rounded-full bg-black"
            style={{
              left: (hue / 360) * 100 + '%',
              background: 'white',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
            }}
          />
        </div>

        {/* Display color */}
        <p className="text-3xl font-bold" style={{ color: color }}>
          {color}
        </p>

        {/* Export Button */}
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={exportColor}
        >
          Copy Color to Clipboard
        </button>
      </div>
    </div>
  )
}

export default ColorPicker
