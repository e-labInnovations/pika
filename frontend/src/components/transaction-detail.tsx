import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import { IconRenderer } from '@/components/icon-renderer';

interface TransactionDetailProps {
  transactionId: number;
  onBack: () => void;
  onEdit: (id: number, updates: any) => void;
  onDelete: (id: number) => void;
  transactions: any[];
}

export function TransactionDetail({ transactionId, onBack, onEdit, onDelete, transactions }: TransactionDetailProps) {
  const transaction = transactions.find((t) => t.id === transactionId);

  if (!transaction) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-slate-500 dark:text-slate-400">Transaction not found</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft className="h-5 w-5 text-emerald-600" />;
      case 'expense':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      case 'transfer':
        return <ArrowRightLeft className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getAmountColor = (amount: number, type: string) => {
    if (type === 'income') return 'text-emerald-600 dark:text-emerald-400';
    if (type === 'expense') return 'text-red-500 dark:text-red-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className="space-y-6 px-4 py-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2">
          <div
            className={`h-12 w-12 ${transaction.category.color} relative flex items-center justify-center rounded-full`}
          >
            <IconRenderer iconName={transaction.category.icon} className="h-6 w-6 text-white" />
            <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-800">
              {getTransactionIcon(transaction.type)}
            </div>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{transaction.title}</h1>
        <p className={`text-3xl font-bold ${getAmountColor(transaction.amount, transaction.type)}`}>
          {transaction.amount > 0 ? '+' : ''}$
          {Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3">
        <Button
          className="flex-1 bg-emerald-500 hover:bg-emerald-600"
          onClick={() => {
            // In a real app, this would open an edit modal
            alert('Edit functionality would open here');
          }}
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" className="flex-1">
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </Button>
        <Button variant="outline" className="flex-1">
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>

      {/* Transaction Details */}
      <div className="space-y-4">
        <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
          <CardContent className="space-y-4 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white">Transaction Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </div>
                <p className="font-medium text-slate-900 dark:text-white">{transaction.date}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span>Time</span>
                </div>
                <p className="font-medium text-slate-900 dark:text-white">{transaction.time}</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Tag className="h-4 w-4" />
                <span>Category</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`h-6 w-6 ${transaction.category.color} flex items-center justify-center rounded-full`}>
                  <IconRenderer iconName={transaction.category.icon} className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{transaction.category.name}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Wallet className="h-4 w-4" />
                <span>Account</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`h-6 w-6 ${transaction.account.color} flex items-center justify-center rounded-full`}>
                  <IconRenderer iconName={transaction.account.icon} className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{transaction.account.name}</span>
              </div>
            </div>

            {(transaction.member || transaction.person?.name) && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <User className="h-4 w-4" />
                  <span>Person</span>
                </div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {transaction.member || transaction.person?.name}
                </p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                <Tag className="h-4 w-4" />
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
          <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="space-y-4 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Additional Information</h3>

              {transaction.description && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span>Description</span>
                  </div>
                  <p className="text-slate-900 dark:text-white">{transaction.description}</p>
                </div>
              )}

              {transaction.note && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <FileText className="h-4 w-4" />
                    <span>Note</span>
                  </div>
                  <p className="text-slate-900 italic dark:text-white">{transaction.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Attachments */}
        {transaction.attachments && transaction.attachments.length > 0 && (
          <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center space-x-2">
                <Paperclip className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Attachments</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {transaction.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="cursor-pointer rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    {attachment.type === 'image' ? (
                      <div className="space-y-2">
                        <img
                          src={attachment.url || '/placeholder.svg'}
                          alt={attachment.name}
                          className="h-20 w-full rounded object-cover"
                        />
                        <p className="truncate text-xs text-slate-600 dark:text-slate-400">{attachment.name}</p>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-red-100 dark:bg-red-900">
                          <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <p className="truncate text-xs text-slate-600 dark:text-slate-400">{attachment.name}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="border-red-200 bg-white/70 backdrop-blur-sm dark:border-red-800 dark:bg-slate-800/70">
          <CardContent className="p-4">
            <h3 className="mb-3 font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900"
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${transaction.title}"?`)) {
                  onDelete(transaction.id);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Transaction
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
