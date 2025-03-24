"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NotificationsPopover } from "@/components/notifications/notifications-popover"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
  },
  {
    title: "Report Item",
    href: "/report",
  },
  {
    title: "Find Items",
    href: "/find",
  },
  {
    title: "My Items",
    href: "/my-items",
  },
  {
    title: "Community",
    href: "/community",
  },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      
      // Initial check
      checkMobile()
      
      // Set up listener for window resize
      window.addEventListener("resize", checkMobile)
      
      // Clean up
      return () => window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden mr-3">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] p-0">
            <div className="flex h-full flex-col">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-primary">
                    Campus<span className="text-foreground">Finder</span>
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto py-2">
                <div className="px-2 py-3">
                  <div className="text-xs font-medium text-muted-foreground px-4 mb-2">
                    Navigation
                  </div>
                  <nav className="space-y-1">
                    {mainNavItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center px-4 py-2 text-sm font-medium rounded-md",
                          pathname === item.href 
                            ? "bg-accent text-accent-foreground" 
                            : "text-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        )}
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
              
              <div className="border-t p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium">John Doe</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            Campus<span className="text-primary">Finder</span>
          </span>
        </Link>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {mainNavItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === item.href && "bg-accent text-accent-foreground",
                    )}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" size="icon" className="mr-2">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
          <NotificationsPopover />
          <ThemeToggle />
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

