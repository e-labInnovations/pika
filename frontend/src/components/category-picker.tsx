import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import SearchBar from './search-bar';
import type { TransactionType } from '@/lib/transaction-utils';
import { IconRenderer } from './icon-renderer';
import { type Category } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            Select Category - {transactionType.charAt(0).toUpperCase() + transactionType.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearchToggle={() => {}}
              placeholder="Search categories..."
            />
          </div>

          {/* Categories Grid */}
          <div className="max-h-96 space-y-4 overflow-y-auto">
            {searchFilteredCategories.map((parentCategory) => (
              <div key={parentCategory.id} className="space-y-2">
                {/* Parent Category Header */}
                <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center space-x-3">
                    <IconRenderer
                      iconName={parentCategory.icon}
                      size="md"
                      bgColor={parentCategory.bgColor}
                      color={parentCategory.color}
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{parentCategory.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{parentCategory.description}</p>
                    </div>
                  </div>
                </div>

                {/* Child Categories - Always visible */}
                <div className="ml-4 grid grid-cols-2 gap-2">
                  {getFilteredChildren(parentCategory).map((childCategory) => (
                    <div
                      key={childCategory.id}
                      className={`cursor-pointer rounded-lg border p-2 transition-all ${
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
              </div>
            ))}
          </div>

          {searchFilteredCategories.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">No categories found</p>
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

export default CategoryPicker;
