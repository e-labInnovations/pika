import { useState } from 'react';
import FilterTabHeader from './filter-tab-header';
import SearchItem from './search-item';
import type { Filter } from './types';
import { IconRenderer } from '@/components/icon-renderer';
import { useCategories } from '@/hooks/queries';
import type { Category } from '@/services/api';

interface CategoriesTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const CategoriesTabContent = ({ filters, setFilters }: CategoriesTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: categories = [] } = useCategories();

  const handleSelectAllCategories = () => {
    const allCategoryIds = [
      ...categories.map((parent) => parent.id),
      ...categories.flatMap((parent) => parent.children?.map((child) => child.id) ?? []),
    ];
    const allSelected = allCategoryIds.length === filters.categories.length;
    setFilters({
      ...filters,
      categories: allSelected ? [] : allCategoryIds,
    });
  };

  const getFilteredCategories = (_categories: Category[] = categories) => {
    return _categories.filter(
      (parent) =>
        parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (parent.children?.some((child) => child.name.toLowerCase().includes(searchTerm.toLowerCase())) ?? false),
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev: Filter) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];

      // Handle parent-child logic
      const parent = categories.find((p) => p.id === categoryId);
      const child = categories.find((p) => p.children?.some((c) => c.id === categoryId) ?? false);

      if (parent) {
        // If parent is being selected, select all children
        if (!prev.categories.includes(categoryId)) {
          getFilteredCategories(parent.children ?? []).forEach((child) => {
            // parent.children?.forEach((child) => {
            if (!newCategories.includes(child.id)) {
              newCategories.push(child.id);
            }
          });
        } else {
          // If parent is being deselected, deselect all children
          getFilteredCategories(parent.children ?? []).forEach((child) => {
            // parent.children?.forEach((child) => {
            const index = newCategories.indexOf(child.id);
            if (index > -1) {
              newCategories.splice(index, 1);
            }
          });
        }
      } else if (child) {
        // If child is being selected/deselected, check if all siblings are selected
        const allChildrenSelected = child.children?.every((sibling) =>
          sibling.id === categoryId ? !prev.categories.includes(categoryId) : newCategories.includes(sibling.id),
        );

        if (allChildrenSelected && !newCategories.includes(child.id)) {
          // If all children are selected, select parent
          newCategories.push(child.id);
        } else if (!allChildrenSelected && newCategories.includes(child.id)) {
          // If not all children are selected, deselect parent
          const parentIndex = newCategories.indexOf(child.id);
          if (parentIndex > -1) {
            newCategories.splice(parentIndex, 1);
          }
        }
      }

      return { ...prev, categories: newCategories };
    });
  };

  return (
    <div className="flex h-full flex-grow flex-col gap-2">
      <div className="flex flex-col gap-2">
        <FilterTabHeader
          title="Categories"
          handleSelectAll={handleSelectAllCategories}
          isAllSelected={
            filters.categories.length === categories.length + categories.flatMap((p) => p.children).length
              ? true
              : filters.categories.length > 0
                ? 'indeterminate'
                : false
          }
        />

        <SearchItem searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search categories..." />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        {getFilteredCategories().map((parent) => (
          <div key={parent.id} className="flex flex-col gap-2">
            {/* Parent Category */}
            <div
              className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-3 transition-all ${
                filters.categories.includes(parent.id)
                  ? 'border-primary bg-primary/10'
                  : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
              }`}
              onClick={() => handleCategoryToggle(parent.id)}
            >
              <IconRenderer iconName={parent.icon} bgColor={parent.bgColor} color={parent.color} />
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">{parent.name}</p>
                <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{parent.description}</p>
              </div>
            </div>

            {/* Child Categories */}
            <div className="ml-6 flex flex-col gap-2">
              {parent.children
                ?.filter((child) => child.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((child) => (
                  <div
                    key={child.id}
                    className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-2 transition-all ${
                      filters.categories.includes(child.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => handleCategoryToggle(child.id)}
                  >
                    <IconRenderer iconName={child.icon} size="sm" bgColor={child.bgColor} color={child.color} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{child.name}</p>
                      <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{child.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTabContent;
