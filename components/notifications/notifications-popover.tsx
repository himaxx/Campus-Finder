"use client"

import { Bell } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { NotificationItem } from "@/components/notifications/notification-item"

// Sample notifications data
const notifications = [
  {
    id: "1",
    title: "Potential Match Found",
    description: "We found a potential match for your lost headphones!",
    time: "Just now",
    read: false,
    type: "match",
  },
  {
    id: "2",
    title: "Item Claimed",
    description: "Your water bottle has been claimed by its owner.",
    time: "2 hours ago",
    read: false,
    type: "claim",
  },
  {
    id: "3",
    title: "New Message",
    description: "You have a new message about your lost laptop.",
    time: "Yesterday",
    read: true,
    type: "message",
  },
]

export function NotificationsPopover() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState(notifications)

  const unreadCount = notifs.filter((n) => !n.read).length

  const markAllAsRead = () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-1 text-xs" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifs.length > 0 ? (
            <div className="flex flex-col">
              {notifs.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center">
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          )}
        </div>
        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full justify-center">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

