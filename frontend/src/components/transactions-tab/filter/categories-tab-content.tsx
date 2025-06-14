import { IconRenderer } from "@/components/icon-renderer";
import { useState } from "react";
import FilterTabHeader from "./filter-tab-header";
import SearchItem from "./search-item";
import type { Filter } from "./types";

// Mock parent categories with children (in a real app, this would come from props)
const categoryHierarchy = [
  {
    id: "food",
    name: "Food & Dining",
    icon: "ShoppingCart",
    color: "bg-orange-500",
    children: [
      {
        id: "restaurants",
        name: "Restaurants",
        icon: "ShoppingCart",
        color: "bg-orange-400",
      },
      {
        id: "groceries",
        name: "Groceries",
        icon: "ShoppingCart",
        color: "bg-orange-600",
      },
      {
        id: "coffee",
        name: "Coffee Shops",
        icon: "Coffee",
        color: "bg-amber-500",
      },
      {
        id: "fastfood",
        name: "Fast Food",
        icon: "ShoppingCart",
        color: "bg-orange-300",
      },
    ],
  },
  {
    id: "transport",
    name: "Transportation",
    icon: "Car",
    color: "bg-blue-500",
    children: [
      { id: "gas", name: "Gas", icon: "Car", color: "bg-blue-400" },
      {
        id: "public",
        name: "Public Transit",
        icon: "Car",
        color: "bg-blue-600",
      },
      { id: "parking", name: "Parking", icon: "Car", color: "bg-blue-300" },
      {
        id: "maintenance",
        name: "Car Maintenance",
        icon: "Car",
        color: "bg-blue-700",
      },
    ],
  },
  {
    id: "shopping",
    name: "Shopping",
    icon: "Gift",
    color: "bg-purple-500",
    children: [
      {
        id: "clothing",
        name: "Clothing",
        icon: "Gift",
        color: "bg-purple-400",
      },
      {
        id: "electronics",
        name: "Electronics",
        icon: "Gift",
        color: "bg-purple-600",
      },
      { id: "books", name: "Books", icon: "Gift", color: "bg-purple-300" },
    ],
  },
  {
    id: "income",
    name: "Income",
    icon: "Briefcase",
    color: "bg-emerald-500",
    children: [
      {
        id: "salary",
        name: "Salary",
        icon: "Briefcase",
        color: "bg-emerald-400",
      },
      {
        id: "freelance",
        name: "Freelance",
        icon: "Briefcase",
        color: "bg-emerald-600",
      },
      {
        id: "bonus",
        name: "Bonus",
        icon: "Briefcase",
        color: "bg-emerald-300",
      },
      {
        id: "investment",
        name: "Investment",
        icon: "Briefcase",
        color: "bg-emerald-700",
      },
    ],
  },
];

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
      ...categoryHierarchy.flatMap((parent) =>
        parent.children.map((child) => child.id)
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
        parent.children.some((child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFilters((prev: Filter) => {
      const newCategories = prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId];

      // Handle parent-child logic
      const parent = categoryHierarchy.find((p) => p.id === categoryId);
      const child = categoryHierarchy.find((p) =>
        p.children.some((c) => c.id === categoryId)
      );

      if (parent) {
        // If parent is being selected, select all children
        if (!prev.categories.includes(categoryId)) {
          parent.children.forEach((child) => {
            if (!newCategories.includes(child.id)) {
              newCategories.push(child.id);
            }
          });
        } else {
          // If parent is being deselected, deselect all children
          parent.children.forEach((child) => {
            const index = newCategories.indexOf(child.id);
            if (index > -1) {
              newCategories.splice(index, 1);
            }
          });
        }
      } else if (child) {
        // If child is being selected/deselected, check if all siblings are selected
        const allChildrenSelected = child.children.every((sibling) =>
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
                className={`w-8 h-8 ${parent.color} rounded-full flex items-center justify-center`}
              >
                <IconRenderer
                  iconName={parent.icon}
                  className="w-4 h-4 text-white"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-white">
                  {parent.name}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {parent.children.length} subcategories
                </p>
              </div>
            </div>

            {/* Child Categories */}
            <div className="ml-6 space-y-2">
              {parent.children
                .filter((child) =>
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
                      className={`w-6 h-6 ${child.color} rounded-full flex items-center justify-center`}
                    >
                      <IconRenderer
                        iconName={child.icon}
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
