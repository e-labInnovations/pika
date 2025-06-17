import type React from 'react';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Coffee,
  Car,
  Briefcase,
  Gift,
  Wallet,
  CreditCard,
  PiggyBank,
  DollarSign,
  Tag,
  User,
  FileText,
  Calendar,
  Clock,
  X,
  Sparkles,
  Calculator,
  Paperclip,
  Upload,
  File,
} from 'lucide-react';

// Import the new picker components
import PeoplePicker from '@/components/people-picker';
import CategoryPicker from '@/components/category-picker';
import AccountPicker from '@/components/account-picker';
import { ReceiptScanner } from '@/components/receipt-scanner';

// Mock data
const categories = [
  { id: 'food', name: 'Food & Dining', icon: ShoppingCart, type: 'expense' },
  { id: 'coffee', name: 'Coffee & Drinks', icon: Coffee, type: 'expense' },
  { id: 'transport', name: 'Transportation', icon: Car, type: 'expense' },
  { id: 'salary', name: 'Salary', icon: Briefcase, type: 'income' },
  { id: 'gifts', name: 'Gifts', icon: Gift, type: 'expense' },
];

const accounts = [
  { id: 'checking', name: 'Checking Account', icon: Wallet, balance: 2450.5 },
  { id: 'savings', name: 'Savings Account', icon: PiggyBank, balance: 8920.0 },
  { id: 'credit', name: 'Credit Card', icon: CreditCard, balance: -1250.75 },
];

const allTags = [
  { id: 'essential', name: 'Essential' },
  { id: 'social', name: 'Social' },
  { id: 'work', name: 'Work' },
  { id: 'personal', name: 'Personal' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'health', name: 'Health' },
  { id: 'travel', name: 'Travel' },
];

const members = [
  { id: 'sarah', name: 'Sarah' },
  { id: 'john', name: 'John' },
  { id: 'mom', name: 'Mom' },
  { id: 'dad', name: 'Dad' },
];

// Add this custom keyboard component before the main component
const CustomKeyboard = ({
  onInput,
  onDelete,
  onSubmit,
  onClose,
}: {
  onInput: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onClose: () => void;
}) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', '⌫'],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50">
      <div className="w-full space-y-4 rounded-t-2xl bg-white p-4 dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white">Enter Amount</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {keys.flat().map((key, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-12 text-lg font-semibold"
              onClick={() => {
                if (key === '⌫') {
                  onDelete();
                } else {
                  onInput(key);
                }
              }}
            >
              {key}
            </Button>
          ))}
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={onSubmit} className="flex-1 bg-emerald-500 hover:bg-emerald-600">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

// Update the main component interface
interface AddTransactionProps {
  onSubmit: (transaction: any) => void;
  people: any[];
  accounts: any[];
  categories: any[];
}

