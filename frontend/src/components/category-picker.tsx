"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Plus,
  Check,
  ShoppingCart,
  Coffee,
  Car,
  Briefcase,
  Gift,
  Wallet,
  CreditCard,
  PiggyBank,
} from "lucide-react"

// Mock categories data with parent-child structure
const categoriesData = [
  {
    id: "food",
    name: "Food & Dining",
    icon: ShoppingCart,
    color: "bg-orange-500",
    type: "expense",
    children: [
      { id: "restaurants", name: "Restaurants", icon: ShoppingCart, color: "bg-orange-400", type: "expense" },
      { id: "groceries", name: "Groceries", icon: ShoppingCart, color: "bg-orange-600", type: "expense" },
      { id: "coffee", name: "Coffee Shops", icon: Coffee, color: "bg-amber-500", type: "expense" },
      { id: "fastfood", name: "Fast Food", icon: ShoppingCart, color: "bg-orange-300", type: "expense" },
    ],
  },
  {
    id: "transport",
    name: "Transportation",
    icon: Car,
    color: "bg-blue-500",
    type: "expense",
    children: [
      { id: "gas", name: "Gas", icon: Car, color: "bg-blue-400", type: "expense" },
      { id: "public", name: "Public Transit", icon: Car, color: "bg-blue-600", type: "expense" },
      { id: "parking", name: "Parking", icon: Car, color: "bg-blue-300", type: "expense" },
      { id: "maintenance", name: "Car Maintenance", icon: Car, color: "bg-blue-700", type: "expense" },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: Gift,
    color: "bg-purple-500",
    type: "expense",
    children: [
      { id: "clothing", name: "Clothing", icon: Gift, color: "bg-purple-400", type: "expense" },
      { id: "electronics", name: "Electronics", icon: Gift, color: "bg-purple-600", type: "expense" },
      { id: "books", name: "Books", icon: Gift, color: "bg-purple-300", type: "expense" },
    ],
  },
  {
    id: "income",
    name: "Income",
    icon: Briefcase,
    color: "bg-emerald-500",
    type: "income",
    children: [
      { id: "salary", name: "Salary", icon: Briefcase, color: "bg-emerald-400", type: "income" },
      { id: "freelance", name: "Freelance", icon: Briefcase, color: "bg-emerald-600", type: "income" },
      { id: "bonus", name: "Bonus", icon: Briefcase, color: "bg-emerald-300", type: "income" },
      { id: "investment", name: "Investment", icon: Briefcase, color: "bg-emerald-700", type: "income" },
    ],
  },
  {
    id: "transfer",
    name: "Transfer",
    icon: Wallet,
    color: "bg-gray-500",
    type: "transfer",
    children: [
      { id: "savings", name: "To Savings", icon: PiggyBank, color: "bg-gray-400", type: "transfer" },
      { id: "checking", name: "To Checking", icon: Wallet, color: "bg-gray-600", type: "transfer" },
      { id: "credit", name: "Credit Payment", icon: CreditCard, color: "bg-gray-300", type: "transfer" },
    ],
  },
]

interface CategoryPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (category: any) => void
  transactionType: "income" | "expense" | "transfer"
  selectedCategoryId?: string
}

export function CategoryPicker({
  isOpen,
  onClose,
  onSelect,
  transactionType,
  selectedCategoryId,
}: CategoryPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParent, setSelectedParent] = useState<string | null>(null)

  // Filter categories by transaction type
  const filteredCategories = categoriesData.filter((category) => category.type === transactionType)

  // Filter by search term
  const searchFilteredCategories = filteredCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.children.some((child) => child.name.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCategorySelect = (category: any) => {
    onSelect(category)
    onClose()
  }

  const renderIcon = (IconComponent: any, color: string) => (
    <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}>
      <IconComponent className="w-4 h-4 text-white" />
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Select Category - {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Add New Category Button */}
          <Button
            variant="outline"
            className="w-full justify-start text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            onClick={() => {
              console.log("Add new category")
              onClose()
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
          </Button>

          {/* Categories Grid */}
          <div className="max-h-96 overflow-y-auto space-y-4">
            {searchFilteredCategories.map((parentCategory) => (
              <div key={parentCategory.id} className="space-y-2">
                {/* Parent Category */}
                <div
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedParent === parentCategory.id
                      ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                  onClick={() => setSelectedParent(selectedParent === parentCategory.id ? null : parentCategory.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {renderIcon(parentCategory.icon, parentCategory.color)}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{parentCategory.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {parentCategory.children.length} subcategories
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCategorySelect(parentCategory)
                      }}
                      className={selectedCategoryId === parentCategory.id ? "bg-emerald-100 border-emerald-300" : ""}
                    >
                      {selectedCategoryId === parentCategory.id ? <Check className="w-4 h-4" /> : "Select"}
                    </Button>
                  </div>
                </div>

                {/* Child Categories */}
                {(selectedParent === parentCategory.id || searchTerm) && (
                  <div className="grid grid-cols-2 gap-2 ml-4">
                    {parentCategory.children
                      .filter((child) => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((childCategory) => (
                        <div
                          key={childCategory.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedCategoryId === childCategory.id
                              ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                          }`}
                          onClick={() => handleCategorySelect(childCategory)}
                        >
                          <div className="flex items-center space-x-2">
                            {renderIcon(childCategory.icon, childCategory.color)}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                                {childCategory.name}
                              </p>
                            </div>
                            {selectedCategoryId === childCategory.id && (
                              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {searchFilteredCategories.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No categories found</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
