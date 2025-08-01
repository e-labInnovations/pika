import { Drawer, DrawerTitle, DrawerHeader, DrawerContent, DrawerClose, DrawerFooter } from '@/components/ui/drawer';
import { Button, buttonVariants } from '@/components/ui/button';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { X } from 'lucide-react';
import { useState } from 'react';
import SortRadioItem from './sort/sort-radio-item';
import { defaultSort, type Sort, type SortDirection, sortOptions } from './sort/types';
import { cn } from '@/lib/utils';

interface TransactionsSortProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sort: Sort;
  setSort: (sort: Sort) => void;
}

const TransactionsSort = ({ open, setOpen, sort, setSort }: TransactionsSortProps) => {
  const [localSort, setLocalSort] = useState<Sort>(sort);

  const handleSortChange = (value: string) => {
    setLocalSort({
      field: value.split('-')[0],
      direction: value.split('-')[1] as SortDirection,
    });
  };

  const getRadioValue = (field: string, direction: SortDirection) => {
    return `${field}-${direction}`;
  };

  const handleResetSort = () => {
    setLocalSort(defaultSort);
  };

  const handleSubmitSort = () => {
    setSort(localSort);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[75%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="flex w-full items-center gap-2">
            <span className="grow text-left">Sort Transactions</span>
            <Button variant="outline" className="flex-none rounded-full" onClick={handleResetSort}>
              <X /> Reset
            </Button>
          </DrawerTitle>
        </DrawerHeader>

        <RadioGroup.Root
          value={getRadioValue(localSort.field, localSort.direction)}
          onValueChange={handleSortChange}
          className="flex flex-col gap-2 overflow-y-auto px-4"
        >
          {sortOptions.map((option) => (
            <div key={option.value} className="flex flex-col gap-2">
              <h4 className="font-medium text-slate-900 dark:text-white">{option.label}</h4>
              <div className="grid grid-cols-2 gap-4">
                <SortRadioItem
                  key={`${option.value}-asc`}
                  value={getRadioValue(option.value, 'asc')}
                  label={option.ascLabel}
                  type="asc"
                />
                <SortRadioItem
                  key={`${option.value}-desc`}
                  value={getRadioValue(option.value, 'desc')}
                  label={option.descLabel}
                  type="desc"
                />
              </div>
            </div>
          ))}
        </RadioGroup.Root>

        <DrawerFooter className="flex flex-row gap-2">
          <DrawerClose className={cn('w-1/2', buttonVariants({ variant: 'outline' }))}>Cancel</DrawerClose>
          <Button className="w-1/2" onClick={handleSubmitSort}>
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionsSort;
