import { useState } from 'react';
import FilterTabHeader from './filter-tab-header';
import type { Filter } from './types';
import SearchItem from './search-item';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CircleCheck } from 'lucide-react';
import AccountAvatar from '@/components/account-avatar';
import { useLookupStore } from '@/store/useLookupStore';

interface AccountTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const AccountTabContent = ({ filters, setFilters }: AccountTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const accounts = useLookupStore((state) => state.accounts);

  const getFilteredAccounts = () => {
    return accounts.filter((account) => account.name.toLowerCase().includes(searchTerm));
  };

  const handleSelectAllAccounts = () => {
    const allAccountsIds = getFilteredAccounts().map((account) => account.id?.toString() || account.name);
    const allSelected = allAccountsIds.length === filters.accounts.length;
    setFilters((prev) => ({
      ...prev,
      accounts: allSelected ? [] : allAccountsIds,
    }));
  };

  const handleAccountToggle = (accountId: string) => {
    setFilters((prev) => ({
      ...prev,
      accounts: prev.accounts.includes(accountId)
        ? prev.accounts.filter((id) => id !== accountId)
        : [...prev.accounts, accountId],
    }));
  };

  return (
    <div className="flex h-full flex-grow flex-col gap-2">
      <div className="flex flex-col gap-2">
        <FilterTabHeader
          title="Account"
          handleSelectAll={handleSelectAllAccounts}
          isAllSelected={
            filters.accounts.length === getFilteredAccounts().length
              ? true
              : filters.accounts.length > 0
                ? 'indeterminate'
                : false
          }
        />
        <SearchItem searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search person..." />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        {getFilteredAccounts().map((account) => {
          const accountId = account.id?.toString() || account.name;
          return (
            <CheckboxPrimitive.Root
              key={accountId}
              checked={filters.accounts.includes(accountId)}
              onCheckedChange={() => handleAccountToggle(accountId)}
              className="ring-border text-muted-foreground data-[state=checked]:ring-primary data-[state=checked]:text-primary hover:bg-accent/50 relative rounded-lg border border-slate-200 px-4 py-3 text-start ring-[0.25px] data-[state=checked]:ring-[1.5px] dark:border-slate-700"
            >
              <div className="flex items-center space-x-3">
                <AccountAvatar account={account} />
                <div className="flex-1">
                  <p className="font-medium">{account.name}</p>
                  <p className="text-muted-foreground text-sm">{account.description}</p>
                </div>
              </div>
              <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
                <CircleCheck className="fill-primary text-primary-foreground" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          );
        })}
      </div>
    </div>
  );
};

export default AccountTabContent;
