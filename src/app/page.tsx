"use client";
import React, { useRef } from 'react';
import Container from "@/app/_components/container";
import Canvas from "@/app/_components/Canvas";
import Edit from "@/app/_components/Edit";
import Export from "@/app/_components/Export";

export default function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <main>
      <Container>
        <section className="grid grid-rows-1 grid-flow-col gap-2 my-4">
          <div className=""> 
            <Edit />
          </div>
          <div className=""> 
          <Canvas canvasRef={canvasRef}  />
          </div>
          <div className=""> 
          <Export canvasRef={canvasRef} />
          </div>
        </section>
      </Container>
    </main>
  );
}
