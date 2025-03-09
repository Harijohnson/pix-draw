"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

interface GridSizeModalProps {
  currentSize: number
  onClose: () => void
  onSizeChange: (size: number) => void
}

export const GridSizeModal = ({ currentSize, onClose, onSizeChange }: GridSizeModalProps) => {
  const [size, setSize] = useState(currentSize)
  const minSize = 8
  const maxSize = 20

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-[300px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Grid Size</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="text-center text-2xl font-bold">
              {size} x {size}
            </div>
            <Slider
              value={[size]}
              min={minSize}
              max={maxSize}
              step={1}
              onValueChange={([value]) => setSize(value)}
              className="my-4"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                {minSize}x{minSize}
              </span>
              <span>
                {maxSize}x{maxSize}
              </span>
            </div>
            <div className="border rounded-lg p-3 mt-2">
              <div
                className="grid gap-[1px] mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${size}, 1fr)`,
                  width: "200px",
                  height: "200px",
                }}
              >
                {Array(size * size)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="bg-gray-200"></div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSizeChange(size)}>Apply</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

