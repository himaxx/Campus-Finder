"use client"

import { useState } from "react"
import { QrCode, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ReportForm } from "@/components/report/report-form"
import { QrScanner } from "@/components/report/qr-scanner"

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState("form")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Report an Item</h1>
              <p className="mt-2 text-muted-foreground">
                Report a lost or found item to help it find its way back home
              </p>
            </div>

            <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger
                  value="form"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Report Form
                </TabsTrigger>
                <TabsTrigger
                  value="qr"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  QR/NFC Scan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="form">
                <Card>
                  <CardHeader>
                    <CardTitle>Item Details</CardTitle>
                    <CardDescription>Provide as much detail as possible to help with identification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qr">
                <Card>
                  <CardHeader>
                    <CardTitle>Scan QR Code or NFC Tag</CardTitle>
                    <CardDescription>Quickly report an item by scanning its QR code or NFC tag</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <QrScanner />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

