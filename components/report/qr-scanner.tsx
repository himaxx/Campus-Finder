"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, QrCode, Smartphone } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function QrScanner() {
  const [activeTab, setActiveTab] = useState("qr")
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const startScanner = () => {
    setScanning(true)

    // Simulate scanning process
    setTimeout(() => {
      setScanning(false)
      setScanned(true)

      toast({
        title: "QR Code Scanned",
        description: "Item details have been retrieved successfully.",
      })
    }, 3000)
  }

  const resetScanner = () => {
    setScanned(false)
  }

  // Simulate camera feed
  useEffect(() => {
    if (scanning && videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (!ctx) return

      // Draw scanning animation
      let frame = 0
      const animate = () => {
        if (!canvasRef.current || !ctx) return

        const { width, height } = canvasRef.current
        ctx.clearRect(0, 0, width, height)

        // Draw scanning line
        const lineY = height / 2 + Math.sin(frame / 10) * (height / 4)
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, lineY)
        ctx.lineTo(width, lineY)
        ctx.stroke()

        // Draw corner markers
        const markerSize = 20
        ctx.strokeStyle = "#10b981"
        ctx.lineWidth = 3

        // Top-left
        ctx.beginPath()
        ctx.moveTo(0, markerSize)
        ctx.lineTo(0, 0)
        ctx.lineTo(markerSize, 0)
        ctx.stroke()

        // Top-right
        ctx.beginPath()
        ctx.moveTo(width - markerSize, 0)
        ctx.lineTo(width, 0)
        ctx.lineTo(width, markerSize)
        ctx.stroke()

        // Bottom-left
        ctx.beginPath()
        ctx.moveTo(0, height - markerSize)
        ctx.lineTo(0, height)
        ctx.lineTo(markerSize, height)
        ctx.stroke()

        // Bottom-right
        ctx.beginPath()
        ctx.moveTo(width - markerSize, height)
        ctx.lineTo(width, height)
        ctx.lineTo(width, height - markerSize)
        ctx.stroke()

        frame++
        if (scanning) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }, [scanning])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="qr" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="qr"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <QrCode className="mr-2 h-4 w-4" />
            QR Code
          </TabsTrigger>
          <TabsTrigger
            value="nfc"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Smartphone className="mr-2 h-4 w-4" />
            NFC Tag
          </TabsTrigger>
        </TabsList>

        <TabsContent value="qr" className="space-y-4">
          <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-lg border">
            <AnimatePresence mode="wait">
              {!scanning && !scanned ? (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center"
                >
                  <div className="rounded-full bg-muted p-4">
                    <QrCode className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Scan QR Code</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Position the QR code within the frame to scan</p>
                  </div>
                  <Button onClick={startScanner}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Scanner
                  </Button>
                </motion.div>
              ) : scanning ? (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative h-full w-full"
                >
                  <video
                    ref={videoRef}
                    className="h-full w-full object-cover"
                    poster="/placeholder.svg?height=400&width=400"
                    muted
                    playsInline
                  />
                  <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" width={400} height={400} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-sm font-medium drop-shadow-md">Scanning...</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center"
                >
                  <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                    <QrCode className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-green-600 dark:text-green-300">QR Code Scanned</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Item details have been retrieved successfully</p>
                  </div>
                  <Button onClick={resetScanner} variant="outline">
                    Scan Another Code
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Scan the QR code on the item to quickly retrieve its information</p>
          </div>
        </TabsContent>

        <TabsContent value="nfc" className="space-y-4">
          <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-lg border">
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              <div className="rounded-full bg-muted p-4">
                <Smartphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium">Tap NFC Tag</h3>
                <p className="mt-1 text-sm text-muted-foreground">Hold your device near the NFC tag on the item</p>
              </div>
              <div className="relative mt-4 h-16 w-16">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                <div
                  className="absolute inset-0 animate-ping rounded-full bg-primary/20"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-0 animate-ping rounded-full bg-primary/20"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div className="relative flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Smartphone className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Make sure NFC is enabled on your device</p>
          </div>
        </TabsContent>
      </Tabs>

      {scanned && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <h3 className="font-medium">Scanned Item Details</h3>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item:</span>
              <span className="font-medium">Blue Backpack</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span>Bags</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-green-600 dark:text-green-400">Found</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>Library, 2nd Floor</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>Today, 2:30 PM</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Proceed to Claim</Button>
          </div>
        </div>
      )}
    </div>
  )
}

