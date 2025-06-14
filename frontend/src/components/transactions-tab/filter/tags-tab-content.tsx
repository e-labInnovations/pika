import { CircleCheck, Tag } from "lucide-react";
import { useState } from "react";
import SearchItem from "./search-item";
import FilterTabHeader from "./filter-tab-header";
import { transactions } from "@/data/dummy-data";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import type { Filter } from "./types";

interface TagsTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const TagsTabContent = ({ filters, setFilters }: TagsTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const uniqueTags = Array.from(new Set(transactions.flatMap((t) => t.tags)));
  const getFilteredTags = () => {
    return uniqueTags.filter((tag) =>
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev: Filter) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSelectAllTags = () => {
    const allSelected = getFilteredTags().length === filters.tags.length;
    setFilters((prev: Filter) => ({
      ...prev,
      tags: allSelected ? [] : getFilteredTags().map((tag) => tag),
    }));
  };
  return (
    <div className="space-y-3">
      <FilterTabHeader
        title="Tags"
        handleSelectAll={handleSelectAllTags}
        isAllSelected={
          filters.tags.length === getFilteredTags().length
            ? true
            : filters.tags.length > 0
            ? "indeterminate"
            : false
        }
      />
      <SearchItem
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search tags..."
      />

      <div className="grid grid-cols-1 gap-2">
        {getFilteredTags().map((tag) => (
          <CheckboxPrimitive.Root
            key={tag}
            checked={filters.tags.includes(tag)}
            onCheckedChange={() => handleTagToggle(tag)}
            className={cn(
              "relative ring-[0.25px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground",
              "data-[state=checked]:ring-[1.5px] data-[state=checked]:ring-primary data-[state=checked]:text-primary",
              "hover:bg-accent/50"
            )}
          >
            <div className="flex items-center space-x-3">
              <div
                className={
                  "w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-700"
                }
              >
                <Tag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{tag}</p>
                <p className="text-sm text-muted-foreground">
                  {transactions.filter((t) => t.tags.includes(tag)).length}{" "}
                  transactions
                </p>
              </div>
            </div>
            <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
              <CircleCheck className="fill-primary text-primary-foreground" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
        ))}
      </div>
    </div>
  );
};

export default TagsTabContent;
