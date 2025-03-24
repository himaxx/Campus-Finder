"use client"

import { ArrowUpRight, CheckCircle, Clock, Search } from "lucide-react"
import CountUp from "react-countup"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <div className="rounded-full bg-primary/10 p-1 text-primary">
            <Search className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp end={1248} duration={2.5} />
          </div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-primary/10">
            <div className="h-full w-[75%] rounded-full bg-primary" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Claimed Items</CardTitle>
          <div className="rounded-full bg-green-500/10 p-1 text-green-500">
            <CheckCircle className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp end={842} duration={2.5} />
          </div>
          <p className="text-xs text-muted-foreground">67.5% success rate</p>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-green-500/10">
            <div className="h-full w-[67%] rounded-full bg-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
          <div className="rounded-full bg-yellow-500/10 p-1 text-yellow-500">
            <Clock className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp end={406} duration={2.5} />
          </div>
          <p className="text-xs text-muted-foreground">32.5% of total items</p>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-yellow-500/10">
            <div className="h-full w-[32%] rounded-full bg-yellow-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <div className="rounded-full bg-blue-500/10 p-1 text-blue-500">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp end={3642} duration={2.5} />
          </div>
          <p className="text-xs text-muted-foreground">+24% from last semester</p>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-blue-500/10">
            <div className="h-full w-[85%] rounded-full bg-blue-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

