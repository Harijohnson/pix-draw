"use client"

import { useState, useRef, useEffect } from "react"
import { Pencil, Eraser, Palette, Grid3X3, X, Shuffle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ColorPicker } from "@/_components/color-picker"
import { GridSizeModal } from "@/_components/grid-size-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export const PixelArtEditor = () => {
  // Canvas state
  const [gridSize, setGridSize] = useState(12)
  const [pixelSize, setPixelSize] = useState(30)
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [colorPickerOpen, setColorPickerOpen] = useState(false)
  const [gridSizeModalOpen, setGridSizeModalOpen] = useState(false)
  const [canvasData, setCanvasData] = useState<string[][]>([])
  const [activeTool, setActiveTool] = useState<"pencil" | "eraser">("pencil")
  const [isDrawing, setIsDrawing] = useState(false)
  
  // Track the last position to avoid redundant updates
  const lastPositionRef = useRef<{row: number, col: number} | null>(null)

  // Canvas refs
  const canvasRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Initialize canvas data
  useEffect(() => {
    const newCanvasData = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(""))
    setCanvasData(newCanvasData)
  }, [gridSize])

  // Tool handlers
  const tools = [
    {
      name: "pencil",
      icon: Pencil,
      action: () => setActiveTool("pencil"),
      isActive: activeTool === "pencil",
    },
    {
      name: "eraser",
      icon: Eraser,
      action: () => setActiveTool("eraser"),
      isActive: activeTool === "eraser",
    },
    {
      name: "color",
      icon: Palette,
      action: () => setColorPickerOpen(true),
      isActive: false,
    },
    {
      name: "grid",
      icon: Grid3X3,
      action: () => setGridSizeModalOpen(true),
      isActive: false,
    },
  ]

  const bottomTools = [
    {
      name: "clear",
      icon: X,
      action: () => {
        const newCanvasData = Array(gridSize)
          .fill(null)
          .map(() => Array(gridSize).fill(""))
        setCanvasData(newCanvasData)
      },
      isActive: false,
    },
    {
      name: "random",
      icon: Shuffle,
      action: generateRandomPattern,
      isActive: false,
    },
  ]

  function generateRandomPattern() {
    const pattern = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill("")
          .map(() => {
            if (Math.random() > 0.7) {
              const randomHue = Math.floor(Math.random() * 360)
              return `hsl(${randomHue}, 70%, 50%)`
            }
            return ""
          }),
      )
    setCanvasData(pattern)
  }

  // Pixel drawing handlers
  const handlePixelClick = (rowIndex: number, colIndex: number) => {
    // Avoid redundant updates if we're already at this position
    if (lastPositionRef.current?.row === rowIndex && lastPositionRef.current?.col === colIndex) {
      return
    }
    
    lastPositionRef.current = { row: rowIndex, col: colIndex }
    
    const newCanvasData = [...canvasData]
    if (activeTool === "pencil") {
      newCanvasData[rowIndex][colIndex] = selectedColor
    } else {
      newCanvasData[rowIndex][colIndex] = ""
    }
    setCanvasData(newCanvasData)
  }

  const handlePixelHover = (rowIndex: number, colIndex: number) => {
    if (!isDrawing) return
    handlePixelClick(rowIndex, colIndex)
  }

  const handleMouseDown = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    // Prevent default drag behavior
    e.preventDefault()
    
    // Start drawing and mark current pixel
    setIsDrawing(true)
    handlePixelClick(rowIndex, colIndex)
    
    // Add event listeners to the document for mouse movements outside the grid
    document.addEventListener('mouseup', handleGlobalMouseUp)
  }

  const handleGlobalMouseUp = () => {
    setIsDrawing(false)
    lastPositionRef.current = null
    document.removeEventListener('mouseup', handleGlobalMouseUp)
  }

  // Prevent default drag behavior
  const preventDragHandler = (e: React.DragEvent) => {
    e.preventDefault()
    return false
  }

  // Export handlers
  const exportCanvas = (format: string) => {
    const canvas = document.createElement("canvas")
    canvas.width = gridSize * pixelSize
    canvas.height = gridSize * pixelSize
    const ctx = canvas.getContext("2d")

    if (ctx) {
      // Draw canvas content without grid lines
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const color = canvasData[row][col]
          if (color) {
            ctx.fillStyle = color
            ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize)
          }
        }
      }

      // Convert to requested format and download
      const link = document.createElement("a")
      let dataUrl

      if (format.toLowerCase() === "svg") {
        // Create SVG content
        let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${gridSize * pixelSize}" height="${gridSize * pixelSize}" viewBox="0 0 ${gridSize * pixelSize} ${gridSize * pixelSize}">`

        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const color = canvasData[row][col]
            if (color) {
              svgContent += `<rect x="${col * pixelSize}" y="${row * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`
            }
          }
        }

        svgContent += "</svg>"

        // Create SVG blob
        const blob = new Blob([svgContent], { type: "image/svg+xml" })
        dataUrl = URL.createObjectURL(blob)
        link.download = `pixel-art.svg`
      } else if (format.toLowerCase() === "jpeg" || format.toLowerCase() === "jpg") {
        dataUrl = canvas.toDataURL("image/jpeg")
        link.download = `pixel-art.jpg`
      } else {
        // Default to PNG
        dataUrl = canvas.toDataURL("image/png")
        link.download = `pixel-art.png`
      }

      link.href = dataUrl
      link.click()
    }
  }

  // Clean up event listeners
  useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
    }
  }, [])

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row items-stretch justify-between w-full h-full gap-4 p-4">
        {/* Left Tools Panel */}
        <div className="bg-gray-200 rounded-lg p-3 flex flex-col justify-between min-h-[400px]">
          <div className="flex flex-col gap-4">
            {tools.map((tool) => (
              <button
                key={tool.name}
                onClick={tool.action}
                className={cn(
                  "p-3 rounded-md transition-all duration-200 relative",
                  tool.isActive ? "bg-gray-300" : "hover:bg-gray-300/50",
                )}
                aria-label={tool.name}
              >
                <tool.icon className="h-5 w-5" />
                {tool.name === "color" && (
                  <div
                    className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedColor }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {bottomTools.map((tool) => (
              <button
                key={tool.name}
                onClick={tool.action}
                className="p-3 rounded-md hover:bg-gray-300/50 transition-all duration-200"
                aria-label={tool.name}
              >
                <tool.icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Pixel Canvas - Center and Expanded */}
        <div
          ref={canvasRef}
          className="bg-white rounded-lg shadow-md p-5 flex-grow flex items-center justify-center"
          onDragStart={preventDragHandler}
        >
          <div
            ref={gridRef}
            className="grid border border-gray-400 select-none"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
              gridTemplateRows: `repeat(${gridSize}, ${pixelSize}px)`,
            }}
            onDragStart={preventDragHandler}
          >
            {canvasData.map((row, rowIndex) =>
              row.map((color, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="border border-gray-300"
                  style={{
                    backgroundColor: color || undefined,
                    width: pixelSize,
                    height: pixelSize,
                    cursor: "crosshair"
                  }}
                  onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                  onMouseEnter={() => handlePixelHover(rowIndex, colIndex)}
                  draggable={false}
                />
              )),
            )}
          </div>
        </div>

        {/* Right Panel - Export */}
        <div className="bg-gray-200 rounded-lg p-5 min-h-[400px] min-w-[150px]">
          <div className="flex flex-col items-center justify-start">
            <h3 className="text-sm font-semibold mb-4">Export Options</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-gray-300 mb-5 font-mono uppercase tracking-widest">
                  Export <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="font-mono" onClick={() => exportCanvas("PNG")}>
                  PNG
                </DropdownMenuItem>
                {/* <DropdownMenuItem className="font-mono" onClick={() => exportCanvas("JPEG")}>
                  JPEG
                </DropdownMenuItem> */}
                <DropdownMenuItem className="font-mono" onClick={() => exportCanvas("SVG")}>
                  SVG
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">Drawing Instructions</p>
              <div className="bg-gray-300 p-2 rounded text-xs">
                Click and drag to draw continuously
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {colorPickerOpen && (
        <ColorPicker
          currentColor={selectedColor}
          onClose={() => setColorPickerOpen(false)}
          onColorSelect={(color) => {
            setSelectedColor(color)
            setColorPickerOpen(false)
          }}
        />
      )}

      {gridSizeModalOpen && (
        <GridSizeModal
          currentSize={gridSize}
          onClose={() => setGridSizeModalOpen(false)}
          onSizeChange={(newSize) => {
            setGridSize(newSize)
            setGridSizeModalOpen(false)
          }}
        />
      )}
    </div>
  )
}