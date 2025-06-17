import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { accounts, type Account } from '@/data/dummy-data';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import SearchBar from './search-bar';

interface AccountPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  selectedAccountId?: string;
}

const AccountPicker = ({ isOpen, onClose, onSelect, selectedAccountId }: AccountPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.bank?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (account: Account) => {
    onSelect(account);
    onClose();
  };

  const getBalanceColor = (balance: number) => {
    if (balance >= 0) return 'text-emerald-600 dark:text-emerald-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearchToggle={() => {}}
              placeholder="Search accounts..."
            />
          </div>

          {/* Accounts List */}
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {filteredAccounts.map((account) => (
              <div
                key={account.id}
                className={`flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors ${
                  selectedAccountId === account.id
                    ? 'border border-emerald-200 bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => handleSelect(account)}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: account.bgColor, color: account.color }}
                >
                  <DynamicIcon name={account.icon as IconName} className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate font-medium text-slate-900 dark:text-white">{account.name}</p>
                    <span className={`text-sm font-semibold ${getBalanceColor(account.balance)}`}>
                      ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{account.bank}</p>
                    <p className="text-xs text-slate-400 capitalize dark:text-slate-500">{account.type}</p>
                  </div>
                </div>
                {selectedAccountId === account.id && (
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            ))}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">No accounts found</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 border-t pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountPicker;
