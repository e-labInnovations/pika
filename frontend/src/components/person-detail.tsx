"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Phone,
  Mail,
  Edit,
  Trash2,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  MessageCircle,
  Share,
  Plus,
} from "lucide-react"

interface PersonDetailProps {
  personId: number
  onBack: () => void
  onEdit: (id: number, updates: any) => void
  onDelete: (id: number) => void
  people: any[]
  transactions: any[]
}

export function PersonDetail({ personId, onBack, onEdit, onDelete, people, transactions }: PersonDetailProps) {
  const person = people.find((p) => p.id === personId)

  if (!person) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-slate-500 dark:text-slate-400">Person not found</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  // Filter transactions for this person
  const personTransactions = transactions.filter((t) => t.person?.id === personId)

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return "text-emerald-600 dark:text-emerald-400"
    if (balance < 0) return "text-red-500 dark:text-red-400"
    return "text-slate-600 dark:text-slate-400"
  }

  const getTransactionIcon = (type: string) => {
    return type === "income" ? (
      <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-500" />
    )
  }

  const getAmountColor = (amount: number, type: string) => {
    if (type === "income") return "text-emerald-600 dark:text-emerald-400"
    if (type === "expense") return "text-red-500 dark:text-red-400"
    return "text-blue-600 dark:text-blue-400"
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Member Header */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
              <AvatarFallback className="bg-emerald-500 text-white font-semibold text-xl">
                {person.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{person.name}</h1>
              <p className="text-slate-600 dark:text-slate-400">{person.description}</p>
              <div className="mt-2">
                <span className={`text-lg font-semibold ${getBalanceColor(person.balance)}`}>
                  {person.balance === 0 ? "All settled up" : `$${Math.abs(person.balance).toFixed(2)}`}
                </span>
                {person.balance !== 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {person.balance > 0 ? "owes you" : "you owe"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
        <Button variant="outline">
          <DollarSign className="w-4 h-4 mr-2" />
          Settle Up
        </Button>
      </div>

      {/* Contact Information */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Contact Information</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">{person.email}</span>
              </div>
              <Button variant="ghost" size="sm">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">{person.phone}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold text-slate-900 dark:text-white">Financial Summary</h3>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{person.transactionCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500 dark:text-red-400">${person.totalSpent.toFixed(2)}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Spent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${person.totalReceived.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Received</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {personTransactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{transaction.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {transaction.date} • {transaction.time} • {transaction.category.name}
                    </p>
                  </div>
                </div>
                <span className={`font-semibold ${getAmountColor(transaction.amount, transaction.type)}`}>
                  {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Actions */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => {
            alert("Edit person functionality would open here")
          }}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Person
        </Button>
        <Button variant="outline" className="flex-1">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Danger Zone */}
      <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
          <Button
            variant="outline"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
            onClick={() => {
              if (confirm(`Are you sure you want to delete "${person.name}"?`)) {
                onDelete(person.id)
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Person
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
