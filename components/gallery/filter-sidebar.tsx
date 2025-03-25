"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, ChevronDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

// Add this interface to define the filter state that will be passed to parent components
interface FilterState {
  statusFilter: string;
  dateRange: number[];
  selectedCategories: string[];
  selectedLocations: string[];
}

interface FilterSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add onFilterChange prop to communicate filter changes to parent component
  onFilterChange?: (filters: FilterState) => void;
}

export function FilterSidebar({ className, onFilterChange, ...props }: FilterSidebarProps) {
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState([0, 30])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])

  // Function to handle category selection
  const handleCategoryChange = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(category => category !== id) : [...prev, id]
    );
  };

  // Function to handle location selection
  const handleLocationChange = (id: string) => {
    setSelectedLocations(prev => 
      prev.includes(id) ? prev.filter(location => location !== id) : [...prev, id]
    );
  };

  // Function to apply filters
  const applyFilters = () => {
    const filterState: FilterState = {
      statusFilter,
      dateRange,
      selectedCategories,
      selectedLocations
    };
    
    // Call the onFilterChange prop with the current filter state
    if (onFilterChange) {
      onFilterChange(filterState);
    }
    
    console.log("Applying filters:", filterState);
  };

  // Function to reset filters
  const resetFilters = () => {
    setStatusFilter("all");
    setDateRange([0, 30]);
    setSelectedCategories([]);
    setSelectedLocations([]);
    
    // Also notify parent component about the reset
    if (onFilterChange) {
      onFilterChange({
        statusFilter: "all",
        dateRange: [0, 30],
        selectedCategories: [],
        selectedLocations: []
      });
    }
  };

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
            <Checkbox id="electronics" checked={selectedCategories.includes("electronics")} onCheckedChange={() => handleCategoryChange("electronics")} />
            <Label htmlFor="electronics" className="cursor-pointer">
              Electronics
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="clothing" checked={selectedCategories.includes("clothing")} onCheckedChange={() => handleCategoryChange("clothing")} />
            <Label htmlFor="clothing" className="cursor-pointer">
              Clothing
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="accessories" checked={selectedCategories.includes("accessories")} onCheckedChange={() => handleCategoryChange("accessories")} />
            <Label htmlFor="accessories" className="cursor-pointer">
              Accessories
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="books" checked={selectedCategories.includes("books")} onCheckedChange={() => handleCategoryChange("books")} />
            <Label htmlFor="books" className="cursor-pointer">
              Books & Notes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="ids" checked={selectedCategories.includes("ids")} onCheckedChange={() => handleCategoryChange("ids")} />
            <Label htmlFor="ids" className="cursor-pointer">
              IDs & Cards
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="other" checked={selectedCategories.includes("other")} onCheckedChange={() => handleCategoryChange("other")} />
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
            <Checkbox id="library" checked={selectedLocations.includes("library")} onCheckedChange={() => handleLocationChange("library")} />
            <Label htmlFor="library" className="cursor-pointer">
              Library
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="student-center" checked={selectedLocations.includes("student-center")} onCheckedChange={() => handleLocationChange("student-center")} />
            <Label htmlFor="student-center" className="cursor-pointer">
              Student Center
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="gym" checked={selectedLocations.includes("gym")} onCheckedChange={() => handleLocationChange("gym")} />
            <Label htmlFor="gym" className="cursor-pointer">
              Gym
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="science-building" checked={selectedLocations.includes("science-building")} onCheckedChange={() => handleLocationChange("science-building")} />
            <Label htmlFor="science-building" className="cursor-pointer">
              Science Building
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="engineering-lab" checked={selectedLocations.includes("engineering-lab")} onCheckedChange={() => handleLocationChange("engineering-lab")} />
            <Label htmlFor="engineering-lab" className="cursor-pointer">
              Engineering Lab
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cafeteria" checked={selectedLocations.includes("cafeteria")} onCheckedChange={() => handleLocationChange("cafeteria")} />
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
        <Button className="w-full" onClick={applyFilters}>
          <Check className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
        <Button variant="outline" className="w-full" onClick={resetFilters}>
          <X className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

