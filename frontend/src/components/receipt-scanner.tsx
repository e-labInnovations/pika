"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, ImageIcon, Sparkles, Check, X, Loader2, CreditCard, Smartphone, Receipt } from "lucide-react"

interface ReceiptScannerProps {
  isOpen: boolean
  onClose: () => void
  onScanComplete: (data: any) => void
}

const receiptTypes = [
  {
    id: "google-pay",
    name: "Google Pay",
    icon: Smartphone,
    color: "bg-green-500",
    description: "Digital payment receipts",
  },
  {
    id: "paytm",
    name: "Paytm",
    icon: CreditCard,
    color: "bg-blue-500",
    description: "Digital wallet receipts",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    icon: Receipt,
    color: "bg-orange-500",
    description: "Food & dining receipts",
  },
  {
    id: "general",
    name: "General",
    icon: Receipt,
    color: "bg-purple-500",
    description: "Any other receipt",
  },
]

export function ReceiptScanner({ isOpen, onClose, onScanComplete }: ReceiptScannerProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setUploadedImage(result)
        simulateAIScan(file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    // In a real app, this would open the camera
    // For demo purposes, we'll simulate it
    setUploadedImage("/placeholder.svg?height=300&width=400")
    simulateAIScan("camera_capture.jpg")
  }

  const simulateAIScan = (fileName: string) => {
    setIsScanning(true)

    // Simulate AI processing delay
    setTimeout(() => {
      // Mock AI-extracted data based on receipt type
      const mockData = {
        "google-pay": {
          title: "Google Pay Transfer",
          amount: "25.50",
          date: "2024-11-15",
          time: "14:30",
          description: "Payment to John's Coffee Shop via Google Pay",
          merchant: "John's Coffee Shop",
          paymentMethod: "Google Pay",
          receiptImage: uploadedImage, // Include the uploaded image
        },
        paytm: {
          title: "Paytm Payment",
          amount: "150.00",
          date: "2024-11-15",
          time: "12:15",
          description: "Grocery shopping payment via Paytm",
          merchant: "SuperMart",
          paymentMethod: "Paytm Wallet",
          receiptImage: uploadedImage,
        },
        restaurant: {
          title: "Restaurant Bill",
          amount: "85.75",
          date: "2024-11-15",
          time: "19:45",
          description: "Dinner at The Italian Place",
          merchant: "The Italian Place",
          items: ["Pasta Carbonara", "Caesar Salad", "Tiramisu"],
          receiptImage: uploadedImage,
        },
        general: {
          title: "Purchase Receipt",
          amount: "42.99",
          date: "2024-11-15",
          time: "16:20",
          description: "General purchase receipt",
          merchant: "Local Store",
          receiptImage: uploadedImage,
        },
      }

      const data = mockData[selectedType as keyof typeof mockData] || mockData.general
      setScannedData(data)
      setIsScanning(false)
    }, 2000)
  }

  const handleAcceptData = () => {
    onScanComplete(scannedData)
    handleReset()
    onClose()
  }

  const handleReset = () => {
    setSelectedType(null)
    setIsScanning(false)
    setScannedData(null)
    setUploadedImage(null)
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            AI Receipt Scanner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedType && (
            <>
              <div className="text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  Select the type of receipt you want to scan for better accuracy
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {receiptTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Card
                      key={type.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 hover:border-purple-300"
                      onClick={() => setSelectedType(type.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div
                          className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">{type.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{type.description}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          )}

          {selectedType && !uploadedImage && !isScanning && (
            <>
              <div className="text-center">
                <Badge variant="secondary" className="mb-4">
                  {receiptTypes.find((t) => t.id === selectedType)?.name} Receipt
                </Badge>
                <p className="text-slate-600 dark:text-slate-400">Choose how you want to capture the receipt</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-400">
                      <CardContent className="p-6 text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                        <h3 className="font-medium text-slate-900 dark:text-white">Upload Image</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select from gallery</p>
                      </CardContent>
                    </Card>
                  </label>
                </div>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-purple-400"
                  onClick={handleCameraCapture}
                >
                  <CardContent className="p-6 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                    <h3 className="font-medium text-slate-900 dark:text-white">Take Photo</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Use camera</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {isScanning && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Analyzing Receipt...</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our AI is extracting transaction details from your receipt
              </p>
            </div>
          )}

          {scannedData && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Receipt Scanned Successfully!</h3>
                <p className="text-slate-600 dark:text-slate-400">Review the extracted details below</p>
              </div>

              <Card className="bg-slate-50 dark:bg-slate-800">
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Title</label>
                      <p className="font-semibold text-slate-900 dark:text-white">{scannedData.title}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Amount</label>
                      <p className="font-semibold text-slate-900 dark:text-white">${scannedData.amount}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Date</label>
                      <p className="font-semibold text-slate-900 dark:text-white">{scannedData.date}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Time</label>
                      <p className="font-semibold text-slate-900 dark:text-white">{scannedData.time}</p>
                    </div>
                  </div>

                  {scannedData.merchant && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Merchant</label>
                      <p className="font-semibold text-slate-900 dark:text-white">{scannedData.merchant}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Description</label>
                    <p className="text-slate-900 dark:text-white">{scannedData.description}</p>
                  </div>

                  {scannedData.items && (
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Items</label>
                      <ul className="list-disc list-inside text-slate-900 dark:text-white">
                        {scannedData.items.map((item: string, index: number) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex space-x-3">
                <Button onClick={handleAcceptData} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                  <Check className="w-4 h-4 mr-2" />
                  Accept & Fill Form
                </Button>
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  <X className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {!scannedData && !isScanning && (
            <div className="flex space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              {selectedType && (
                <Button variant="outline" onClick={() => setSelectedType(null)} className="flex-1">
                  Back
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
