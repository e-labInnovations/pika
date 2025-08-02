import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pen, Wallet } from 'lucide-react';
import type { TransactionFormData } from './types';
import { useEffect, useState } from 'react';
import AccountPicker from '../account-picker';
import CategoryPicker from '../category-picker';
import { IconRenderer } from '../icon-renderer';
import { type Account, type Category } from '@/services/api';
import SelectedAccount from '../selected-account';
import { storeUtils } from '@/store/useLookupStore';

interface CategoryAccountProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData | ((prev: TransactionFormData) => TransactionFormData)) => void;
}

const CategoryAccount = ({ formData, setFormData }: CategoryAccountProps) => {
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showToAccountPicker, setShowToAccountPicker] = useState(false);
  const [category, setCategory] = useState<Category | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [toAccount, setToAccount] = useState<Account | null>(null);

  useEffect(() => {
    if (formData.category) {
      const _category = storeUtils.getCategoryById(formData.category);

      setCategory(_category ?? null);
      setFormData((prev) => ({ ...prev, category: _category?.id ?? '' }));
    } else {
      setCategory(null);
    }

    if (formData.account) {
      const _account = storeUtils.getAccountById(formData.account);
      setAccount(_account ?? null);
      setFormData((prev) => ({ ...prev, account: _account?.id ?? '' }));
    } else {
      setAccount(null);
    }

    if (formData.toAccount) {
      const _toAccount = storeUtils.getAccountById(formData.toAccount);
      setToAccount(_toAccount ?? null);
      setFormData((prev) => ({ ...prev, toAccount: _toAccount?.id ?? null }));
      if (formData.account === formData.toAccount) {
        setFormData((prev) => ({ ...prev, toAccount: null }));
        setToAccount(null);
      }
    } else {
      setToAccount(null);
    }
  }, [formData.category, formData.account, formData.toAccount]);

  const isTransfer = formData.type === 'transfer';

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
                <IconRenderer iconName={category?.icon} bgColor={category?.bgColor} color={category?.color} />
                <div>
                  <span className="font-medium text-slate-900 dark:text-white">{category?.name}</span>
                  <p className="text-sm text-slate-500">{category?.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowCategoryPicker(true)}>
                <Pen className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Account*</Label>
            {account ? (
              <SelectedAccount account={account} onEdit={() => setShowAccountPicker(true)} />
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
          {isTransfer && (
            <div className="flex flex-col gap-2">
              <Label>To Account *</Label>
              {formData.toAccount && toAccount ? (
                <SelectedAccount
                  account={toAccount}
                  onEdit={() => setShowToAccountPicker(true)}
                  className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20"
                />
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
        filterAccountId={isTransfer ? formData.toAccount?.toString() : undefined}
      />
      <AccountPicker
        isOpen={showToAccountPicker}
        onClose={() => setShowToAccountPicker(false)}
        onSelect={(account) => setFormData((prev) => ({ ...prev, toAccount: account.id }))}
        selectedAccountId={formData.toAccount?.toString()}
        filterAccountId={isTransfer ? formData.account?.toString() : undefined}
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
