"use client"

import { useRef, useState } from "react"
import { Search, ZoomIn, ZoomOut } from "lucide-react"
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from "framer-motion"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Define the marker icon (needed because Leaflet's default markers won't load in Next.js)
const icon = L.icon({
  iconUrl: '/marker-icon.png', // You'll need to add this image to your public folder
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/marker-shadow.png', // And this one
  shadowSize: [41, 41],
});

// Update the sample data to use real coordinates
const mapPins = [
  {
    id: "1",
    lat: 22.796259,
    lng: 75.842003,
    category: "Bags",
    item: "Blue Backpack",
    status: "lost",
    time: "2 hours ago",
    location: "Library, 2nd Floor",
  },
  {
    id: "2",
    lat: 22.795719,
    lng: 75.842385,
    category: "Electronics",
    item: "iPhone 13",
    status: "found",
    time: "Yesterday",
    location: "Student Center",
  },
  {
    id: "3",
    lat: 22.796310,
    lng: 75.842580,
    category: "Accessories",
    item: "Water Bottle",
    status: "claimed",
    time: "2 days ago",
    location: "Gym",
  },
  {
    id: "4",
    lat: 22.796097,
    lng: 75.842956,
    category: "Books",
    item: "Textbook",
    status: "lost",
    time: "3 days ago",
    location: "Science Building",
  },
  {
    id: "5",
    lat: 22.795836,
    lng: 75.842985,
    category: "Electronics",
    item: "Laptop Charger",
    status: "found",
    time: "4 days ago",
    location: "Engineering Lab",
  },
  {
    id: "6",
    lat: 22.795964,
    lng: 75.842887,
    category: "Documents",
    item: "Student ID Card",
    status: "claimed",
    time: "5 days ago",
    location: "Cafeteria",
  },
  {
    id: "7",
    lat: 22.796097,
    lng: 75.842441,
    category: "Electronics",
    item: "Wireless Earbuds",
    status: "lost",
    time: "1 week ago",
    location: "Library",
  },
  {
    id: "8",
    lat: 22.796220,
    lng: 75.843401,
    category: "Accessories",
    item: "Glasses Case",
    status: "found",
    time: "1 week ago",
    location: "Student Center",
  },
  {
    id: "9",
    lat: 22.795613,
    lng: 75.843577,
    category: "Accessories",
    item: "Umbrella",
    status: "lost",
    time: "2 weeks ago",
    location: "Engineering Building",
  },
]

// Dynamically import the map component with ssr disabled
const MapWithNoSSR = dynamic(
  () => import('./map-component'), // We'll create this component
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        Loading map...
      </div>
    )
  }
)

export function CampusMap() {
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const mapRef = useRef<google.maps.Map | null>(null)

  const filteredPins = mapPins.filter(
    (pin) =>
      pin.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pin.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div className="absolute left-4 top-4 z-10 flex w-64 items-center gap-2 rounded-lg bg-background/80 p-2 backdrop-blur-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items on map..."
          className="h-8 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <MapWithNoSSR 
        pins={filteredPins} 
        selectedPin={selectedPin} 
        setSelectedPin={setSelectedPin}
      />

      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => {
            if (mapRef.current) mapRef.current.zoomIn();
          }}
        >
          <ZoomIn className="h-4 w-4" />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => {
            if (mapRef.current) mapRef.current.zoomOut();
          }}
        >
          <ZoomOut className="h-4 w-4" />
          <span className="sr-only">Zoom out</span>
        </Button>
      </div>
    </div>
  )
}

