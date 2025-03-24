"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Check, ChevronDown, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Sample items data
const items = [
  {
    id: "1",
    name: "Blue Backpack",
    category: "Bags",
    location: "Library, 2nd Floor",
    image: "/placeholder.svg?height=200&width=200",
    status: "lost",
    date: "2 hours ago",
  },
  {
    id: "2",
    name: "iPhone 13",
    category: "Electronics",
    location: "Student Center",
    image: "/placeholder.svg?height=200&width=200",
    status: "found",
    date: "Yesterday",
  },
  {
    id: "3",
    name: "Water Bottle",
    category: "Accessories",
    location: "Gym",
    image: "/placeholder.svg?height=200&width=200",
    status: "claimed",
    date: "2 days ago",
  },
  {
    id: "4",
    name: "Textbook",
    category: "Books",
    location: "Science Building",
    image: "/placeholder.svg?height=200&width=200",
    status: "lost",
    date: "3 days ago",
  },
  {
    id: "5",
    name: "Laptop Charger",
    category: "Electronics",
    location: "Engineering Lab",
    image: "/placeholder.svg?height=200&width=200",
    status: "found",
    date: "4 days ago",
  },
  {
    id: "6",
    name: "Student ID Card",
    category: "Documents",
    location: "Cafeteria",
    image: "/placeholder.svg?height=200&width=200",
    status: "claimed",
    date: "5 days ago",
  },
  {
    id: "7",
    name: "Wireless Earbuds",
    category: "Electronics",
    location: "Library",
    image: "/placeholder.svg?height=200&width=200",
    status: "lost",
    date: "1 week ago",
  },
  {
    id: "8",
    name: "Glasses Case",
    category: "Accessories",
    location: "Student Center",
    image: "/placeholder.svg?height=200&width=200",
    status: "found",
    date: "1 week ago",
  },
  {
    id: "9",
    name: "Umbrella",
    category: "Accessories",
    location: "Engineering Building",
    image: "/placeholder.svg?height=200&width=200",
    status: "lost",
    date: "2 weeks ago",
  },
]

interface ItemGalleryProps {
  searchQuery?: string
}

export function ItemGallery({ searchQuery = "" }: ItemGalleryProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filteredItems, setFilteredItems] = useState(items)

  useEffect(() => {
    let filtered = [...items]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        // Items are already sorted by newest
        break
      case "oldest":
        filtered = [...filtered].reverse()
        break
      case "a-z":
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
      case "z-a":
        filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    setFilteredItems(filtered)
  }, [searchQuery, sortBy])

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filteredItems.length} items found</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              Sort by
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("newest")}>
              <Check className={`mr-2 h-4 w-4 ${sortBy === "newest" ? "opacity-100" : "opacity-0"}`} />
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("oldest")}>
              <Check className={`mr-2 h-4 w-4 ${sortBy === "oldest" ? "opacity-100" : "opacity-0"}`} />
              Oldest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("a-z")}>
              <Check className={`mr-2 h-4 w-4 ${sortBy === "a-z" ? "opacity-100" : "opacity-0"}`} />
              A-Z
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("z-a")}>
              <Check className={`mr-2 h-4 w-4 ${sortBy === "z-a" ? "opacity-100" : "opacity-0"}`} />
              Z-A
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <CardContent className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <div
                      className={`absolute right-2 top-2 z-10 rounded-full px-2 py-1 text-xs font-medium text-white ${getStatusColor(item.status)}`}
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
                  <div className="p-4">
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
                    <div className="mt-4">
                      <Button size="sm" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">No items found</p>
          <Button variant="link" className="mt-2">
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}

