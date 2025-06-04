import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Check, Wallet, CreditCard, PiggyBank, Building, Smartphone } from "lucide-react"

// Mock accounts data
const accounts = [
  {
    id: "checking",
    name: "Checking Account",
    icon: Wallet,
    color: "bg-blue-500",
    balance: 2450.5,
    type: "checking",
    bank: "Chase Bank",
  },
  {
    id: "savings",
    name: "Savings Account",
    icon: PiggyBank,
    color: "bg-green-500",
    balance: 8920.0,
    type: "savings",
    bank: "Chase Bank",
  },
  {
    id: "credit",
    name: "Credit Card",
    icon: CreditCard,
    color: "bg-red-500",
    balance: -1250.75,
    type: "credit",
    bank: "American Express",
  },
  {
    id: "business",
    name: "Business Account",
    icon: Building,
    color: "bg-purple-500",
    balance: 5670.25,
    type: "business",
    bank: "Wells Fargo",
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: Smartphone,
    color: "bg-indigo-500",
    balance: 234.5,
    type: "digital",
    bank: "PayPal",
  },
]

interface AccountPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (account: any) => void
  selectedAccountId?: string
}

export function AccountPicker({ isOpen, onClose, onSelect, selectedAccountId }: AccountPickerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (account: any) => {
    onSelect(account)
    onClose()
  }

  const renderIcon = (IconComponent: any, color: string) => (
    <div className={`w-10 h-10 ${color} rounded-full flex items-center justify-center`}>
      <IconComponent className="w-5 h-5 text-white" />
    </div>
  )

  const getBalanceColor = (balance: number) => {
    if (balance >= 0) return "text-emerald-600 dark:text-emerald-400"
    return "text-red-500 dark:text-red-400"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Add New Account Button */}
          <Button
            variant="outline"
            className="w-full justify-start text-emerald-600 border-emerald-200 hover:bg-emerald-50"
            onClick={() => {
              console.log("Add new account")
              onClose()
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Account
          </Button>

          {/* Accounts List */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredAccounts.map((account) => (
              <div
                key={account.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedAccountId === account.id
                    ? "bg-emerald-100 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-800"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={() => handleSelect(account)}
              >
                {renderIcon(account.icon, account.color)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{account.name}</p>
                    <span className={`font-semibold text-sm ${getBalanceColor(account.balance)}`}>
                      ${Math.abs(account.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{account.bank}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{account.type}</p>
                  </div>
                </div>
                {selectedAccountId === account.id && (
                  <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            ))}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No accounts found</p>
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
