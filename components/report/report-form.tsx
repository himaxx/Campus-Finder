"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Check, MapPin, Upload, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

export function ReportForm() {
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [formState, setFormState] = useState({
    type: "lost",
    category: "",
    name: "",
    description: "",
    location: "",
    date: "",
    contactMethod: "email",
    contactInfo: "",
  })
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value: string) => {
    setFormState((prev) => ({ ...prev, type: value }))
  }

  const handleContactMethodChange = (value: string) => {
    setFormState((prev) => ({ ...prev, contactMethod: value }))
  }

  const handleCategoryChange = (value: string) => {
    setFormState((prev) => ({ ...prev, category: value }))
  }

  const handleImageUpload = () => {
    setUploading(true)

    // Simulate image upload delay
    setTimeout(() => {
      setImages((prev) => [...prev, `/placeholder.svg?height=200&width=200`])
      setUploading(false)

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      })
    }, 1500)
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate form submission
    toast({
      title: "Report submitted",
      description: "Your item has been reported successfully.",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base">Item Status</Label>
          <RadioGroup
            defaultValue="lost"
            value={formState.type}
            onValueChange={handleRadioChange}
            className="mt-2 flex"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lost" id="lost" />
              <Label htmlFor="lost" className="cursor-pointer font-normal">
                Lost
              </Label>
            </div>
            <div className="ml-6 flex items-center space-x-2">
              <RadioGroupItem value="found" id="found" />
              <Label htmlFor="found" className="cursor-pointer font-normal">
                Found
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formState.category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="books">Books & Notes</SelectItem>
                <SelectItem value="ids">IDs & Cards</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Blue Backpack"
              value={formState.name}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Provide details about the item (color, brand, distinguishing features, etc.)"
            rows={3}
            value={formState.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <Input
                id="location"
                name="location"
                placeholder="e.g., Library, 2nd Floor"
                value={formState.location}
                onChange={handleChange}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
              >
                <MapPin className="h-4 w-4" />
                <span className="sr-only">Select location on map</span>
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={formState.date} onChange={handleChange} />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base">Images</Label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
              <img
                src={image || "/placeholder.svg"}
                alt={`Uploaded image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 rounded-full"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          ))}

          {images.length < 3 && (
            <div className="aspect-square rounded-md border border-dashed">
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <AnimatePresence mode="wait">
                  {uploading ? (
                    <motion.div
                      key="uploading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center"
                    >
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="mt-2 text-xs text-muted-foreground">Uploading...</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upload-options"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center gap-2"
                    >
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleImageUpload}
                        >
                          <Upload className="h-4 w-4" />
                          <span className="sr-only">Upload image</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleImageUpload}
                        >
                          <Camera className="h-4 w-4" />
                          <span className="sr-only">Take photo</span>
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">Add Image</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Add up to 3 clear images of the item to help with identification
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base">Contact Information</Label>
        <RadioGroup
          defaultValue="email"
          value={formState.contactMethod}
          onValueChange={handleContactMethodChange}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="cursor-pointer font-normal">
              Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone" className="cursor-pointer font-normal">
              Phone
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inapp" id="inapp" />
            <Label htmlFor="inapp" className="cursor-pointer font-normal">
              In-app only
            </Label>
          </div>
        </RadioGroup>

        {formState.contactMethod !== "inapp" && (
          <div className="space-y-2">
            <Label htmlFor="contactInfo">
              {formState.contactMethod === "email" ? "Email Address" : "Phone Number"}
            </Label>
            <Input
              id="contactInfo"
              name="contactInfo"
              placeholder={formState.contactMethod === "email" ? "your.email@example.com" : "(123) 456-7890"}
              type={formState.contactMethod === "email" ? "email" : "tel"}
              value={formState.contactInfo}
              onChange={handleChange}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="group relative overflow-hidden">
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Check className="mr-2 h-4 w-4" />
            Submit Report
          </span>
          <span className="transition-opacity duration-300 group-hover:opacity-0">Submit Report</span>
        </Button>
      </div>
    </form>
  )
}

