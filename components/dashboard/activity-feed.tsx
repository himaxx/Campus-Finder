"use client"

import { useState } from "react"
import { Award, CheckCircle, Clock, MapPin, Search, User } from "lucide-react"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Sample activity data
const activityItems = [
  {
    id: "1",
    type: "found",
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    item: "Blue Backpack",
    location: "Library, 2nd Floor",
    time: "2 hours ago",
    points: 15,
  },
  {
    id: "2",
    type: "claimed",
    user: {
      name: "Sarah Williams",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SW",
    },
    item: "iPhone 13",
    location: "Student Center",
    time: "Yesterday",
    points: 25,
  },
  {
    id: "3",
    type: "lost",
    user: {
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MB",
    },
    item: "Laptop Charger",
    location: "Engineering Lab",
    time: "2 days ago",
    points: 10,
  },
  {
    id: "4",
    type: "badge",
    user: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "ED",
    },
    badge: "Good Samaritan",
    description: "Returned 5 items to their owners",
    time: "3 days ago",
    points: 50,
  },
  {
    id: "5",
    type: "found",
    user: {
      name: "David Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DW",
    },
    item: "Textbook",
    location: "Science Building",
    time: "4 days ago",
    points: 15,
  },
]

export function ActivityFeed() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "found":
        return <Search className="h-4 w-4 text-green-500" />
      case "lost":
        return <Clock className="h-4 w-4 text-red-500" />
      case "claimed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "badge":
        return <Award className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getActivityTitle = (item: any) => {
    switch (item.type) {
      case "found":
        return (
          <span>
            <span className="font-medium">{item.user.name}</span> found a{" "}
            <span className="font-medium">{item.item}</span>
          </span>
        )
      case "lost":
        return (
          <span>
            <span className="font-medium">{item.user.name}</span> reported a lost{" "}
            <span className="font-medium">{item.item}</span>
          </span>
        )
      case "claimed":
        return (
          <span>
            <span className="font-medium">{item.user.name}</span> claimed their{" "}
            <span className="font-medium">{item.item}</span>
          </span>
        )
      case "badge":
        return (
          <span>
            <span className="font-medium">{item.user.name}</span> earned the{" "}
            <span className="font-medium">{item.badge}</span> badge
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {activityItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex cursor-pointer gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
          onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
        >
          <Avatar>
            <AvatarImage src={item.user.avatar} alt={item.user.name} />
            <AvatarFallback>{item.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getActivityIcon(item.type)}
                <p className="text-sm">{getActivityTitle(item)}</p>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <Award className="h-3 w-3" />
                {item.points} pts
              </Badge>
            </div>
            {item.type !== "badge" && item.location && (
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3" />
                {item.location}
              </div>
            )}
            {item.type === "badge" && <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>}
            <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>

            {expandedItem === item.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-3 rounded-md bg-muted p-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  <span>View {item.user.name}'s profile</span>
                </div>
                {item.type !== "badge" && (
                  <div className="mt-2 flex items-center gap-2">
                    <Search className="h-3 w-3" />
                    <span>View item details</span>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

