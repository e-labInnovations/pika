import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import SearchBar from './search-bar';
import AccountAvatar from './account-avatar';
import { type Account } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';

interface AccountPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  selectedAccountId?: string;
  filterAccountId?: string;
}

const AccountPicker = ({ isOpen, onClose, onSelect, selectedAccountId, filterAccountId }: AccountPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const accounts = useLookupStore((state) => state.accounts);

  const filteredAccounts = accounts.filter(
    (account) =>
      (account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterAccountId ? account.id !== filterAccountId : true),
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
                className={`ring-border hover:bg-accent/50 relative rounded-lg border border-slate-200 px-4 py-3 text-start ring-[0.25px] transition-all dark:border-slate-700 ${
                  selectedAccountId === account.id
                    ? 'border-primary ring-primary bg-primary/5 text-primary ring-[1.5px]'
                    : 'text-muted-foreground'
                }`}
                onClick={() => handleSelect(account)}
              >
                <div className="flex items-center space-x-3">
                  <AccountAvatar account={account} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium">{account.name}</p>
                      <span className={`text-sm font-semibold ${getBalanceColor(account.balance)}`}>
                        ${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground truncate text-sm">{account.description}</p>
                    </div>
                  </div>
                </div>
                {selectedAccountId === account.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="fill-primary text-primary-foreground h-5 w-5" />
                  </div>
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
