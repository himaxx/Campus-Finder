"use client"

import { useState } from "react"
import { Activity, Map, MessageSquare, PlusCircle, Search, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentItemsCarousel } from "@/components/dashboard/recent-items-carousel"
import { CampusMap } from "@/components/map/campus-map"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { ChatAssistant } from "@/components/chat/chat-assistant"

export function MainDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const handleReportItem = () => {
    router.push("/report")
  }

  return (
    <div className="flex flex-col">
      {/* Hero section with glassmorphism */}
      <div className="relative flex h-[200px] sm:h-[300px] w-full items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-20 blur-sm"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10 flex flex-col items-center justify-center space-y-4 text-center px-4">
          <h1 className="animate-fade-up text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Campus<span className="text-blue-200">Finder</span>
          </h1>
          <p className="animate-fade-up text-base sm:text-lg text-white/90 animation-delay-100 max-w-[600px]">
            The next-generation lost & found portal for your campus
          </p>
          <div className="animate-fade-up flex flex-col sm:flex-row gap-4 animation-delay-200 w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto group relative overflow-hidden rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
              onClick={handleReportItem}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Report Item
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              onClick={() => router.push("/find")}
            >
              <Search className="mr-2 h-4 w-4" />
              Find Items
            </Button>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="container py-6 px-4 sm:py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4 gap-2">
              <TabsTrigger value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="map">
                <Map className="mr-2 h-4 w-4 hidden sm:block" />
                Map
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="mr-2 h-4 w-4 hidden sm:block" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="mr-2 h-4 w-4 hidden sm:block" />
                Chat
              </TabsTrigger>
            </TabsList>
            <Button 
              className="w-full sm:w-auto rounded-full" 
              onClick={handleReportItem}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Report Item
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <StatsCards />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-5">
                <CardHeader>
                  <CardTitle>Recently Reported Items</CardTitle>
                  <CardDescription>Browse through the latest lost and found items</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentItemsCarousel autoSlide={true} autoSlideInterval={3000} />
                </CardContent>
              </Card>
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <QuickActions />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="map" className="min-h-[500px] space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campus Map</CardTitle>
                <CardDescription>Explore lost and found items across campus</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <CampusMap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Activity Feed</CardTitle>
                  <CardDescription>Recent activity and community engagement</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Leaderboard
                </Button>
              </CardHeader>
              <CardContent>
                <ActivityFeed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Assistant</CardTitle>
                <CardDescription>Get help with finding or reporting lost items</CardDescription>
              </CardHeader>
              <CardContent>
                <ChatAssistant />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

