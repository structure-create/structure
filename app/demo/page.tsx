'use client'

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { UploadPermit } from "@/components/upload-permit"
import { UploadDrawing } from "@/components/upload-drawing"
import { Footer } from "@/components/footer"
import React, { useState } from "react"

export default function Demo() {
  const [activeUpload, setActiveUpload] = useState<"permit" | "drawing">("permit")

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Hero setActiveUpload={setActiveUpload} />
        {activeUpload === "permit" ? (
          <UploadPermit />
        ) : (
          <UploadDrawing />
        )}
      </main>
      <Footer />
    </div>
  )
}