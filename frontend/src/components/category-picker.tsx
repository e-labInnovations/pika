import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import SearchBar from './search-bar';
import type { TransactionType } from '@/lib/transaction-utils';
import { IconRenderer } from './icon-renderer';
import { type Category } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

interface CategoryPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (category: Category) => void;
  transactionType: TransactionType;
  selectedCategoryId?: string;
}

const CategoryPicker = ({ isOpen, onClose, onSelect, transactionType, selectedCategoryId }: CategoryPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const categories = useLookupStore((state) => state.categories);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const filteredCategories = categories.filter((category) => category.type === transactionType);

  const searchFilteredCategories = filteredCategories.filter((category) => {
    const parentMatches = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const childMatches = category.children?.some((child) =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return parentMatches || childMatches;
  });

  const handleCategorySelect = (category: Category) => {
    if (!category.isParent) {
      onSelect(category);
      onClose();
    }
  };

  const getFilteredChildren = (parentCategory: Category) => {
    const parentMatches = parentCategory.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (parentMatches) {
      return parentCategory.children || [];
    }
    return (parentCategory.children || []).filter((child) =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  };

  const title = `Select Category - ${transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}`;

  const scrollableContent = (
    <div className="flex h-full flex-grow flex-col gap-2">
      {/* Search */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchToggle={() => {}}
            placeholder="Search categories..."
          />
        </div>
      </div>

      {/* Categories Grid */}
      {searchFilteredCategories.length !== 0 && (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {searchFilteredCategories.map((parentCategory) => (
            <Card key={parentCategory.id} className="p-0">
              <CardContent className="flex flex-col gap-2 p-2">
                {/* Parent Category Header */}
                <div className="flex items-center space-x-3">
                  <IconRenderer
                    iconName={parentCategory.icon}
                    bgColor={parentCategory.bgColor}
                    color={parentCategory.color}
                  />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{parentCategory.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{parentCategory.description}</p>
                  </div>
                </div>

                <Separator />

                {/* Child Categories - Always visible */}
                <div className="grid grid-cols-2 gap-2">
                  {getFilteredChildren(parentCategory).map((childCategory) => (
                    <div
                      key={childCategory.id}
                      className={`flex cursor-pointer flex-col justify-center rounded-lg border p-2 transition-all ${
                        selectedCategoryId === childCategory.id
                          ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-900'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                      }`}
                      onClick={() => handleCategorySelect(childCategory)}
                    >
                      <div className="flex items-center space-x-2">
                        <IconRenderer
                          iconName={childCategory.icon}
                          bgColor={childCategory.bgColor}
                          color={childCategory.color}
                          size="sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                            {childCategory.name}
                          </p>
                          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                            {childCategory.description}
                          </p>
                        </div>
                        {selectedCategoryId === childCategory.id && (
                          <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchFilteredCategories.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-slate-500 dark:text-slate-400">No categories found</p>
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
            <DialogTitle>{title}</DialogTitle>
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
          <DrawerTitle>{title}</DrawerTitle>
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

export default CategoryPicker;
