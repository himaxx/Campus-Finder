import type React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
        <div className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with ❤️ for campus communities. © {new Date().getFullYear()} CampusFinder
        </div>
        <div className="flex gap-4">
          <Link
            href="/terms"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-sm text-muted-foreground")}
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-sm text-muted-foreground")}
          >
            Privacy
          </Link>
          <Link
            href="/feedback"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-sm text-muted-foreground")}
          >
            Feedback
          </Link>
        </div>
      </div>
    </footer>
  )
}

