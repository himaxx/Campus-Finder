"use client"

import { useState } from "react"
import { MessageSquare, Search, Tag } from "lucide-react"

import { cn } from "@/lib/utils"

type NotificationType = "match" | "claim" | "message"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: NotificationType
}

interface NotificationItemProps {
  notification: Notification
  onRead: () => void
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "match":
        return <Search className="h-4 w-4 text-blue-500" />
      case "claim":
        return <Tag className="h-4 w-4 text-green-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer gap-3 border-b p-3 transition-colors",
        notification.read ? "bg-background" : "bg-muted/30",
        isHovered && "bg-muted",
      )}
      onClick={onRead}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">{getIcon(notification.type)}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <p className={cn("text-sm font-medium", !notification.read && "text-primary")}>{notification.title}</p>
          <span className="text-xs text-muted-foreground">{notification.time}</span>
        </div>
        <p className="text-xs text-muted-foreground">{notification.description}</p>
      </div>
      {!notification.read && (
        <div className="flex h-full items-center">
          <div className="h-2 w-2 rounded-full bg-primary"></div>
        </div>
      )}
    </div>
  )
}

