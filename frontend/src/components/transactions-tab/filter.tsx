import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Banknote, Calculator, Calendar, DollarSign, Folder, Tag, User, X } from 'lucide-react';
import TypesTabContent from './filter/types-tab-content';
import CategoriesTabContent from './filter/categories-tab-content';
import TagsTabContent from './filter/tags-tab-content';
import PeopleTabContent from './filter/people-tab-content';
import DateTabContent from './filter/date-tab-content';
import AmountTabContent from './filter/amount-tab-content';
import { defaultFilterValues, type Filter } from './filter/types';
import { useEffect, useState } from 'react';
import AccountTabContent from './filter/account-tab-content';

const tabs = [
  { id: 'types', label: 'Type', icon: DollarSign, content: TypesTabContent },
  {
    id: 'categories',
    label: 'Categories',
    icon: Folder,
    content: CategoriesTabContent,
  },
  { id: 'tags', label: 'Tags', icon: Tag, content: TagsTabContent },
  { id: 'people', label: 'People', icon: User, content: PeopleTabContent },
  { id: 'date', label: 'Date', icon: Calendar, content: DateTabContent },
  {
    id: 'amount',
    label: 'Amount',
    icon: Calculator,
    content: AmountTabContent,
  },
  {
    id: 'account',
    label: 'Account',
    icon: Banknote,
    content: AccountTabContent,
  },
];

interface TransactionsFilterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
  defaultTab?: string;
}

const TransactionsFilter = ({ open, setOpen, filters, setFilters, defaultTab }: TransactionsFilterProps) => {
  const [localFilters, setLocalFilters] = useState<Filter>(defaultFilterValues);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof Filter];
      return Array.isArray(value) && value.length > 0;
    }).length;
  };

  const handleClearFilters = () => {
    setLocalFilters(defaultFilterValues);
  };

  const handleSubmitFilters = () => {
    setFilters(localFilters);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[75%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="flex w-full gap-2">
            <div className="flex grow items-center gap-2">
              <span>Filter Transactions</span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>
            <Button variant="outline" className="flex-none rounded-full" onClick={handleClearFilters}>
              <X /> Clear
            </Button>
          </DrawerTitle>
        </DrawerHeader>

        <Tabs
          defaultValue={defaultTab ?? tabs[0].id}
          orientation="vertical"
          className="flex flex-grow flex-row gap-2 overflow-hidden px-4"
        >
          <TabsList className="grid h-full w-fit shrink-0 grid-cols-1 divide-y overflow-y-auto border p-0">
            {tabs.map((item) => (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className={cn(
                  'bg-background flex h-full w-14 flex-col rounded-none p-0 first:rounded-t-md last:rounded-b-md',
                  'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-center text-[8px]">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex h-full flex-grow flex-col rounded-lg border p-2">
            {tabs.map((item) => (
              <TabsContent key={item.id} value={item.id} className="flex h-full flex-grow flex-col">
                <item.content filters={localFilters} setFilters={setLocalFilters} />
              </TabsContent>
            ))}
          </div>
        </Tabs>
        <DrawerFooter className="flex flex-row gap-2">
          <DrawerClose className="w-1/2">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
          <Button className="w-1/2" onClick={handleSubmitFilters}>
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionsFilter;
