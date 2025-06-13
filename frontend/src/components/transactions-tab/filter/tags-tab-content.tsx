import { Tag } from "lucide-react";
import { useState } from "react";
import SearchItem from "./search-item";
import FilterTabHeader from "./filter-tab-header";
import { transactions } from "@/data/dummy-data";

interface TagsTabContentProps {
  filters: any;
  setFilters: (filters: any) => void;
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
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSelectAllTags = () => {
    const allSelected = uniqueTags.length === filters.tags.length;
    setFilters((prev) => ({
      ...prev,
      tags: allSelected ? [] : [...uniqueTags],
    }));
  };
  return (
    <div className="space-y-3">
      <FilterTabHeader
        title="Tags"
        handleSelectAll={handleSelectAllTags}
        isAllSelected={
          filters.tags.length === uniqueTags.length
            ? true
            : filters.types.length > 0
            ? "indeterminate"
            : false
        }
      />
      <SearchItem
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search tags..."
      />

      <div className="space-y-2">
        {getFilteredTags().map((tag) => (
          <div
            key={tag}
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
              filters.tags.includes(tag)
                ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
                : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
            onClick={() => handleTagToggle(tag)}
          >
            <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <Tag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900 dark:text-white">
                {tag}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {transactions.filter((t) => t.tags.includes(tag)).length}{" "}
                transactions
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsTabContent;
