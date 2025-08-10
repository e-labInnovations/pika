import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import SearchBar from './search-bar';
import AccountAvatar from './account-avatar';
import { type Account } from '@/services/api';
import { useAccounts } from '@/hooks/queries';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';

interface AccountPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (account: Account) => void;
  selectedAccountId?: string;
  filterAccountId?: string;
}

const AccountPicker = ({ isOpen, onClose, onSelect, selectedAccountId, filterAccountId }: AccountPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: accounts = [] } = useAccounts();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { user } = useAuth();

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

  const scrollableContent = (
    <div className="flex h-full flex-grow flex-col gap-2">
      {/* Search */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchToggle={() => {}}
            placeholder="Search accounts..."
          />
        </div>
      </div>

      {/* Accounts List */}
      {filteredAccounts.length !== 0 && (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
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
                    <span className={cn('text-sm font-semibold', getBalanceColor(account.balance))}>
                      {currencyUtils.formatAmount(account.balance, user?.settings?.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground truncate text-sm">{account.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredAccounts.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-slate-500 dark:text-slate-400">No accounts found</p>
        </div>
      )}
    </div>
  );

  const actionButtons = (
    <Button variant="outline" onClick={onClose} className="w-full">
      Cancel
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex h-[80%] flex-col">
          <DialogHeader>
            <DialogTitle>Select Account</DialogTitle>
          </DialogHeader>
          <div className="flex h-full flex-grow flex-col overflow-hidden">{scrollableContent}</div>
          <div className="border-t px-2 pt-4 pb-2">{actionButtons}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[75%]">
        <DrawerHeader>
          <DrawerTitle>Select Account</DrawerTitle>
        </DrawerHeader>
        <div className="flex h-full flex-grow flex-col overflow-hidden px-2">{scrollableContent}</div>
        <DrawerFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AccountPicker;
