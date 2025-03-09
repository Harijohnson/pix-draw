"use client"
import { useState, useEffect } from "react"
import { X, Check, Palette   as ColorPickerIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

interface ColorPickerProps {
  currentColor: string
  onClose: () => void
  onColorSelect: (color: string) => void
}

export const ColorPicker = ({ currentColor, onClose, onColorSelect }: ColorPickerProps) => {
  const [selectedColor, setSelectedColor] = useState(currentColor)
  const [recentColors, setRecentColors] = useState<string[]>([])
  const [hexValue, setHexValue] = useState(currentColor)
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 })
  const [hslValues, setHslValues] = useState({ h: 0, s: 0, l: 0 })
  
  // Predefined color palette
  const colorPalette = [
    // Material Design Colors - Red
    "#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F", "#C62828", "#B71C1C",
    // Orange
    "#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00", "#EF6C00", "#E65100",
    // Yellow
    "#FFFDE7", "#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825", "#F57F17",
    // Green
    "#E8F5E9", "#C8E6C9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32", "#1B5E20",
    // Blue
    "#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1",
    // Purple
    "#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2", "#6A1B9A", "#4A148C",
    // Gray
    "#FAFAFA", "#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242", "#212121",
    // Basics
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"
  ]

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace('#', '')
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    return { r, g, b }
  }
  
  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2
    
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      
      h /= 6
    }
    
    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    }
  }
  
  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100
    
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    return { 
      r: Math.round(r * 255), 
      g: Math.round(g * 255), 
      b: Math.round(b * 255) 
    }
  }
  
  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b]
      .map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  }
  
  // Update all color values when selected color changes
  useEffect(() => {
    const rgb = hexToRgb(selectedColor)
    setRgbValues(rgb)
    setHslValues(rgbToHsl(rgb.r, rgb.g, rgb.b))
    setHexValue(selectedColor)
  }, [selectedColor])
  
  // Load recent colors from localStorage
  useEffect(() => {
    const savedColors = localStorage.getItem('recentColors')
    if (savedColors) {
      setRecentColors(JSON.parse(savedColors))
    }
  }, [])
  
  // Update hex when RGB changes
  const handleRgbChange = (key: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgbValues, [key]: value }
    setRgbValues(newRgb)
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setSelectedColor(newHex)
    setHexValue(newHex)
    setHslValues(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }
  
  // Update hex when HSL changes
  const handleHslChange = (key: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...hslValues, [key]: value }
    setHslValues(newHsl)
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgbValues(newRgb)
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    setSelectedColor(newHex)
    setHexValue(newHex)
  }
  
  // Handle hex input change
  const handleHexChange = (value: string) => {
    setHexValue(value)
    // Only update other values if a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setSelectedColor(value)
    }
  }
  
  // Save color selection
  const handleColorSelect = () => {
    // Add to recent colors
    const updatedRecentColors = [selectedColor, ...(recentColors.filter(c => c !== selectedColor))].slice(0, 10)
    setRecentColors(updatedRecentColors)
    localStorage.setItem('recentColors', JSON.stringify(updatedRecentColors))
    
    onColorSelect(selectedColor)
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[400px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ColorPickerIcon className="h-5 w-5" />
            <span>Color Picker</span>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Color preview */}
            <div className="flex gap-4 items-center">
              <div
                className="w-16 h-16 rounded-md border border-gray-300"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-1">Current Selection</p>
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded-md border border-gray-300"
                    style={{ backgroundColor: currentColor }}
                  />
                  <div
                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {selectedColor !== currentColor && <Check className="h-4 w-4 text-white" />}
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="palette">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="palette">Palette</TabsTrigger>
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
                <TabsTrigger value="picker">Custom</TabsTrigger>
              </TabsList>
              
              <TabsContent value="palette">
                <div className="space-y-4">
                  {/* Recent colors */}
                  {recentColors.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Recent Colors</p>
                      <div className="flex flex-wrap gap-2">
                        {recentColors.map((color) => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                            style={{ backgroundColor: color }}
                            onClick={() => setSelectedColor(color)}
                            aria-label={`Select color ${color}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Color palette */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Color Palette</p>
                    <div className="grid grid-cols-10 gap-1">
                      {colorPalette.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rgb">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-500">Red ({rgbValues.r})</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[rgbValues.r]}
                        onValueChange={(value) => handleRgbChange('r', value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={255}
                        value={rgbValues.r}
                        onChange={(e) => handleRgbChange('r', Number(e.target.value))}
                        className="w-16"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-500">Green ({rgbValues.g})</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[rgbValues.g]}
                        onValueChange={(value) => handleRgbChange('g', value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={255}
                        value={rgbValues.g}
                        onChange={(e) => handleRgbChange('g', Number(e.target.value))}
                        className="w-16"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-500">Blue ({rgbValues.b})</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Slider
                        min={0}
                        max={255}
                        step={1}
                        value={[rgbValues.b]}
                        onValueChange={(value) => handleRgbChange('b', value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={255}
                        value={rgbValues.b}
                        onChange={(e) => handleRgbChange('b', Number(e.target.value))}
                        className="w-16"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="hsl">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-500">Hue ({hslValues.h}°)</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Slider
                        min={0}
                        max={360}
                        step={1}
                        value={[hslValues.h]}
                        onValueChange={(value) => handleHslChange('h', value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={360}
                        value={hslValues.h}
                        onChange={(e) => handleHslChange('h', Number(e.target.value))}
                        className="w-16"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-500">Saturation ({hslValues.s}%)</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[hslValues.s]}
                        onValueChange={(value) => handleHslChange('s', value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={hslValues.s}
                        onChange={(e) => handleHslChange('s', Number(e.target.value))}
                        className="w-16"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <p className="text-sm text-gray-500">Lightness ({hslValues.l}%)</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[hslValues.l]}
                        onValueChange={(value) => handleHslChange('l', value[0])}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={hslValues.l}
                        onChange={(e) => handleHslChange('l', Number(e.target.value))}
                        className="w-16"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="picker">
                <div className="space-y-4">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-full h-12 cursor-pointer"
                  />
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Hex Code</p>
                    <Input
                      type="text"
                      value={hexValue}
                      onChange={(e) => handleHexChange(e.target.value)}
                      className="font-mono"
                      placeholder="#000000"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">RGB</p>
                      <p className="font-mono">{`rgb(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b})`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">HSL</p>
                      <p className="font-mono">{`hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleColorSelect}>Select</Button>
        </CardFooter>
      </Card>
    </div>
  )
}