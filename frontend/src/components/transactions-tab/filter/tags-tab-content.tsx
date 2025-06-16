import { CircleCheck } from "lucide-react";
import { useState } from "react";
import SearchItem from "./search-item";
import FilterTabHeader from "./filter-tab-header";
import { tags } from "@/data/dummy-data";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import type { Filter } from "./types";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

interface TagsTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const TagsTabContent = ({ filters, setFilters }: TagsTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getFilteredTags = () => {
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      tags: allSelected ? [] : getFilteredTags().map((tag) => tag.id),
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
            key={tag.id}
            checked={filters.tags.includes(tag.id)}
            onCheckedChange={() => handleTagToggle(tag.id)}
            className={cn(
              "relative ring-[0.25px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground",
              "data-[state=checked]:ring-[1.5px] data-[state=checked]:ring-primary data-[state=checked]:text-primary",
              "hover:bg-accent/50"
            )}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: tag.bgColor,
                  color: tag.color,
                }}
              >
                <DynamicIcon name={tag.icon as IconName} className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{tag.name}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {tag.description}
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
