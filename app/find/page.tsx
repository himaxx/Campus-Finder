"use client"

import { useState } from "react"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ItemGallery } from "@/components/gallery/item-gallery"
import { FilterSidebar } from "@/components/gallery/filter-sidebar"

export default function FindPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Find Items</h1>
            <p className="mt-2 text-muted-foreground">
              Browse through lost and found items or search for something specific
            </p>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for items..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2 md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <FilterSidebar className={showFilters ? "block" : "hidden md:block"} />
            <ItemGallery searchQuery={searchQuery} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

