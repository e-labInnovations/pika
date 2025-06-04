"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Wallet,
  CreditCard,
  PiggyBank,
  ShoppingCart,
  Coffee,
  Car,
  Briefcase,
  Gift,
  Home,
  Plane,
  Heart,
  Star,
  Music,
  Camera,
  Book,
  Gamepad2,
  Dumbbell,
  Pizza,
  Smartphone,
  Laptop,
  Upload,
  User,
  Users,
  Building,
  MapPin,
  Calendar,
  Clock,
  Mail,
  Phone,
  Globe,
  Zap,
  Flame,
  Droplets,
  Sun,
  Moon,
  Cloud,
  Umbrella,
  TreePine,
  Flower,
  Leaf,
  Apple,
  Grape,
  Cherry,
  Banana,
} from "lucide-react"

const iconCategories = {
  Finance: [Wallet, CreditCard, PiggyBank, Briefcase, Building],
  Shopping: [ShoppingCart, Gift, Pizza, Apple, Grape],
  Transport: [Car, Plane, MapPin],
  Food: [Coffee, Pizza, Apple, Cherry, Banana],
  Lifestyle: [Home, Heart, Star, Music, Camera],
  Tech: [Smartphone, Laptop, Gamepad2, Globe, Zap],
  Health: [Dumbbell, Heart, Sun, Droplets],
  Nature: [TreePine, Flower, Leaf, Cloud, Umbrella],
  People: [User, Users, Mail, Phone],
  Time: [Calendar, Clock, Sun, Moon],
  Other: [Book, Flame, Star, Gift],
}

interface AvatarPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (avatar: { type: "icon" | "upload"; value: string; color?: string }) => void
  currentAvatar?: { type: "icon" | "upload"; value: string; color?: string }
}

const colors = [
  "bg-red-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500",
  "bg-slate-500",
]

export function AvatarPicker({ isOpen, onClose, onSelect, currentAvatar }: AvatarPickerProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>(currentAvatar?.value || "")
  const [selectedColor, setSelectedColor] = useState<string>(currentAvatar?.color || "bg-emerald-500")
  const [activeTab, setActiveTab] = useState<"icons" | "upload">("icons")

  const handleIconSelect = (iconName: string) => {
    setSelectedIcon(iconName)
  }

  const handleConfirm = () => {
    if (activeTab === "icons" && selectedIcon) {
      onSelect({
        type: "icon",
        value: selectedIcon,
        color: selectedColor,
      })
    }
    onClose()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onSelect({
          type: "upload",
          value: result,
        })
        onClose()
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Choose Avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Tab Selection */}
          <div className="flex space-x-2">
            <Button
              variant={activeTab === "icons" ? "default" : "outline"}
              onClick={() => setActiveTab("icons")}
              className="flex-1"
            >
              Icons
            </Button>
            <Button
              variant={activeTab === "upload" ? "default" : "outline"}
              onClick={() => setActiveTab("upload")}
              className="flex-1"
            >
              Upload Image
            </Button>
          </div>

          {activeTab === "icons" ? (
            <div className="space-y-4">
              {/* Color Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Background Color</Label>
                <div className="grid grid-cols-9 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${color} border-2 ${
                        selectedColor === color ? "border-slate-900 dark:border-white" : "border-transparent"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div className="max-h-96 overflow-y-auto space-y-4">
                {Object.entries(iconCategories).map(([category, icons]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{category}</h4>
                    <div className="grid grid-cols-8 gap-2">
                      {icons.map((Icon, index) => {
                        const iconName = `${category}-${index}`
                        return (
                          <button
                            key={iconName}
                            className={`w-10 h-10 ${selectedColor} rounded-full flex items-center justify-center border-2 ${
                              selectedIcon === iconName
                                ? "border-slate-900 dark:border-white"
                                : "border-transparent hover:border-slate-300"
                            } transition-colors`}
                            onClick={() => handleIconSelect(iconName)}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="avatar-upload" className="text-sm font-medium">
                  Upload Image
                </Label>
                <div className="mt-2 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Choose an image file to upload</p>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={activeTab === "icons" && !selectedIcon}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
