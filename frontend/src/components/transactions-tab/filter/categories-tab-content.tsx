import { useState } from "react";
import FilterTabHeader from "./filter-tab-header";
import SearchItem from "./search-item";
import type { Filter } from "./types";
import { categories as categoryHierarchy } from "@/data/dummy-data";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

interface CategoriesTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const CategoriesTabContent = ({
  filters,
  setFilters,
}: CategoriesTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectAllCategories = () => {
    const allCategoryIds = [
      ...categoryHierarchy.map((parent) => parent.id),
      ...categoryHierarchy.flatMap(
        (parent) => parent.children?.map((child) => child.id) ?? []
      ),
    ];
    const allSelected = allCategoryIds.length === filters.categories.length;
    setFilters({
      ...filters,
      categories: allSelected ? [] : allCategoryIds,
    });
  };

  const getFilteredCategories = () => {
    return categoryHierarchy.filter(
      (parent) =>
        parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (parent.children?.some((child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ??
          false)
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev: Filter) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];

      // Handle parent-child logic
      const parent = categoryHierarchy.find((p) => p.id === categoryId);
      const child = categoryHierarchy.find(
        (p) => p.children?.some((c) => c.id === categoryId) ?? false
      );

      if (parent) {
        // If parent is being selected, select all children
        if (!prev.categories.includes(categoryId)) {
          parent.children?.forEach((child) => {
            if (!newCategories.includes(child.id)) {
              newCategories.push(child.id);
            }
          });
        } else {
          // If parent is being deselected, deselect all children
          parent.children?.forEach((child) => {
            const index = newCategories.indexOf(child.id);
            if (index > -1) {
              newCategories.splice(index, 1);
            }
          });
        }
      } else if (child) {
        // If child is being selected/deselected, check if all siblings are selected
        const allChildrenSelected = child.children?.every((sibling) =>
          sibling.id === categoryId
            ? !prev.categories.includes(categoryId)
            : newCategories.includes(sibling.id)
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
    <div className="space-y-3 flex-1 flex flex-col h-full">
      <FilterTabHeader
        title="Categories"
        handleSelectAll={handleSelectAllCategories}
        isAllSelected={
          filters.categories.length ===
          categoryHierarchy.length +
            categoryHierarchy.flatMap((p) => p.children).length
            ? true
            : filters.categories.length > 0
            ? "indeterminate"
            : false
        }
      />

      {/* Search within categories */}
      <SearchItem
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search categories..."
      />

      <div className="space-y-4">
        {getFilteredCategories().map((parent) => (
          <div key={parent.id} className="space-y-2">
            {/* Parent Category */}
            <div
              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                filters.categories.includes(parent.id)
                  ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => handleCategoryToggle(parent.id)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center`}
                style={{
                  backgroundColor: parent.bgColor,
                  color: parent.color,
                }}
              >
                <DynamicIcon
                  name={parent.icon as IconName}
                  className="w-4 h-4 text-white"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {parent.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {parent.children?.length} subcategories
                </p>
              </div>
            </div>

            {/* Child Categories */}
            <div className="ml-6 space-y-2">
              {parent.children
                ?.filter((child) =>
                  child.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((child) => (
                  <div
                    key={child.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-all ${
                      filters.categories.includes(child.id)
                        ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => handleCategoryToggle(child.id)}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: child.bgColor,
                        color: child.color,
                      }}
                    >
                      <DynamicIcon
                        name={child.icon as IconName}
                        className="w-3 h-3 text-white"
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {child.name}
                    </p>
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
