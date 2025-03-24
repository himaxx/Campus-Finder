"use client"

import type React from "react"

import { useState } from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

interface FilterSidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function FilterSidebar({ className, ...props }: FilterSidebarProps) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState([0, 30])

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between md:hidden">
        <h3 className="font-medium">Filters</h3>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <div>
        <h3 className="mb-2 font-medium">Status</h3>
        <RadioGroup value={statusFilter} onValueChange={setStatusFilter}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">
              All
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="lost" id="lost" />
            <Label htmlFor="lost" className="cursor-pointer">
              Lost
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="found" id="found" />
            <Label htmlFor="found" className="cursor-pointer">
              Found
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="claimed" id="claimed" />
            <Label htmlFor="claimed" className="cursor-pointer">
              Claimed
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <h3 className="font-medium">Categories</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="electronics" />
            <Label htmlFor="electronics" className="cursor-pointer">
              Electronics
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="clothing" />
            <Label htmlFor="clothing" className="cursor-pointer">
              Clothing
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="accessories" />
            <Label htmlFor="accessories" className="cursor-pointer">
              Accessories
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="books" />
            <Label htmlFor="books" className="cursor-pointer">
              Books & Notes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ids" />
            <Label htmlFor="ids" className="cursor-pointer">
              IDs & Cards
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="other" />
            <Label htmlFor="other" className="cursor-pointer">
              Other
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <h3 className="font-medium">Locations</h3>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="library" />
            <Label htmlFor="library" className="cursor-pointer">
              Library
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="student-center" />
            <Label htmlFor="student-center" className="cursor-pointer">
              Student Center
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="gym" />
            <Label htmlFor="gym" className="cursor-pointer">
              Gym
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="science-building" />
            <Label htmlFor="science-building" className="cursor-pointer">
              Science Building
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="engineering-lab" />
            <Label htmlFor="engineering-lab" className="cursor-pointer">
              Engineering Lab
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cafeteria" />
            <Label htmlFor="cafeteria" className="cursor-pointer">
              Cafeteria
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      <div>
        <h3 className="mb-2 font-medium">Date Range</h3>
        <div className="px-2">
          <Slider defaultValue={[0, 30]} max={30} step={1} value={dateRange} onValueChange={setDateRange} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Today</span>
          <span>30 days ago</span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <Button className="w-full">
          <Check className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full">
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

