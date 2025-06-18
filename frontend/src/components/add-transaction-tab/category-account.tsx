import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pen, Wallet, X } from 'lucide-react';
import type { TransactionFormData } from './types';
import { useState } from 'react';
import { accounts, categories } from '@/data/dummy-data';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import AccountPicker from '../account-picker';
import CategoryPicker from '../category-picker';

interface CategoryAccountProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData | ((prev: TransactionFormData) => TransactionFormData)) => void;
}

const CategoryAccount = ({ formData, setFormData }: CategoryAccountProps) => {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showToAccountPicker, setShowToAccountPicker] = useState(false);

  const getCategory = (id: string) => {
    for (const category of categories) {
      if (category.children) {
        const childCategory = category.children.find((child) => child.id === id);
        if (childCategory) return childCategory;
      }
    }
    return categories.find((category) => category.id === id);
  };

  const getAccount = (id: string) => {
    return accounts.find((account) => account.id === id);
  };

  return (
    <>
      <Card className="gap-0 p-0">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="flex items-center text-lg">
            <Wallet className="mr-2 h-5 w-5" />
            Category & Account
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <Label>Category *</Label>
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/20">
              <div className="flex items-center space-x-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: getCategory(formData.category)?.bgColor,
                    color: getCategory(formData.category)?.color,
                  }}
                >
                  <DynamicIcon name={getCategory(formData.category)?.icon as IconName} className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {getCategory(formData.category)?.name}
                  </span>
                  <p className="text-sm text-slate-500">{getCategory(formData.category)?.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCategoryPicker(true)}>
                <Pen className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Account *</Label>
            {formData.account ? (
              <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-center space-x-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: getAccount(formData.account)?.bgColor,
                      color: getAccount(formData.account)?.color,
                    }}
                  >
                    <DynamicIcon name={getAccount(formData.account)?.icon as IconName} className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {getAccount(formData.account)?.name}
                    </span>
                    <p className="text-sm text-slate-500">${getAccount(formData.account)?.balance?.toLocaleString()}</p>
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
          {formData.type === 'transfer' && (
            <div className="flex flex-col gap-2">
              <Label>To Account *</Label>
              {formData.toAccount ? (
                <div className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
                  <div className="flex items-center space-x-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: getAccount(formData.toAccount)?.bgColor,
                        color: getAccount(formData.toAccount)?.color,
                      }}
                    >
                      <DynamicIcon
                        name={getAccount(formData.toAccount)?.icon as IconName}
                        className="h-4 w-4 text-white"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {getAccount(formData.toAccount)?.name}
                      </span>
                      <p className="text-sm text-slate-500">
                        ${getAccount(formData.toAccount)?.balance?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData((prev) => ({ ...prev, toAccount: null }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full justify-start"
                  onClick={() => setShowToAccountPicker(true)}
                >
                  Select an account
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <AccountPicker
        isOpen={showAccountPicker}
        onClose={() => setShowAccountPicker(false)}
        onSelect={(account) => setFormData((prev) => ({ ...prev, account: account.id }))}
        selectedAccountId={formData.account?.toString()}
      />
      <AccountPicker
        isOpen={showToAccountPicker}
        onClose={() => setShowToAccountPicker(false)}
        onSelect={(account) => setFormData((prev) => ({ ...prev, toAccount: account.id }))}
        selectedAccountId={formData.toAccount?.toString()}
      />
      <CategoryPicker
        isOpen={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        onSelect={(category) => setFormData((prev) => ({ ...prev, category: category.id }))}
        selectedCategoryId={formData.category}
        transactionType={formData.type}
      />
    </>
  );
};

export default CategoryAccount;
