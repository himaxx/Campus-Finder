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
  
  // Enhanced college information with more details
  const collegeInfo = {
    name: "Shri Aurobindo Institute of Technology",
    shortName: "SAIT",
    logo: "/college-logo.png", // Add this logo to your public folder
    primaryColor: "#1a3c6e", // College primary color - dark blue
    secondaryColor: "#f8b133", // College secondary color - gold/amber
    accentColor: "#d84727", // Accent color - terracotta red
    established: "1999",
    campusArea: "25 Acres",
    buildings: "10",
    students: "5,000+"
  };

  // Enhanced campus areas with building details
  const campusAreasEnhanced = campusAreas.map(area => ({
    ...area,
    description: getAreaDescription(area.name),
    icon: getAreaIcon(area.name),
    heightMeters: getAreaHeight(area.name),
  }));

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

  // Initialize Google Map with custom styling
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current) return;

    const initMap = async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;
      
      // Custom map styling for SAIT campus
      const customMapStyle = [
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#a3ccff" }]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [{ color: "#f0f4e8" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }, { weight: 1.5 }]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#c8e6c9" }]
        },
        {
          featureType: "poi.school",
          elementType: "geometry",
          stylers: [{ color: "#fff9c4" }]
        },
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "transit",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "administrative.neighborhood",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "administrative.locality",
          elementType: "labels",
          stylers: [{ visibility: "simplified" }]
        },
        {
          featureType: "road",
          elementType: "labels",
          stylers: [{ visibility: "simplified" }]
        }
      ];

      // Calculate campus boundary for restrictions
      const boundsCalculator = new google.maps.LatLngBounds();
      campusBoundary.forEach(coord => {
        boundsCalculator.extend({ lat: coord[0], lng: coord[1] });
      });
      
      // Add padding to boundary
      const northEast = boundsCalculator.getNorthEast();
      const southWest = boundsCalculator.getSouthWest();
      const latPadding = (northEast.lat() - southWest.lat()) * 0.2;
      const lngPadding = (northEast.lng() - southWest.lng()) * 0.2;
      
      const paddedBounds = new google.maps.LatLngBounds(
        { lat: southWest.lat() - latPadding, lng: southWest.lng() - lngPadding },
        { lat: northEast.lat() + latPadding, lng: northEast.lng() + lngPadding }
      );
      
      const map = new Map(mapContainerRef.current, {
        center: { lat: 22.796, lng: 75.842 },
        zoom: 18,
        mapId: 'DEMO_MAP_ID',
        mapTypeId: mapType,
        disableDefaultUI: false,
        styles: customMapStyle,
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        maxZoom: 21,  // Allow detailed zoom
        minZoom: 17,  // Prevent zooming out too far
        restriction: {
          latLngBounds: paddedBounds,
          strictBounds: false
        },
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT
        }
      });
      
      mapRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();

      // Add enhanced college banner with animation
      const collegeBannerDiv = document.createElement('div');
      collegeBannerDiv.innerHTML = `
        <div style="
          margin: 10px;
          padding: 12px 16px;
          background: linear-gradient(135deg, ${collegeInfo.primaryColor}, rgba(26, 60, 110, 0.9));
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          font-family: 'Arial', sans-serif;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(5px);
          position: relative;
          overflow: hidden;
        ">
          <div style="
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 65%, rgba(255, 255, 255, 0.1) 70%, transparent 75%);
            background-size: 200% 200%;
            animation: shimmer 2.5s infinite linear;
            pointer-events: none;
          "></div>
          <img src="${collegeInfo.logo}" style="
            height: 38px;
            margin-right: 12px;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
            transition: transform 0.3s ease;
          " />
          <div>
            <div style="
              font-weight: bold;
              color: white;
              font-size: 14px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              letter-spacing: 0.5px;
            ">
              ${collegeInfo.shortName}
            </div>
            <div style="
              display: flex;
              align-items: center;
              margin-top: 2px;
            ">
              <span style="
                font-size: 11px;
                color: ${collegeInfo.secondaryColor};
                font-weight: 500;
                margin-right: 6px;
              ">
                Interactive Campus Map
              </span>
              <span style="
                display: inline-block;
                width: 6px;
                height: 6px;
                background-color: ${collegeInfo.secondaryColor};
                border-radius: 50%;
                animation: pulse 1.5s infinite;
              "></span>
            </div>
          </div>
        </div>
        <style>
          @keyframes shimmer { 0% { background-position: -100% 0; } 100% { background-position: 200% 0; } }
          @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.8; } 50% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.8; } }
        </style>
      `;
      
      collegeBannerDiv.addEventListener('mouseenter', () => {
        const banner = collegeBannerDiv.querySelector('div') as HTMLElement;
        const logo = collegeBannerDiv.querySelector('img') as HTMLElement;
        if (banner) banner.style.transform = 'scale(1.03)';
        if (logo) logo.style.transform = 'scale(1.1) rotate(5deg)';
      });
      
      collegeBannerDiv.addEventListener('mouseleave', () => {
        const banner = collegeBannerDiv.querySelector('div') as HTMLElement;
        const logo = collegeBannerDiv.querySelector('img') as HTMLElement;
        if (banner) banner.style.transform = 'scale(1)';
        if (logo) logo.style.transform = 'scale(1) rotate(0)';
      });
      
      collegeBannerDiv.addEventListener('click', () => {
        // Reset view to show entire campus with animation
        const boundsCalculator = new google.maps.LatLngBounds();
        campusBoundary.forEach(coord => {
          boundsCalculator.extend({ lat: coord[0], lng: coord[1] });
        });
        
        map.fitBounds(boundsCalculator);
        
        // Add a cool rotation effect
        let count = 0;
        const startHeading = map.getHeading() || 0;
        const interval = setInterval(() => {
          count++;
          const progress = count / 50;
          if (progress >= 1) {
            clearInterval(interval);
            map.setHeading(0);
            map.setTilt(0);
          } else {
            map.setHeading(startHeading + progress * 360);
            map.setTilt(45 * Math.sin(progress * Math.PI));
          }
        }, 20);
      });
      
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(collegeBannerDiv);
      
      // Add campus stats card
      const statsDiv = document.createElement('div');
      statsDiv.innerHTML = `
        <div style="
          margin: 10px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
          font-family: 'Arial', sans-serif;
          max-width: 180px;
        ">
          <div style="font-weight: bold; color: ${collegeInfo.primaryColor}; font-size: 12px; margin-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.1); padding-bottom: 4px; display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
            Campus Highlights
          </div>
          <div style="font-size: 11px; margin-bottom: 5px; display: flex; justify-content: space-between;">
            <span style="color: #666;">Established</span><span style="font-weight: 500; color: #333;">${collegeInfo.established}</span>
          </div>
          <div style="font-size: 11px; margin-bottom: 5px; display: flex; justify-content: space-between;">
            <span style="color: #666;">Campus Area</span><span style="font-weight: 500; color: #333;">${collegeInfo.campusArea}</span>
          </div>
          <div style="font-size: 11px; margin-bottom: 5px; display: flex; justify-content: space-between;">
            <span style="color: #666;">Buildings</span><span style="font-weight: 500; color: #333;">${collegeInfo.buildings}</span>
          </div>
          <div style="font-size: 11px; display: flex; justify-content: space-between;">
            <span style="color: #666;">Students</span><span style="font-weight: 500; color: #333;">${collegeInfo.students}</span>
          </div>
        </div>
      `;
      map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(statsDiv);

      // Add campus boundary with enhanced styling
      const boundaryCoords = campusBoundary.map(coord => ({ lat: coord[0], lng: coord[1] }));
      const boundary = new google.maps.Polygon({
        paths: boundaryCoords,
        strokeColor: collegeInfo.primaryColor,
        strokeOpacity: 0.9,
        strokeWeight: 3,
        fillColor: collegeInfo.primaryColor,
        fillOpacity: 0.05,
        map: map,
        zIndex: 1
      });
      
      // Add animated dash pattern to boundary
      const lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        strokeWeight: 3,
        scale: 3,
      };
      
      const boundaryLine = new google.maps.Polyline({
        path: [...boundaryCoords, boundaryCoords[0]], // Close the loop
        strokeOpacity: 0,
        icons: [{
          icon: lineSymbol,
          offset: '0',
          repeat: '15px'
        }],
        map: map,
        zIndex: 2
      });
      
      // Animate the dash pattern
      let count = 0;
      window.setInterval(() => {
        count = (count + 1) % 200;
        const icons = boundaryLine.get('icons');
        icons[0].offset = (count / 2) + '%';
        boundaryLine.set('icons', icons);
      }, 50);
      
      boundaryRef.current = boundary;
      
      // Add glowing effect to boundary
      const glowEffect = new google.maps.Polygon({
        paths: boundaryCoords,
        strokeColor: collegeInfo.secondaryColor,
        strokeOpacity: 0.4,
        strokeWeight: 10,
        fillOpacity: 0,
        map: map,
        zIndex: 0
      });
      
      boundary.addListener('mouseover', () => {
        glowEffect.setOptions({ strokeOpacity: 0.8 });
        setIsHoveringBoundary(true);
      });
      
      boundary.addListener('mouseout', () => {
        glowEffect.setOptions({ strokeOpacity: 0.4 });
        setIsHoveringBoundary(false);
      });
      
      // Add 3D buildings effect for campus areas
      campusAreasEnhanced.forEach(area => {
        const areaCoords = area.coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }));
        
        // Create base polygon (ground floor)
        const polygon = new google.maps.Polygon({
          paths: areaCoords,
          strokeColor: area.color,
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: area.color,
          fillOpacity: 0.45,
          map: map,
          zIndex: 10
        });
        
        // Apply smoothing to the polygon
        polygon.setOptions({
          geodesic: true,
          clickable: true,
          editable: false,
          draggable: false
        });
        
        polygonsRef.current.push(polygon);
        
        // Add 3D effect with side walls if it's a building
        if (area.heightMeters > 0) {
          // Create shadow effect
          const shadowPolygon = new google.maps.Polygon({
            paths: areaCoords,
            strokeOpacity: 0,
            fillColor: '#000000',
            fillOpacity: 0.1,
            map: map,
            zIndex: 5
          });
          
          polygonsRef.current.push(shadowPolygon);
          
          // Create building label with 3D popup
          const buildingLabel = document.createElement('div');
          buildingLabel.innerHTML = `
            <div style="position: relative; transform: translateY(-50%); transform-style: preserve-3d; transition: all 0.3s ease;">
              <div style="
                padding: 5px 10px; 
                background: white; 
                border-radius: 8px; 
                font-weight: bold; 
                font-size: 11px;
                border-left: 3px solid ${area.color}; 
                box-shadow: 0 3px 8px rgba(0,0,0,0.15); 
                white-space: nowrap;
                color: #333; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                animation: float 3s ease-in-out infinite;
              ">
                <div style="
                  background: ${area.color}; 
                  border-radius: 50%; 
                  width: 18px; 
                  height: 18px; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  margin-right: 5px; 
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                ">
                  <img src="${area.icon}" style="width: 11px; height: 11px; filter: invert(1);" />
                </div>
                ${area.name}
              </div>
            </div>
            <style>
              @keyframes float { 
                0% { transform: translateY(-50%) translateZ(0); } 
                50% { transform: translateY(-60%) translateZ(0); } 
                100% { transform: translateY(-50%) translateZ(0); } 
              }
            </style>
          `;
          
          const buildingMarker = new AdvancedMarkerElement({
            map,
            position: { lat: area.center[0], lng: area.center[1] },
            content: buildingLabel,
            zIndex: 15
          });
          
          // Add hover effect and info on click
          buildingLabel.addEventListener('mouseenter', () => {
            buildingLabel.style.transform = 'scale(1.05)';
          });
          
          buildingLabel.addEventListener('mouseleave', () => {
            buildingLabel.style.transform = 'scale(1)';
          });
          
          buildingLabel.addEventListener('click', () => {
            if (infoWindowRef.current) {
              const content = `
                <div style="padding: 0; max-width: 280px; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.15); font-family: 'Arial', sans-serif;">
                  <div style="background: linear-gradient(135deg, ${area.color}, ${adjustColor(area.color, -30)}); padding: 15px; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent 60%);"></div>
                    <div style="display: flex; align-items: center; position: relative;">
                      <div style="background: rgba(255,255,255,0.2); border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; margin-right: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid rgba(255,255,255,0.3);">
                        <img src="${area.icon}" style="width: 24px; height: 24px; filter: invert(1);" />
                      </div>
                      <div>
                        <h3 style="margin: 0; font-size: 18px; color: white; font-weight: bold; text-shadow: 0 1px 3px rgba(0,0,0,0.2);">${area.name}</h3>
                        <div style="display: flex; align-items: center; margin-top: 4px;">
                          ${area.heightMeters > 0 ? `
                            <span style="font-size: 12px; color: rgba(255,255,255,0.9); display: flex; align-items: center; margin-right: 8px;">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 3px;">
                                <path d="M8 3v5H3"></path><path d="m21 8V3h-5"></path><path d="M3 16h5v5"></path><path d="M16 21h5v-5"></path>
                              </svg>
                              ${area.heightMeters}m high
                            </span>
                          ` : ''}
                          <span style="font-size: 12px; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px; color: white;">Zone ${area.id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style="padding: 15px; background: white;">
                    <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #444;">${area.description}</p>
                    <div style="display: flex; justify-content: space-between;">
                      <button onclick="document.getElementById('directions-${area.id}').style.display='block'" style="background: ${collegeInfo.primaryColor}; border: none; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; flex: 1; margin-right: 5px; display: flex; align-items: center; justify-content: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;">
                          <path d="M22 8a4 4 0 0 1-4 4H3"></path><path d="m18 4 4 4-4 4"></path><path d="M2 16a4 4 0 0 0 4 4h15"></path><path d="m8 12-4 4 4 4"></path>
                        </svg>
                        Directions
                      </button>
                      <button style="background: ${collegeInfo.secondaryColor}; border: none; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; flex: 1; margin-left: 5px; display: flex; align-items: center; justify-content: center;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;">
                          <rect width="18" height="18" x="3" y="3" rx="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                        </svg>
                        Photos
                      </button>
                    </div>
                    <div id="directions-${area.id}" style="display: none; margin-top: 10px; font-size: 12px; background: #f5f5f5; padding: 8px; border-radius: 6px; color: #555;">
                      <div style="font-weight: 500; margin-bottom: 4px; color: #333;">Directions from Main Entrance:</div>
                      <ol style="margin: 0; padding-left: 20px;">
                        <li>Enter through the main gate</li>
                        <li>Follow the yellow pathway</li>
                        <li>Turn left at the fountain</li>
                        <li>${area.name} will be on your right</li>
                      </ol>
                    </div>
                  </div>
                </div>
              `;
              
              infoWindowRef.current.setContent(content);
              infoWindowRef.current.setPosition({ lat: area.center[0], lng: area.center[1] });
              infoWindowRef.current.open(map);
              
              // Highlight the selected area
              const polygon = polygonsRef.current.find(p => {
                const polygonPath = p.getPath().getArray();
                const areaPath = area.coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }));
                return comparePolygonPaths(polygonPath, areaPath);
              });
              
              if (polygon) {
                polygon.setOptions({ 
                  fillOpacity: 0.7, 
                  strokeWeight: 2, 
                  strokeColor: adjustColor(area.color, 20), 
                  zIndex: 100 
                });
                
                google.maps.event.addListenerOnce(infoWindowRef.current, 'closeclick', () => {
                  polygon.setOptions({ 
                    fillOpacity: 0.45, 
                    strokeWeight: 1.5, 
                    strokeColor: area.color, 
                    zIndex: 10 
                  });
                });
              }
            }
          });
        }
      });
      
      // Add item markers with enhanced styling
      pins.forEach(pin => {
        const markerElement = document.createElement('div');
        markerElement.innerHTML = `
          <div class="pin-container" style="
            position: relative;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          ">
            <div style="
              position: relative;
              width: 36px;
              height: 36px;
              transform: ${selectedPin === pin.id ? 'scale(1.2)' : 'scale(1)'};
              transition: all 0.3s ease;
            ">
              <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${getStatusColor(pin.status)};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
                border: 2px solid white;
              ">
                <img 
                  src="/${pin.status}.svg" 
                  class="pin-icon"
                  style="
                    width: 20px;
                    height: 20px;
                    filter: invert(1);
                    transition: all 0.3s ease;
                  "
                  alt="${pin.status} item"
                />
              </div>
              
              ${selectedPin === pin.id ? `
                <div style="
                  position: absolute;
                  top: -5px;
                  right: -5px;
                  width: 16px;
                  height: 16px;
                  background-color: white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  border: 1px solid ${getStatusColor(pin.status)};
                  animation: pulse 1.5s infinite;
                ">
                  <div style="
                    width: 8px;
                    height: 8px;
                    background-color: ${getStatusColor(pin.status)};
                    border-radius: 50%;
                  "></div>
                </div>
              ` : ''}
              
              <div style="
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%) ${selectedPin === pin.id ? 'scale(1.2)' : 'scale(1)'};
                width: 10px;
                height: 10px;
                background-color: ${getStatusColor(pin.status)};
                clip-path: polygon(50% 100%, 0 0, 100% 0);
                filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
                transition: all 0.3s ease;
              "></div>
            </div>
          </div>
          
          <style>
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          </style>
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

      // Add campus pathways and roads
      addCampusPathways(map);
      
      // Add location search within campus
      addCampusSearch(map);
      
      // Add compass
      addCompass(map);
      
      // Add time-of-day lighting effects
      addTimeOfDayEffect(map);
      
      // Add 3D toggle button
      add3DToggle(map);
      
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
  }, [mapLoaded]);

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

  // Helper functions for area information
  function getAreaDescription(name: string): string {
    const descriptions: {[key: string]: string} = {
      "Turf": "Multi-purpose sports field used for cricket, football and other outdoor activities. Recently renovated with high-quality artificial turf.",
      "Main Garden": "Central garden area with seating benches, flowerbeds and walking paths. Popular spot for students during breaks.",
      "Swimming Pool": "Olympic-sized swimming pool with temperature control and adjacent changing facilities.",
      "Basketball Ground": "Full-sized basketball court with spectator seating and nighttime lighting.",
      "Main Building": "Primary academic building housing lecture halls, faculty offices, and administrative departments.",
      "Side Garden": "Quiet garden area often used for outdoor classes and student gatherings.",
      "South Garden": "Meditation garden with indigenous plants and water features.",
      "West Entrance": "Main campus entrance with security booth and visitor information center."
    };
    
    return descriptions[name] || "Campus area of Shri Aurobindo Institute of Technology.";
  }
  
  function getAreaIcon(name: string): string {
    const icons: {[key: string]: string} = {
      "Turf": "/icons/sports.svg",
      "Main Garden": "/icons/garden.svg",
      "Swimming Pool": "/icons/pool.svg",
      "Basketball Ground": "/icons/basketball.svg",
      "Main Building": "/icons/building.svg",
      "Side Garden": "/icons/tree.svg",
      "South Garden": "/icons/meditation.svg",
      "West Entrance": "/icons/entrance.svg"
    };
    
    return icons[name] || "/icons/location.svg";
  }
  
  function getAreaHeight(name: string): number {
    const heights: {[key: string]: number} = {
      "Main Building": 15,
      "Side Garden": 0,
      "South Garden": 0,
      "West Entrance": 5,
      // Non-buildings get 0 height
      "Turf": 0,
      "Main Garden": 0,
      "Swimming Pool": 0,
      "Basketball Ground": 0
    };
    
    return heights[name] || 0;
  }
  
  // Add campus pathways function
  function addCampusPathways(map: google.maps.Map) {
    // Define pathways coordinates
    const pathways = [
      // Main entrance to main building
      [
        {lat: 22.795613, lng: 75.842608},
        {lat: 22.795785, lng: 75.842228},
        {lat: 22.796002, lng: 75.842250}
      ],
      // Main building to side garden
      [
        {lat: 22.796398, lng: 75.843322},
        {lat: 22.795580, lng: 75.843393}
      ],
      // Main garden loop
      [
        {lat: 22.795785, lng: 75.842228},
        {lat: 22.796002, lng: 75.842250},
        {lat: 22.795895, lng: 75.843001},
        {lat: 22.795616, lng: 75.842964},
        {lat: 22.795785, lng: 75.842228}
      ]
    ];
    
    // Create the pathways
    pathways.forEach(path => {
      new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#FFD700',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: map
      });
    });
  }
  
  // Add compass function
  function addCompass(map: google.maps.Map) {
    const compassDiv = document.createElement('div');
    compassDiv.innerHTML = `
      <div style="
        margin: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <div id="compass-pointer" style="
          width: 22px;
          height: 22px;
          background-image: url('/compass.svg');
          background-size: cover;
          transition: transform 0.3s ease;
        "></div>
        <div style="
          position: absolute;
          font-size: 8px;
          font-weight: bold;
          top: 4px;
          color: #444;
        ">N</div>
      </div>
    `;
    
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(compassDiv);
    
    // Update compass orientation on map heading change
    map.addListener('heading_changed', () => {
      const heading = map.getHeading() || 0;
      const compassPointer = document.getElementById('compass-pointer');
      if (compassPointer) {
        compassPointer.style.transform = `rotate(${-heading}deg)`;
      }
    });
    
    // Reset orientation on click
    compassDiv.addEventListener('click', () => {
      map.setHeading(0);
    });
  }
  
  // Add campus search function
  function addCampusSearch(map: google.maps.Map) {
    const searchDiv = document.createElement('div');
    searchDiv.innerHTML = `
      <div style="
        margin: 10px;
        padding: 6px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
      ">
        <select id="campus-location-select" style="
          border: none;
          outline: none;
          background: transparent;
          padding: 4px 8px;
          font-size: 12px;
          width: 150px;
          color: #555;
        ">
          <option value="">Find locations...</option>
          ${campusAreas.map(area => `<option value="${area.id}">${area.name}</option>`).join('')}
        </select>
      </div>
    `;
    
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(searchDiv);
    
    // Add event listener to navigate to selected location
    const select = searchDiv.querySelector('#campus-location-select') as HTMLSelectElement;
    if (select) {
      select.addEventListener('change', () => {
        const selectedId = parseInt(select.value);
        if (selectedId) {
          const area = campusAreas.find(a => a.id === selectedId);
          if (area && mapRef.current) {
            mapRef.current.panTo({ lat: area.center[0], lng: area.center[1] });
            mapRef.current.setZoom(19);
            
            // Highlight the selected area
            polygonsRef.current.forEach(polygon => {
              const polygonArea = campusAreas.find(a => {
                const areaPath = a.coordinates.map(coord => ({ lat: coord[0], lng: coord[1] }));
                return comparePolygonPaths(polygon.getPath().getArray(), areaPath);
              });
              
              if (polygonArea && polygonArea.id === selectedId) {
                polygon.setOptions({ 
                  strokeWeight: 3,
                  strokeOpacity: 1,
                  fillOpacity: 0.6,
                  zIndex: 20
                });
                
                // Animate back to normal after 2 seconds
                setTimeout(() => {
                  polygon.setOptions({
                    strokeWeight: 1.5,
                    strokeOpacity: 0.8,
                    fillOpacity: 0.45,
                    zIndex: 10
                  });
                }, 2000);
              }
            });
            
            // Reset select after use
            setTimeout(() => {
              select.value = "";
            }, 1000);
          }
        }
      });
    }
  }
  
  // Helper function to compare polygon paths
  function comparePolygonPaths(path1: google.maps.LatLng[], path2: {lat: number, lng: number}[]): boolean {
    if (path1.length !== path2.length) return false;
    
    for (let i = 0; i < path1.length; i++) {
      const p1 = path1[i];
      const p2 = path2[i];
      if (Math.abs(p1.lat() - p2.lat) > 0.0001 || Math.abs(p1.lng() - p2.lng) > 0.0001) {
        return false;
      }
    }
    
    return true;
  }
  
  // Helper function to adjust colors
  function adjustColor(color: string, amount: number): string {
    return color; // Placeholder - implement color adjustment logic
  }
  
  // Add time-of-day lighting effects
  function addTimeOfDayEffect(map: google.maps.Map) {
    const hour = new Date().getHours();
    
    // Base custom map style
    const customMapStyle = [
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#a3ccff" }] },
      { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f0f4e8" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }, { weight: 1.5 }] },
      { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c8e6c9" }] },
      { featureType: "poi.school", elementType: "geometry", stylers: [{ color: "#fff9c4" }] },
    ];
    
    if (hour < 6 || hour >= 18) { // Night
      map.setOptions({
        styles: [
          ...customMapStyle,
          { featureType: "all", elementType: "geometry", stylers: [{ saturation: -30 }, { lightness: -15 }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#2c3e50" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a2634" }] },
        ],
      });
      
      // Add light glow around buildings at night
      campusAreasEnhanced.forEach(area => {
        if (area.heightMeters > 0) {
          new google.maps.Circle({
            center: { lat: area.center[0], lng: area.center[1] },
            radius: 30,
            fillColor: '#FFD700',
            fillOpacity: 0.15,
            strokeOpacity: 0,
            map,
            zIndex: 5,
          });
        }
      });
    } else if (hour >= 6 && hour < 10) { // Morning
      map.setOptions({
        styles: [
          ...customMapStyle,
          { featureType: "all", elementType: "geometry", stylers: [{ saturation: 10 }, { lightness: 5 }] },
          { featureType: "landscape", elementType: "geometry", stylers: [{ hue: "#ff9500" }] },
        ],
      });
    }
  }
  
  // Add 3D toggle button
  function add3DToggle(map: google.maps.Map) {
    const toggleButton = document.createElement('div');
    toggleButton.innerHTML = `
      <div style="
        margin: 10px;
        padding: 8px 12px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        font-family: 'Arial', sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
        font-weight: 500;
        color: ${collegeInfo.primaryColor};
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;">
          <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"></path>
        </svg>
        Toggle 3D View
      </div>
    `;
    
    toggleButton.addEventListener('click', () => {
      const currentTilt = map.getTilt() || 0;
      
      if (currentTilt === 0) {
        // Enable 3D view
        map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
        
        // First set the heading to ensure proper orientation
        map.setHeading(0);
        
        // Use a timeout to ensure the heading is applied before the tilt
        setTimeout(() => {
          // Apply the tilt with animation
          let tiltStep = 0;
          const tiltInterval = setInterval(() => {
            tiltStep += 5;
            map.setTilt(tiltStep);
            
            if (tiltStep >= 45) {
              clearInterval(tiltInterval);
            }
          }, 50);
          
          // Update button styling
          const buttonDiv = toggleButton.querySelector('div');
          const buttonIcon = toggleButton.querySelector('svg');
          if (buttonDiv) {
            buttonDiv.style.background = collegeInfo.primaryColor;
            buttonDiv.style.color = 'white';
          }
          if (buttonIcon) {
            buttonIcon.style.stroke = 'white';
          }
        }, 100);
      } else {
        // Disable 3D view with animation
        let tiltStep = currentTilt;
        const tiltInterval = setInterval(() => {
          tiltStep -= 5;
          map.setTilt(tiltStep);
          
          if (tiltStep <= 0) {
            clearInterval(tiltInterval);
            // Optionally switch back to roadmap
            if (mapType === 'roadmap') {
              map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
            }
          }
        }, 50);
        
        // Update button styling
        const buttonDiv = toggleButton.querySelector('div');
        const buttonIcon = toggleButton.querySelector('svg');
        if (buttonDiv) {
          buttonDiv.style.background = 'white';
          buttonDiv.style.color = collegeInfo.primaryColor;
        }
        if (buttonIcon) {
          buttonIcon.style.stroke = 'currentColor';
        }
      }
    });
    
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(toggleButton);
  }

  // Add function to update marker sizes based on zoom level
  function updateMarkerSizes() {
    if (!mapRef.current) return;
    
    const zoom = mapRef.current.getZoom();
    if (!zoom) return;
    
    // Calculate scale factor based on zoom level
    const scale = Math.pow(1.2, zoom - 17); // Base scale at zoom level 17
    
    // Update each marker's size
    Object.values(markersRef.current).forEach(marker => {
      const container = marker.content?.querySelector('.pin-container') as HTMLElement;
      if (container) {
        // Apply scale transform while preserving other transformations
        const baseScale = selectedPin && marker.title === selectedPin.toString() ? 1.2 : 1;
        container.style.transform = `scale(${baseScale * scale})`;
      }
    });
  }

  // Add event listener for zoom changes
  useEffect(() => {
    if (mapRef.current) {
      const listener = mapRef.current.addListener('zoom_changed', updateMarkerSizes);
      return () => {
        google.maps.event.removeListener(listener);
      };
    }
  }, [mapRef.current]);

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