"use client"

import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Define the marker icon
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: '/marker-shadow.png',
  shadowSize: [41, 41],
});

// Define the campus areas with coordinates
const campusAreas = [
  {
    id: 1,
    name: "Turf",
    color: "#4CAF50",  // Green
    coordinates: [
      [22.795812, 75.841693],
      [22.796585, 75.841810],
      [22.796518, 75.842292],
      [22.795840, 75.842198]
    ],
    center: [22.796189, 75.841998]
  },
  {
    id: 2,
    name: "Main Garden",
    color: "#8BC34A",  // Light Green
    coordinates: [
      [22.795785, 75.842228],
      [22.796002, 75.842250],
      [22.795895, 75.843001],
      [22.795616, 75.842964]
    ],
    center: [22.795825, 75.842611]
  },
  {
    id: 3,
    name: "Swimming Pool",
    color: "#03A9F4",  // Light Blue
    coordinates: [
      [22.795613, 75.843050],
      [22.795851, 75.843080],
      [22.795830, 75.843240],
      [22.795603, 75.843199]
    ],
    center: [22.795724, 75.843142]
  },
  {
    id: 4,
    name: "Basketball Ground",
    color: "#FF9800",  // Orange
    coordinates: [
      [22.795620, 75.843255],
      [22.795826, 75.843281],
      [22.795813, 75.843434],
      [22.795599, 75.843393]
    ],
    center: [22.795714, 75.843341]
  },
  {
    id: 5,
    name: "Main Building",
    color: "#F44336",  // Red
    coordinates: [
      [22.796023, 75.842288],
      [22.796446, 75.842333],
      [22.796398, 75.843322],
      [22.795902, 75.843315]
    ],
    center: [22.796192, 75.842815]
  },
  {
    id: 6,
    name: "Block 2",
    color: "#9C27B0",  // Purple
    coordinates: [
      [22.795950, 75.843356],
      [22.796260, 75.843412],
      [22.796243, 75.843826],
      [22.795830, 75.843770]
    ],
    center: [22.796071, 75.843591]
  },
  {
    id: 7,
    name: "Side Garden",
    color: "#FFEB3B",  // Yellow
    coordinates: [
      [22.795596, 75.843419],
      [22.795826, 75.843434],
      [22.795813, 75.843748],
      [22.795518, 75.843735]
    ],
    center: [22.795688, 75.843584]
  }
];

// Define the campus boundary
const campusBoundary = [
  [22.795812, 75.841693],
  [22.796585, 75.841810],
  // Converting DMS to decimal: 22°47'46.7"N 75°50'37.9"E ≈ 22.796306, 75.843861
  [22.796306, 75.843861],
  [22.795495, 75.843778],
  [22.795621, 75.842608]
];

// Updated AreaLabel component with black text color
const AreaLabel = ({ position, name, color, visible }) => {
  if (!visible) return null;
  
  return (
    <Marker 
      position={position} 
      icon={L.divIcon({
        className: 'area-label',
        html: `
          <div style="
            background: white; 
            padding: 3px 6px; 
            border-radius: 3px; 
            font-weight: bold; 
            font-size: 12px; 
            border: 2px solid ${color}; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            white-space: nowrap;
            color: black;
          ">
            ${name}
          </div>
        `,
        iconSize: [100, 20],
        iconAnchor: [50, 10]
      })}
    />
  );
};

// Add center points for each area
const areasWithCenters = campusAreas.map(area => ({
  ...area,
  center: [
    area.coordinates.reduce((sum, point) => sum + point[0], 0) / area.coordinates.length,
    area.coordinates.reduce((sum, point) => sum + point[1], 0) / area.coordinates.length,
  ]
}));

interface MapComponentProps {
  pins: any[] // Replace with your proper type
  selectedPin: string | null
  setSelectedPin: (id: string | null) => void
}

function MapComponent({ pins, selectedPin, setSelectedPin }: MapComponentProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [isHoveringBoundary, setIsHoveringBoundary] = useState(false);

  // Initial label display timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLabels(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Show labels when hovering over boundary
  useEffect(() => {
    if (isHoveringBoundary) {
      setShowLabels(true);
    } else {
      const timer = setTimeout(() => {
        setShowLabels(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isHoveringBoundary]);

  return (
    <MapContainer 
      center={[22.796, 75.842]}
      zoom={18}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Campus boundary with hover detection */}
      <Polygon 
        positions={campusBoundary}
        pathOptions={{
          color: '#3388ff',
          weight: 2,
          fillOpacity: 0.05
        }}
        eventHandlers={{
          mouseover: () => setIsHoveringBoundary(true),
          mouseout: () => setIsHoveringBoundary(false),
        }}
      >
        <Tooltip sticky>Campus Boundary</Tooltip>
      </Polygon>
      
      {/* Campus areas */}
      {areasWithCenters.map((area) => (
        <div key={area.id}>
          <Polygon 
            positions={area.coordinates}
            pathOptions={{
              color: area.color,
              weight: 2,
              fillOpacity: 0.3
            }}
          >
            <Tooltip sticky>{area.name}</Tooltip>
          </Polygon>
          <AreaLabel 
            position={area.center}
            name={area.name}
            color={area.color}
            visible={showLabels}
          />
        </div>
      ))}
      
      {/* Marker pins */}
      {pins.map((pin) => (
        <Marker 
          key={pin.id} 
          position={[pin.lat, pin.lng]}
          icon={icon}
          eventHandlers={{
            click: () => setSelectedPin(selectedPin === pin.id ? null : pin.id)
          }}
        >
          {selectedPin === pin.id && (
            <Popup>
              <Card className="w-48 border-0 shadow-none">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{pin.item}</h4>
                      <Badge variant="outline" className="text-xs">
                        {pin.category}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div>{pin.location}</div>
                      <div className="mt-1">
                        {pin.status.charAt(0).toUpperCase() + pin.status.slice(1)} • {pin.time}
                      </div>
                    </div>
                    <Button size="sm" className="mt-2 h-7 w-full text-xs">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Popup>
          )}
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapComponent 