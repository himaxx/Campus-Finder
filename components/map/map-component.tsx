"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Script from 'next/script'
import { Map as MapIcon, Satellite } from "lucide-react"

// Define the campus areas with coordinates - adjusted to ensure no gaps
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
      [22.795599, 75.843255],
      [22.795830, 75.843240],
      [22.795813, 75.843434],
      [22.795580, 75.843393]
    ],
    center: [22.795714, 75.843341]
  },
  {
    id: 5,
    name: "Main Building",
    color: "#F44336",  // Red
    coordinates: [
      [22.796002, 75.842250],
      [22.796518, 75.842292],
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
      [22.795902, 75.843315],
      [22.796398, 75.843322],
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
      [22.795580, 75.843393],
      [22.795813, 75.843434],
      [22.795813, 75.843748],
      [22.795518, 75.843735]
    ],
    center: [22.795688, 75.843584]
  },
  {
    id: 8,
    name: "East Wing",
    color: "#00BCD4",  // Cyan
    coordinates: [
      [22.795830, 75.843770],
      [22.796243, 75.843826],
      [22.796306, 75.843861],
      [22.795813, 75.843748]
    ],
    center: [22.796048, 75.843801]
  },
  {
    id: 9,
    name: "South Garden",
    color: "#CDDC39",  // Lime
    coordinates: [
      [22.795518, 75.843735],
      [22.795813, 75.843748],
      [22.795495, 75.843778]
    ],
    center: [22.795609, 75.843754]
  },
  {
    id: 10,
    name: "West Entrance",
    color: "#795548",  // Brown
    coordinates: [
      [22.795616, 75.842964],
      [22.795895, 75.843001],
      [22.795902, 75.843315],
      [22.795851, 75.843080],
      [22.795613, 75.843050]
    ],
    center: [22.795775, 75.843082]
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

// Add this type at the top of the file
type PinStatus = 'lost' | 'found' | 'claimed';

interface MapComponentProps {
  pins: any[] // Replace with your proper type
  selectedPin: string | null
  setSelectedPin: (id: string | null) => void
}

function MapComponent({ pins, selectedPin, setSelectedPin }: MapComponentProps) {
  const [showLabels, setShowLabels] = useState(true);
  const [isHoveringBoundary, setIsHoveringBoundary] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<{[key: string]: google.maps.marker.AdvancedMarkerElement}>({});
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const polygonsRef = useRef<google.maps.Polygon[]>([]);
  const boundaryRef = useRef<google.maps.Polygon | null>(null);

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

  // Initialize Google Map
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;

    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      
      const map = new Map(mapContainerRef.current, {
        center: { lat: 22.796, lng: 75.842 },
        zoom: 18,
        mapId: 'DEMO_MAP_ID',
        mapTypeId: mapType,
        disableDefaultUI: true,
      });
      
      mapRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();

      // Function to update marker sizes based on zoom level
      const updateMarkerSizes = () => {
        const zoom = map.getZoom();
        if (!zoom) return;
        
        // Calculate size based on zoom level
        const baseSize = 24; // Base size at zoom level 18
        const scale = Math.pow(1.2, zoom - 18); // Adjust size exponentially
        const size = Math.max(16, Math.min(48, baseSize * scale)); // Clamp between 16px and 48px

        Object.values(markersRef.current).forEach(marker => {
          const element = marker.content as HTMLElement;
          if (element) {
            const pinElement = element.querySelector('.pin-icon') as HTMLElement;
            if (pinElement) {
              pinElement.style.width = `${size}px`;
              pinElement.style.height = `${size}px`;
            }
          }
        });
      };

      // Add zoom change listener
      map.addListener('zoom_changed', updateMarkerSizes);

      // Add campus boundary
      const boundaryCoords = campusBoundary.map(coord => ({ lat: coord[0], lng: coord[1] }));
      const boundary = new google.maps.Polygon({
        paths: boundaryCoords,
        strokeColor: '#3388ff',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#3388ff',
        fillOpacity: 0.05,
        map: map
      });
      
      boundaryRef.current = boundary;
      
      // Add mouseover/mouseout events for boundary
      boundary.addListener('mouseover', () => setIsHoveringBoundary(true));
      boundary.addListener('mouseout', () => setIsHoveringBoundary(false));
      
      // Add campus areas with smoother boundaries
      campusAreas.forEach(area => {
        const areaCoords = area.coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }));
        const polygon = new google.maps.Polygon({
          paths: areaCoords,
          strokeColor: area.color,
          strokeOpacity: 0.6,  // Reduced opacity for softer lines
          strokeWeight: 1.5,   // Thinner lines for smoother appearance
          fillColor: area.color,
          fillOpacity: 0.35,   // Slightly increased opacity for better visibility
          map: map
        });
        
        // Apply smoothing to the polygon
        polygon.setOptions({
          geodesic: true,  // Makes lines follow the curvature of the earth
          clickable: true,
          editable: false,
          draggable: false,
          zIndex: 1
        });
        
        polygonsRef.current.push(polygon);
        
        // Add tooltip/info window for area
        polygon.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (infoWindowRef.current && e.latLng) {
            infoWindowRef.current.setContent(area.name);
            infoWindowRef.current.setPosition(e.latLng);
            infoWindow.open(map);
          }
        });
        
        // Add area label if showLabels is true
        if (showLabels) {
          const labelMarker = document.createElement('div');
          labelMarker.innerHTML = `
            <div style="
              background: white; 
              padding: 3px 6px; 
              border-radius: 4px; 
              font-weight: bold; 
              font-size: 12px; 
              border: 1.5px solid ${area.color}; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
              white-space: nowrap;
              color: black;
              opacity: 0.9;
            ">
              ${area.name}
            </div>
          `;
          
          new AdvancedMarkerElement({
            map,
            position: { lat: area.center[0], lng: area.center[1] },
            content: labelMarker,
          });
        }
      });
      
      // Add markers for pins
      pins.forEach(pin => {
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div class="pin-container" style="
            position: relative;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            <img 
              src="/${pin.status}.svg" 
              class="pin-icon"
              style="
                width: 24px;
                height: 24px;
                transition: all 0.3s ease;
                transform: ${selectedPin === pin.id ? 'scale(1.2)' : 'scale(1)'};
              "
              alt="${pin.status} item"
            />
          </div>
        `;

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: pin.lat, lng: pin.lng },
          content: markerElement,
        });
        
        markersRef.current[pin.id] = marker;

        // Add hover effect and info window
        const container = markerElement.querySelector('.pin-container');
        if (container) {
          container.addEventListener('mouseenter', () => {
            container.style.transform = 'scale(1.1)';
            
            // Show info window on hover with styled content matching the carousel cards
            if (infoWindowRef.current) {
              const content = `
                <div style="
                  padding: 0;
                  max-width: 140px;
                  font-family: system-ui, -apple-system, sans-serif;
                  border-radius: 0.5rem;
                  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
                  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
                  overflow: hidden;
                ">
                  <div style="
                    position: relative;
                    height: 60px;
                    width: 100%;
                    overflow: hidden;
                    background-color: hsl(0 0% 96.1%);
                  ">
                    <div style="
                      position: absolute;
                      right: 4px;
                      top: 4px;
                      z-index: 10;
                      border-radius: 9999px;
                      padding: 2px 4px;
                      font-size: 10px;
                      font-weight: 500;
                      color: white;
                      background-color: ${getStatusColor(pin.status)};
                    ">
                      ${pin.status.charAt(0).toUpperCase() + pin.status.slice(1)}
                    </div>
                    <div style="
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    ">
                      <img 
                        src="/${pin.item}.jpg"
                        alt="${pin.item}" 
                        style="
                          width: 100%;
                          height: 100%;
                          object-fit: contain;
                          padding: 4px;
                          transition: transform 0.3s ease;
                        "
                        onmouseover="this.style.transform='scale(1.1)'"
                        onmouseout="this.style.transform='scale(1)'"
                      />
                    </div>
                  </div>
                  <div style="padding: 6px;">
                    <h3 style="
                      font-weight: 600;
                      font-size: 12px;
                      margin: 0 0 2px 0;
                      color: hsl(0 0% 3.9%);
                    ">${pin.item}</h3>
                    <div style="
                      margin-top: 2px;
                      display: flex;
                      align-items: center;
                      font-size: 10px;
                      color: hsl(0 0% 45.1%);
                    ">
                      <span style="
                        display: inline-block;
                        margin-right: 4px;
                        padding: 2px 4px;
                        border-radius: 9999px;
                        font-size: 9px;
                        border: 1px solid hsl(0 0% 90%);
                        background-color: hsl(217, 100%, 50%);
                        color: white;
                      ">${pin.category}</span>
                      <span>${pin.time}</span>
                    </div>
                    <div style="
                      margin-top: 4px;
                      display: flex;
                      align-items: center;
                      font-size: 10px;
                      color: hsl(0 0% 45.1%);
                    ">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 2px;">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      ${pin.location}
                    </div>
                  </div>
                </div>
              `;
              
              // Style the info window
              const infoWindow = infoWindowRef.current;
              infoWindow.setContent(content);
              infoWindow.setPosition({ lat: pin.lat, lng: pin.lng });
              infoWindow.setOptions({
                pixelOffset: new google.maps.Size(0, -10),
                disableAutoPan: true,
                closeBoxURL: "",
                maxWidth: 280,
              });
              infoWindow.open(map);
            }
          });

          container.addEventListener('mouseleave', () => {
            container.style.transform = 'scale(1)';
            if (infoWindowRef.current && !selectedPin) {
              infoWindowRef.current.close();
            }
          });

          container.addEventListener('click', () => {
            setSelectedPin(selectedPin === pin.id ? null : pin.id);
          });
        }
      });

      // Initial marker size update
      updateMarkerSizes();
    };

    initMap();
    
    return () => {
      // Clean up
      if (infoWindowRef.current) infoWindowRef.current.close();
      polygonsRef.current.forEach(polygon => polygon.setMap(null));
      if (boundaryRef.current) boundaryRef.current.setMap(null);
      Object.values(markersRef.current).forEach(marker => marker.map = null);
    };
  }, [mapLoaded, pins, selectedPin, showLabels, mapType]);

  // Update info window when selected pin changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    if (selectedPin) {
      const pin = pins.find(p => p.id === selectedPin);
      if (pin && markersRef.current[pin.id]) {
        const marker = markersRef.current[pin.id];
        
        if (infoWindowRef.current) {
          const content = `
            <div style="
              padding: 0;
              max-width: 280px;
              font-family: system-ui, -apple-system, sans-serif;
              border-radius: 0.5rem;
              background: hsl(0 0% 100%);
              box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
              overflow: hidden;
            ">
              <div style="
                position: relative;
                height: 120px;
                width: 100%;
                overflow: hidden;
                background-color: hsl(0 0% 96.1%);
              ">
                <div style="
                  position: absolute;
                  right: 8px;
                  top: 8px;
                  z-index: 10;
                  border-radius: 9999px;
                  padding: 2px 8px;
                  font-size: 12px;
                  font-weight: 500;
                  color: white;
                  background-color: ${getStatusColor(pin.status)};
                ">
                  ${pin.status.charAt(0).toUpperCase() + pin.status.slice(1)}
                </div>
                <div style="
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <img 
                    src="/placeholder.svg?height=100&width=100" 
                    alt="${pin.item}" 
                    style="
                      width: 100%;
                      height: 100%;
                      object-fit: contain;
                      padding: 8px;
                      transition: transform 0.3s ease;
                    "
                    onmouseover="this.style.transform='scale(1.1)'"
                    onmouseout="this.style.transform='scale(1)'"
                  />
                </div>
              </div>
              <div style="padding: 12px;">
                <h3 style="
                  font-weight: 600;
                  font-size: 14px;
                  margin: 0 0 4px 0;
                  color: hsl(0 0% 3.9%);
                ">${pin.item}</h3>
                <div style="
                  margin-top: 4px;
                  display: flex;
                  align-items: center;
                  font-size: 12px;
                  color: hsl(0 0% 45.1%);
                ">
                  <span style="
                    display: inline-block;
                    margin-right: 8px;
                    padding: 2px 6px;
                    border-radius: 9999px;
                    font-size: 11px;
                    border: 1px solid hsl(0 0% 90%);
                  ">${pin.category}</span>
                  <span>${pin.time}</span>
                </div>
                <div style="
                  margin-top: 8px;
                  display: flex;
                  align-items: center;
                  font-size: 12px;
                  color: hsl(0 0% 45.1%);
                ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  ${pin.location}
                </div>
                <button style="
                  margin-top: 12px;
                  width: 100%;
                  background-color: hsl(217.2 91.2% 59.8%);
                  color: white;
                  border: none;
                  border-radius: 0.375rem;
                  padding: 6px 12px;
                  font-size: 12px;
                  cursor: pointer;
                  transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='hsl(217.2 91.2% 49.8%)'" 
                  onmouseout="this.style.backgroundColor='hsl(217.2 91.2% 59.8%)'">
                  View Details
                </button>
              </div>
            </div>
          `;
          
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(mapRef.current, marker);
        }
      }
    } else if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  }, [selectedPin, pins, mapLoaded]);

  // Add effect to handle map type changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setMapTypeId(mapType);
    }
  }, [mapType]);

  // Helper function to get status color that matches your theme
  const getStatusColor = (status: PinStatus) => {
    switch (status) {
      case "lost":
        return "hsl(0 84.2% 60.2%)"; // Using your destructive color
      case "found":
        return "hsl(142 76% 36%)"; // A green that matches your theme
      case "claimed":
        return "hsl(217.2 91.2% 59.8%)"; // Using your sidebar-ring color
      default:
        return "hsl(0 0% 45.1%)"; // Using your muted-foreground color
    }
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyDnlPk8JtSj_QPImHETZ_TkAnLdowUyL3U&callback=console.debug&libraries=maps,marker&v=beta`}
        onLoad={() => setMapLoaded(true)}
      />
      <div className="relative h-full w-full">
        {/* Add map type toggle button */}
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm"
            onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          >
            {mapType === 'roadmap' ? (
              <>
                <Satellite className="mr-2 h-4 w-4" />
                Satellite
              </>
            ) : (
              <>
                <MapIcon className="mr-2 h-4 w-4" />
                Map
              </>
            )}
          </Button>
        </div>
        
        <div 
          ref={mapContainerRef} 
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </>
  );
}

export default MapComponent 