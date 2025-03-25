"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Sample data for recent items
const recentItems = [
  {
    id: "1",
    name: "Blue Backpack",
    category: "Bags",
    location: "Library, 2nd Floor",
    image: "/Blue Backpack.jpg?height=200&width=200",
    status: "lost",
    date: "2 hours ago",
  },
  {
    id: "2",
    name: "iPhone 13",
    category: "Electronics",
    location: "Student Center",
    image: "/iPhone 13.jpg?height=200&width=200",
    status: "found",
    date: "Yesterday",
  },
  {
    id: "3",
    name: "Water Bottle",
    category: "Accessories",
    location: "Gym",
    image: "/Water Bottle.jpg?height=200&width=200",
    status: "claimed",
    date: "2 days ago",
  },
  {
    id: "4",
    name: "Textbook",
    category: "Books",
    location: "Science Building",
    image: "/Textbook.jpg?height=200&width=200",
    status: "lost",
    date: "3 days ago",
  },
  {
    id: "5",
    name: "Laptop Charger",
    category: "Electronics",
    location: "Engineering Lab",
    image: "/Laptop Charger.jpg?height=200&width=200",
    status: "found",
    date: "4 days ago",
  },
  {
    id: "6",
    name: "Student ID Card",
    category: "Documents",
    location: "Cafeteria",
    image: "/Student ID Card.jpg?height=200&width=200",
    status: "claimed",
    date: "5 days ago",
  },
]

interface RecentItemsCarouselProps {
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

export function RecentItemsCarousel({ 
  autoSlide = true, 
  autoSlideInterval = 3000 
}: RecentItemsCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [autoplayPaused, setAutoplayPaused] = useState(false)
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Function to handle automatic sliding
  const startAutoplay = () => {
    if (!autoSlide) return;
    if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    
    autoplayIntervalRef.current = setInterval(() => {
      if (!autoplayPaused && carouselRef.current) {
        const { scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        // If we're at the end, go back to the beginning
        if (scrollPosition >= maxScroll) {
          const newPosition = 0;
          carouselRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
          setScrollPosition(newPosition);
        } else {
          // Otherwise, continue scrolling right
          const scrollAmount = clientWidth * 0.8;
          const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount);
          carouselRef.current.scrollTo({ left: newPosition, behavior: "smooth" });
          setScrollPosition(newPosition);
        }
      }
    }, autoSlideInterval);
  };

  // Start autoplay on component mount
  useEffect(() => {
    startAutoplay();
    
    // Clean up interval on unmount
    return () => {
      if (autoplayIntervalRef.current) clearInterval(autoplayIntervalRef.current);
    };
  }, [scrollPosition, autoplayPaused]);

  // Add logic to handle auto-sliding
  useEffect(() => {
    if (!autoSlide) return;
    
    const slideTimer = setInterval(() => {
      // Add your sliding logic here
    }, autoSlideInterval);

    return () => clearInterval(slideTimer);
  }, [autoSlide, autoSlideInterval]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return

    // Pause autoplay temporarily when manually scrolling
    setAutoplayPaused(true);
    setTimeout(() => setAutoplayPaused(false), 10000); // Resume after 10 seconds

    const { scrollWidth, clientWidth } = carouselRef.current
    const scrollAmount = clientWidth * 0.8

    const maxScroll = scrollWidth - clientWidth

    if (direction === "left") {
      const newPosition = Math.max(0, scrollPosition - scrollAmount)
      carouselRef.current.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    } else {
      const newPosition = Math.min(maxScroll, scrollPosition + scrollAmount)
      carouselRef.current.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  // Mouse/Touch event handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setAutoplayPaused(true);
    
    // Get the starting position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    // Get current position
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = startX - clientX;
    
    // Scroll the carousel
    carouselRef.current.scrollLeft = scrollPosition + diff;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !carouselRef.current) return;
    
    setIsDragging(false);
    
    // Get final position
    const clientX = 'touches' in e ? 
      (e as React.TouchEvent).changedTouches[0].clientX : 
      (e as React.MouseEvent).clientX;
    
    const diff = startX - clientX;
    
    // If the drag was significant, move to next/prev
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        scroll("right");
      } else {
        scroll("left");
      }
    } else {
      // If it was a small drag, stay at current position
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
    }
    
    // Resume autoplay after 10 seconds
    setTimeout(() => setAutoplayPaused(false), 10000);
  };

  // Update scroll position when scrolling manually
  const handleScroll = () => {
    if (carouselRef.current && !isDragging) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "lost":
        return "bg-red-500"
      case "found":
        return "bg-green-500"
      case "claimed":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="relative">
      <div 
        ref={carouselRef} 
        className={`flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onScroll={handleScroll}
      >
        {recentItems.map((item) => (
          <Card
            key={item.id}
            className="min-w-[280px] sm:min-w-[250px] flex-shrink-0 cursor-pointer snap-start transition-transform duration-300 hover:scale-[1.02]"
          >
            <CardContent className="p-0">
              <div className="relative h-40 w-full overflow-hidden">
                <div
                  className={cn(
                    "absolute right-2 top-2 z-10 rounded-full px-2 py-1 text-xs font-medium text-white",
                    getStatusColor(item.status),
                  )}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </div>
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h3 className="font-semibold">{item.name}</h3>
                <div className="mt-1 flex items-center text-xs text-muted-foreground">
                  <Badge variant="outline" className="mr-2">
                    {item.category}
                  </Badge>
                  <span>{item.date}</span>
                </div>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  {item.location}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute -left-2 sm:-left-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={() => scroll("left")}
        disabled={scrollPosition <= 0}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Scroll left</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute -right-2 sm:-right-4 top-1/2 z-10 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={() => scroll("right")}
        disabled={scrollPosition >= (carouselRef.current?.scrollWidth || 0) - (carouselRef.current?.clientWidth || 0)}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Scroll right</span>
      </Button>
    </div>
  )
}

