"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AvatarPicker } from "@/components/avatar-picker"
import {
  Settings,
  Tag,
  Folder,
  Wallet,
  Bell,
  Shield,
  User,
  Download,
  Upload,
  Trash2,
  Plus,
  ChevronRight,
} from "lucide-react"
import { IconRenderer } from "@/components/icon-renderer"

interface SettingsPageProps {
  accounts: any[]
  categories: any[]
  people: any[]
  onAddAccount: (account: any) => void
  onEditAccount: (id: string, updates: any) => void
  onDeleteAccount: (id: string) => void
  onAddCategory: (category: any) => void
  onEditCategory: (id: string, updates: any) => void
  onDeleteCategory: (id: string) => void
  onAddPerson: (person: any) => void
  onEditPerson: (id: number, updates: any) => void
  onDeletePerson: (id: number) => void
}

export function SettingsPage({
  accounts,
  categories,
  people,
  onAddAccount,
  onEditAccount,
  onDeleteAccount,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddPerson,
  onEditPerson,
  onDeletePerson,
}: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState<string | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    avatar: { type: "icon", value: "Wallet", color: "bg-emerald-500" },
  })
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    biometric: false,
    autoBackup: true,
  })

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Update the handleAddItem function to actually work
  const handleAddItem = (type: string) => {
    if (!newItem.name.trim()) {
      alert("Name is required")
      return
    }

    switch (type) {
      case "category":
        onAddCategory({
          name: newItem.name,
          icon: newItem.avatar.value || "Wallet",
          color: newItem.avatar.color || "bg-emerald-500",
          type: "expense",
          isSystem: false,
          children: [],
        })
        break
      case "account":
        onAddAccount({
          name: newItem.name,
          icon: newItem.avatar.value || "Wallet",
          color: newItem.avatar.color || "bg-emerald-500",
          balance: 0,
          type: "checking",
          bank: newItem.description || "Unknown Bank",
        })
        break
      case "tag":
        // Tags would need their own state management
        console.log("Add tag:", newItem)
        break
    }

    setShowAddForm(null)
    setNewItem({ name: "", description: "", avatar: { type: "icon", value: "Wallet", color: "bg-emerald-500" } })
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`)
  }

  const handleAvatarSelect = (avatar: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, avatar })
    } else {
      setNewItem({ ...newItem, avatar })
    }
  }

  const settingSections = [
    {
      id: "categories",
      title: "Categories",
      icon: Folder,
      description: "Manage income and expense categories",
    },
    {
      id: "tags",
      title: "Tags",
      icon: Tag,
      description: "Organize transactions with tags",
    },
    {
      id: "accounts",
      title: "Accounts",
      icon: Wallet,
      description: "Manage your bank accounts and wallets",
    },
    {
      id: "general",
      title: "General Settings",
      icon: Settings,
      description: "App preferences and behavior",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      description: "Manage notification preferences",
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: Shield,
      description: "Security settings and data privacy",
    },
    {
      id: "profile",
      title: "Profile",
      icon: User,
      description: "Personal information and preferences",
    },
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case "categories":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Categories</h3>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => setShowAddForm("category")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {/* Add Category Form */}
            {showAddForm === "category" && (
              <Card className="bg-white/50 dark:bg-slate-800/50 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium text-slate-900 dark:text-white">Add New Category</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Category name"
                      />
                    </div>
                    <div>
                      <Label>Avatar</Label>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 ${newItem.avatar.color} rounded-full flex items-center justify-center`}
                        >
                          <IconRenderer iconName={newItem.avatar.value} className="w-4 h-4 text-white" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(null)
                            setShowAvatarPicker(true)
                          }}
                        >
                          Choose Avatar
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddItem("category")}
                        disabled={!newItem.name}
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        Add
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowAddForm(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories List */}
            <div className="space-y-2">
              {categories.map((category) => (
                <Card key={category.id} className="bg-white/50 dark:bg-slate-800/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${category.color} rounded-full flex items-center justify-center`}>
                          <IconRenderer iconName={category.icon} className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{category.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                            onDeleteCategory(category.id)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "accounts":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Accounts</h3>
              <Button
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600"
                onClick={() => setShowAddForm("account")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </div>

            {/* Add Account Form */}
            {showAddForm === "account" && (
              <Card className="bg-white/50 dark:bg-slate-800/50 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-4 space-y-4">
                  <h4 className="font-medium text-slate-900 dark:text-white">Add New Account</h4>
                  <div className="space-y-3">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Account name"
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Account description"
                      />
                    </div>
                    <div>
                      <Label>Avatar</Label>
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 ${newItem.avatar.color} rounded-full flex items-center justify-center`}
                        >
                          <IconRenderer iconName={newItem.avatar.value} className="w-4 h-4 text-white" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(null)
                            setShowAvatarPicker(true)
                          }}
                        >
                          Choose Avatar
                        </Button>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddItem("account")}
                        disabled={!newItem.name}
                        className="bg-emerald-500 hover:bg-emerald-600"
                      >
                        Add
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowAddForm(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {accounts.map((account) => (
                <Card key={account.id} className="bg-white/50 dark:bg-slate-800/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${account.color} rounded-full flex items-center justify-center`}>
                          <IconRenderer iconName={account.icon} className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 dark:text-white">{account.name}</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            ${account.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${account.name}"?`)) {
                            onDeleteAccount(account.id)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "general":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">General Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode" className="text-sm font-medium">
                    Dark Mode
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark themes</p>
                </div>
                <Switch id="dark-mode" checked={settings.darkMode} onCheckedChange={() => toggleSetting("darkMode")} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup" className="text-sm font-medium">
                    Auto Backup
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Automatically backup your data</p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={settings.autoBackup}
                  onCheckedChange={() => toggleSetting("autoBackup")}
                />
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-sm font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Receive notifications for transactions</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={() => toggleSetting("notifications")}
                />
              </div>
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Security & Privacy</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="biometric" className="text-sm font-medium">
                    Biometric Authentication
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Use fingerprint or face ID</p>
                </div>
                <Switch
                  id="biometric"
                  checked={settings.biometric}
                  onCheckedChange={() => toggleSetting("biometric")}
                />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </div>
            </div>
          </div>
        )

      case "profile":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile</h3>
            <div className="space-y-4">
              <Card className="bg-white/50 dark:bg-slate-800/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">🏔️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">Pika User</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">user@example.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (activeSection) {
    return (
      <div className="px-4 py-6 space-y-6">
        <AvatarPicker
          isOpen={showAvatarPicker}
          onClose={() => setShowAvatarPicker(false)}
          onSelect={handleAvatarSelect}
          currentAvatar={editingItem?.avatar || newItem.avatar}
        />
        {renderSectionContent()}
      </div>
    )
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Grid View for Settings Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingSections.map((section) => {
          const Icon = section.icon
          return (
            <Card
              key={section.id}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => setActiveSection(section.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
                  <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-2">{section.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{section.description}</p>
                <ChevronRight className="w-4 h-4 text-slate-400 mx-auto mt-3 group-hover:text-emerald-500 transition-colors" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* App Info */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-2xl">🏔️</span>
          </div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Pika Finance</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Version 1.0.0</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Simple personal finance management</p>
        </CardContent>
      </Card>
    </div>
  )
}