export function AddTransaction({ onSubmit, people, accounts, categories }: AddTransactionProps) {
  // Add state for the pickers
  const [showPeoplePicker, setShowPeoplePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showReceiptScanner, setShowReceiptScanner] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  // Add state for custom keyboard
  const [showCustomKeyboard, setShowCustomKeyboard] = useState(false);
  const [keyboardAmount, setKeyboardAmount] = useState('');

  // Add state for attachments
  const [attachments, setAttachments] = useState<
    Array<{
      id: string;
      name: string;
      type: 'image' | 'pdf';
      url: string;
      size: number;
    }>
  >([]);

  // Update the formData to include selected objects instead of just IDs
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    category: null as any,
    account: null as any,
    tags: [] as string[],
    person: null as any,
    description: '',
  });

  // Update the handleSubmit function
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.description.trim()) {
      alert('Description is required');
      return;
    }

    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    if (!formData.account) {
      alert('Please select an account');
      return;
    }

    // Submit the transaction
    onSubmit({
      title: formData.title,
      amount: formData.type === 'expense' ? -Number.parseFloat(formData.amount) : Number.parseFloat(formData.amount),
      date: formData.date,
      time: formData.time,
      type: formData.type,
      category: formData.category,
      account: formData.account,
      tags: formData.tags,
      person: formData.person,
      description: formData.description,
      attachments: attachments,
    });

    // Reset form
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      category: null as any,
      account: null as any,
      tags: [],
      person: null as any,
      description: '',
    });
    setAttachments([]);

    alert('Transaction added successfully!');
  };

  // Add keyboard handlers
  const handleKeyboardInput = (value: string) => {
    if (value === '.' && keyboardAmount.includes('.')) return;
    setKeyboardAmount((prev) => prev + value);
  };

  const handleKeyboardDelete = () => {
    setKeyboardAmount((prev) => prev.slice(0, -1));
  };

  const handleKeyboardSubmit = () => {
    setFormData((prev) => ({ ...prev, amount: keyboardAmount }));
    setShowCustomKeyboard(false);
    setKeyboardAmount('');
  };

  const addTag = (tagName: string) => {
    if (tagName.trim() && !formData.tags.includes(tagName.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagName.trim()],
      }));
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const filteredTagSuggestions = allTags.filter(
    (tag) => tag.name.toLowerCase().includes(tagInput.toLowerCase()) && !formData.tags.includes(tag.name),
  );

  const handleReceiptScan = (scannedData: any) => {
    setFormData((prev) => ({
      ...prev,
      title: scannedData.title || prev.title,
      amount: scannedData.amount || prev.amount,
      date: scannedData.date || prev.date,
      time: scannedData.time || prev.time,
      description: scannedData.description || prev.description,
    }));

    // Auto-attach receipt image if available
    if (scannedData.receiptImage) {
      const newAttachment = {
        id: Math.random().toString(36).substr(2, 9),
        name: 'Receipt Image',
        type: 'image' as const,
        url: scannedData.receiptImage,
        size: 0, // Size would be calculated in real implementation
      };
      setAttachments((prev) => [...prev, newAttachment]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type.startsWith('image/') ? ('image' as const) : ('pdf' as const),
          url: result,
          size: file.size,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    event.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredCategories = categories.filter((cat) => cat.type === formData.type);

  // Dynamic form fields based on transaction type
  const getFormFields = () => {
    const baseFields = (
      <>
        {/* Basic Information */}
        <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <DollarSign className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter transaction title"
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="text"
                  value={formData.amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                  onFocus={() => {
                    setKeyboardAmount(formData.amount);
                    setShowCustomKeyboard(true);
                  }}
                  placeholder="0.00"
                  className="py-3 pr-12 text-2xl font-bold"
                  required
                  readOnly
                />
                <span className="absolute top-1/2 left-3 -translate-y-1/2 transform text-2xl font-bold text-slate-400">
                  $
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1/2 right-2 -translate-y-1/2 transform"
                  onClick={() => {
                    setKeyboardAmount(formData.amount);
                    setShowCustomKeyboard(true);
                  }}
                >
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tap to use custom keyboard</p>
            </div>

            {/* Enhanced Date Time Picker */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Date *
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  className="text-center"
                  required
                />
              </div>
              <div>
                <Label htmlFor="time" className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  Time *
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  className="text-center"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Account */}
        <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Tag className="mr-2 h-5 w-5" />
              Category & Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Category *</Label>
              {formData.category ? (
                <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-8 w-8 ${formData.category.color || 'bg-emerald-500'} flex items-center justify-center rounded-full`}
                    >
                      <formData.category.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{formData.category.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, category: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full justify-start"
                  onClick={() => setShowCategoryPicker(true)}
                >
                  Select a category
                </Button>
              )}
            </div>

            <div>
              <Label>Account *</Label>
              {formData.account ? (
                <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-8 w-8 ${formData.account.color || 'bg-blue-500'} flex items-center justify-center rounded-full`}
                    >
                      <formData.account.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">{formData.account.name}</span>
                      <p className="text-sm text-slate-500">${formData.account.balance?.toLocaleString()}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setFormData((prev) => ({ ...prev, account: null }))}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full justify-start"
                  onClick={() => setShowAccountPicker(true)}
                >
                  Select an account
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </>
    );

    // Person field only for income and expense, not transfer
    const personField = formData.type !== 'transfer' && (
      <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <User className="mr-2 h-5 w-5" />
            Person (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.person ? (
            <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{formData.person.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFormData((prev) => ({ ...prev, person: null }))}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start"
              onClick={() => setShowPeoplePicker(true)}
            >
              Select a person
            </Button>
          )}
        </CardContent>
      </Card>
    );

    return (
      <>
        {baseFields}
        {personField}
      </>
    );
  };

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex items-center justify-between">
        {/* AI Receipt Scanner Button */}
        <Button
          variant="outline"
          onClick={() => setShowReceiptScanner(true)}
          className="border-none bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Scan Receipt
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
          <CardHeader>
            <CardTitle className="text-lg">Transaction Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {['income', 'expense', 'transfer'].map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={formData.type === type ? 'default' : 'outline'}
                  className={`capitalize ${
                    formData.type === type
                      ? type === 'income'
                        ? 'bg-emerald-500 hover:bg-emerald-600'
                        : type === 'expense'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      : ''
                  }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      type,
                      category: null,
                      person: type === 'transfer' ? null : prev.person,
                    }))
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Form Fields */}
        {getFormFields()}

        {/* Attachments */}
        <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Paperclip className="mr-2 h-5 w-5" />
              Attachments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Button */}
            <div>
              <input
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full justify-start border-2 border-dashed hover:bg-slate-50 dark:hover:bg-slate-800"
                  asChild
                >
                  <div>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Images or PDFs
                  </div>
                </Button>
              </label>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Support for multiple images and PDF files
              </p>
            </div>

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white">Attached Files ({attachments.length})</h4>
                <div className="grid grid-cols-2 gap-3">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="relative rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500 hover:bg-red-100 hover:text-red-700"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>

                      {attachment.type === 'image' ? (
                        <div className="space-y-2">
                          <img
                            src={attachment.url || '/placeholder.svg'}
                            alt={attachment.name}
                            className="h-20 w-full rounded object-cover"
                          />
                          <div className="space-y-1">
                            <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                              {attachment.name}
                            </p>
                            {attachment.size > 0 && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatFileSize(attachment.size)}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded bg-red-100 dark:bg-red-900">
                            <File className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-slate-900 dark:text-white">
                              {attachment.name}
                            </p>
                            {attachment.size > 0 && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {formatFileSize(attachment.size)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Tags Input */}
        <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Tags */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                  >
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-emerald-600 hover:text-emerald-800"
                      onClick={() => removeTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Tag Input */}
            <div className="relative">
              <Input
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => {
                  setTagInput(e.target.value);
                  setShowTagSuggestions(e.target.value.length > 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                onFocus={() => setShowTagSuggestions(tagInput.length > 0)}
              />

              {/* Tag Suggestions */}
              {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                <div className="absolute top-full right-0 left-0 z-10 mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                  {filteredTagSuggestions.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      className="w-full px-3 py-2 text-left text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
                      onClick={() => addTag(tag.name)}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description (Required) */}
        <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 h-5 w-5" />
              Description *
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description for this transaction..."
              rows={3}
              required
              className="resize-none"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Description is required to help you remember this transaction
            </p>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex space-x-3">
          <Button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600">
            Save Transaction
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </form>

      {/* Modals */}
      <PeoplePicker
        isOpen={showPeoplePicker}
        onClose={() => setShowPeoplePicker(false)}
        onSelect={(person) => setFormData((prev) => ({ ...prev, person }))}
        selectedPersonId={formData.person?.id?.toString()}
      />

      <CategoryPicker
        isOpen={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelect={(category) => setFormData((prev) => ({ ...prev, category }))}
        transactionType={formData.type as 'income' | 'expense' | 'transfer'}
        selectedCategoryId={formData.category?.id}
      />

      <AccountPicker
        isOpen={showAccountPicker}
        onClose={() => setShowAccountPicker(false)}
        onSelect={(account) => setFormData((prev) => ({ ...prev, account }))}
        selectedAccountId={formData.account?.id}
      />

      <ReceiptScanner
        isOpen={showReceiptScanner}
        onClose={() => setShowReceiptScanner(false)}
        onScanComplete={handleReceiptScan}
      />

      {/* Add the custom keyboard at the end of the component */}
      {showCustomKeyboard && (
        <CustomKeyboard
          onInput={handleKeyboardInput}
          onDelete={handleKeyboardDelete}
          onSubmit={handleKeyboardSubmit}
          onClose={() => {
            setShowCustomKeyboard(false);
            setKeyboardAmount('');
          }}
        />
      )}
    </div>
  );
}
