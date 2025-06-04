import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Edit,
  Trash2,
  Share,
  Copy,
  Calendar,
  Clock,
  User,
  Wallet,
  Tag,
  FileText,
  Paperclip,
} from "lucide-react"
import { IconRenderer } from "@/components/icon-renderer"

interface TransactionDetailProps {
  transactionId: number
  onBack: () => void
  onEdit: (id: number, updates: any) => void
  onDelete: (id: number) => void
  transactions: any[]
}

export function TransactionDetail({ transactionId, onBack, onEdit, onDelete, transactions }: TransactionDetailProps) {
  const transaction = transactions.find((t) => t.id === transactionId)

  if (!transaction) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-slate-500 dark:text-slate-400">Transaction not found</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "income":
        return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
      case "expense":
        return <ArrowUpRight className="w-5 h-5 text-red-500" />
      case "transfer":
        return <ArrowRightLeft className="w-5 h-5 text-blue-500" />
      default:
        return null
    }
  }

  const getAmountColor = (amount: number, type: string) => {
    if (type === "income") return "text-emerald-600 dark:text-emerald-400"
    if (type === "expense") return "text-red-500 dark:text-red-400"
    return "text-blue-600 dark:text-blue-400"
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`w-12 h-12 ${transaction.category.color} rounded-full flex items-center justify-center relative`}
          >
            <IconRenderer iconName={transaction.category.icon} className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
              {getTransactionIcon(transaction.type)}
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{transaction.title}</h1>
        <p className={`text-3xl font-bold ${getAmountColor(transaction.amount, transaction.type)}`}>
          {transaction.amount > 0 ? "+" : ""}$
          {Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3">
        <Button
          className="flex-1 bg-emerald-500 hover:bg-emerald-600"
          onClick={() => {
            // In a real app, this would open an edit modal
            alert("Edit functionality would open here")
          }}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" className="flex-1">
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </Button>
        <Button variant="outline" className="flex-1">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4">
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Transaction Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Date</span>
                </div>
                <p className="font-medium text-slate-900 dark:text-white">{transaction.date}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>Time</span>
                </div>
                <p className="font-medium text-slate-900 dark:text-white">{transaction.time}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Tag className="w-4 h-4" />
                <span>Category</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${transaction.category.color} rounded-full flex items-center justify-center`}>
                  <IconRenderer iconName={transaction.category.icon} className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{transaction.category.name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Wallet className="w-4 h-4" />
                <span>Account</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${transaction.account.color} rounded-full flex items-center justify-center`}>
                  <IconRenderer iconName={transaction.account.icon} className="w-3 h-3 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{transaction.account.name}</span>
              </div>
            </div>

            {(transaction.member || transaction.person?.name) && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <User className="w-4 h-4" />
                  <span>Person</span>
                </div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {transaction.member || transaction.person?.name}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {transaction.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description & Notes */}
        {(transaction.description || transaction.note) && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Additional Information</h3>

              {transaction.description && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span>Description</span>
                  </div>
                  <p className="text-slate-900 dark:text-white">{transaction.description}</p>
                </div>
              )}

              {transaction.note && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span>Note</span>
                  </div>
                  <p className="text-slate-900 dark:text-white italic">{transaction.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Attachments */}
        {transaction.attachments && transaction.attachments.length > 0 && (
          <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Paperclip className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Attachments</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {transaction.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    {attachment.type === "image" ? (
                      <div className="space-y-2">
                        <img
                          src={attachment.url || "/placeholder.svg"}
                          alt={attachment.name}
                          className="w-full h-20 object-cover rounded"
                        />
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{attachment.name}</p>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
                          <FileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{attachment.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-red-600 dark:text-red-400 mb-3">Danger Zone</h3>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900"
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${transaction.title}"?`)) {
                  onDelete(transaction.id)
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Transaction
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
