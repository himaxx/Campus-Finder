"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Check, MapPin, Upload, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

// Helper function to generate a unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export function ReportForm() {
  const [images, setImages] = useState<{id: string, file: File, preview: string}[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [formState, setFormState] = useState({
    type: "lost",
    category: "",
    name: "",
    description: "",
    location: "",
    date: "",
    contactMethod: "email",
    contactInfo: "",
    landmark: "",
  })
  const { toast } = useToast()
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

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

  // Handle real file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    
    // Process each file
    const newFiles = Array.from(e.target.files)
    
    // Only allow up to 3 images total
    if (images.length + newFiles.length > 3) {
      toast({
        title: "Too many images",
        description: `You can only upload up to 3 images. Adding ${3 - images.length} more.`,
        variant: "destructive"
      })
      
      // Only take what we can fit
      newFiles.splice(3 - images.length)
    }
    
    // Create preview and add to images array
    const newImages = await Promise.all(
      newFiles.map(async (file) => {
        // Create a preview URL
        const preview = URL.createObjectURL(file)
        
        return {
          id: generateId(),
          file,
          preview
        }
      })
    )
    
    setImages(prev => [...prev, ...newImages])
    setUploading(false)
    
    // Reset file input
    e.target.value = ""
    
    toast({
      title: "Image uploaded",
      description: `Successfully uploaded ${newImages.length} image${newImages.length > 1 ? 's' : ''}.`,
    })
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  
  const handleCameraClick = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      // Get the image that's being removed
      const imageToRemove = prev.find(img => img.id === id)
      
      // Revoke the object URL to prevent memory leaks
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      
      // Return filtered array
      return prev.filter(img => img.id !== id)
    })
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation services.",
        variant: "destructive"
      })
      return
    }
    
    // Check if we're in a secure context using the standard Web API
    if (!window.isSecureContext) {
      toast({
        title: "Insecure connection",
        description: "Geolocation requires a secure (HTTPS) connection. Please access this site via HTTPS.",
        variant: "destructive"
      })
      return
    }
    
    setIsGettingLocation(true)
    setLocationError(null)
    
    // Use high accuracy option to trigger permission prompt on mobile
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success handler
        const { latitude, longitude } = position.coords
        
        // Round to 6 decimal places for readability
        const lat = latitude.toFixed(6)
        const lng = longitude.toFixed(6)
        
        // Update the location field with coordinates
        setFormState(prev => ({ 
          ...prev, 
          location: `${lat}, ${lng}`,
          // Store exact coordinates for the map
          lat: latitude,
          lng: longitude
        }))
        
        setIsGettingLocation(false)
        
        toast({
          title: "Location detected",
          description: "Your current location has been added to the report.",
        })
      },
      (error) => {
        // Error handler
        setIsGettingLocation(false)
        
        let errorMessage = "Unknown error occurred while getting location."
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location services in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out."
            break
        }
        
        setLocationError(errorMessage)
        
        toast({
          title: "Location error",
          description: errorMessage,
          variant: "destructive"
        })
      },
      options
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form fields
    if (!formState.category) {
      toast({
        title: "Missing information",
        description: "Please select a category for the item.",
        variant: "destructive"
      })
      return
    }
    
    if (!formState.name) {
      toast({
        title: "Missing information",
        description: "Please provide a name for the item.",
        variant: "destructive"
      })
      return
    }
    
    if (formState.contactMethod !== "inapp" && !formState.contactInfo) {
      toast({
        title: "Missing information",
        description: "Please provide your contact information.",
        variant: "destructive"
      })
      return
    }
    
    try {
      setUploading(true)
      
      // 1. Upload images first
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const formData = new FormData()
          formData.append('file', image.file)
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
          
          if (!response.ok) {
            throw new Error('Failed to upload image')
          }
          
          const data = await response.json()
          return data.url
        })
      )
      
      // 2. Prepare report data
      const reportData = {
        type: formState.type,
        category: formState.category,
        name: formState.name,
        description: formState.description,
        location: formState.location,
        landmark: formState.landmark,
        latitude: formState.lat,
        longitude: formState.lng,
        date: formState.date || new Date().toISOString().split('T')[0],
        contactMethod: formState.contactMethod,
        contactInfo: formState.contactInfo,
        imageUrls: imageUrls,
      }
      
      // 3. Submit report to API
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit report')
      }
      
      // 4. Get response and show success message
      const result = await response.json()
      
      toast({
        title: "Report submitted",
        description: "Your item has been reported successfully.",
      })
      
      // 5. Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error submitting report:', error)
      toast({
        title: "Submission failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
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
                onClick={handleGetLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                <span className="sr-only">Get current location</span>
              </Button>
            </div>
            {locationError && (
              <p className="text-xs text-destructive">{locationError}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" value={formState.date} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="landmark">Landmark</Label>
          <Input
            id="landmark"
            name="landmark"
            placeholder="e.g., Library, Auditorium Hall"
            value={formState.landmark}
            onChange={handleChange}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base">Images</Label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="relative aspect-square overflow-hidden rounded-md border">
              <img
                src={image.preview}
                alt={`Uploaded image`}
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 rounded-full"
                onClick={() => handleRemoveImage(image.id)}
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
                          onClick={handleUploadClick}
                        >
                          <Upload className="h-4 w-4" />
                          <span className="sr-only">Upload image</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleCameraClick}
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
        
        {/* Hidden file inputs */}
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          multiple={images.length < 2}
        />
        <input 
          type="file" 
          ref={cameraInputRef}
          className="hidden" 
          accept="image/*" 
          capture="environment"
          onChange={handleFileChange}
        />
        
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

