"use client"

import { Camera, MapPin, QrCode, Search, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" className="flex h-24 flex-col items-center justify-center gap-2">
        <Upload className="h-5 w-5 text-blue-500" />
        <span className="text-xs">Upload Image</span>
      </Button>
      <Button variant="outline" className="flex h-24 flex-col items-center justify-center gap-2">
        <Camera className="h-5 w-5 text-green-500" />
        <span className="text-xs">Take Photo</span>
      </Button>
      <Button variant="outline" className="flex h-24 flex-col items-center justify-center gap-2">
        <QrCode className="h-5 w-5 text-purple-500" />
        <span className="text-xs">Scan QR Code</span>
      </Button>
      <Button variant="outline" className="flex h-24 flex-col items-center justify-center gap-2">
        <MapPin className="h-5 w-5 text-red-500" />
        <span className="text-xs">Tag Location</span>
      </Button>
      <Button variant="outline" className="col-span-2 flex h-16 items-center justify-center gap-2">
        <Search className="h-5 w-5" />
        <span>Advanced Search</span>
      </Button>
    </div>
  )
}

