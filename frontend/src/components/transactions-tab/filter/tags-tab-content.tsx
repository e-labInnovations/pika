import { DynamicIcon } from '@/components/lucide';
import { useState } from 'react';
import SearchItem from './search-item';
import FilterTabHeader from './filter-tab-header';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { Filter } from './types';
import { IconRenderer } from '@/components/icon-renderer';
import { useTags } from '@/hooks/queries';

interface TagsTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const TagsTabContent = ({ filters, setFilters }: TagsTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: tags = [] } = useTags();

  const getFilteredTags = () => {
    return tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const handleTagToggle = (tag: string) => {
    setFilters((prev: Filter) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
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
    <div className="flex h-full flex-grow flex-col gap-2">
      <div className="flex flex-col gap-2">
        <FilterTabHeader
          title="Tags"
          handleSelectAll={handleSelectAllTags}
          isAllSelected={
            filters.tags.length === getFilteredTags().length ? true : filters.tags.length > 0 ? 'indeterminate' : false
          }
        />
        <SearchItem searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search tags..." />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        {getFilteredTags().map((tag) => (
          <CheckboxPrimitive.Root
            key={tag.id}
            checked={filters.tags.includes(tag.id)}
            onCheckedChange={() => handleTagToggle(tag.id)}
            className="ring-border text-muted-foreground data-[state=checked]:ring-primary data-[state=checked]:text-primary hover:bg-accent/50 relative rounded-lg border border-slate-200 px-4 py-3 text-start ring-[0.25px] data-[state=checked]:ring-[1.5px] dark:border-slate-700"
          >
            <div className="flex items-center space-x-3">
              <IconRenderer iconName={tag.icon} bgColor={tag.bgColor} color={tag.color} />
              <div className="flex-1">
                <p className="font-medium">{tag.name}</p>
                <p className="text-muted-foreground line-clamp-1 text-sm">{tag.description}</p>
              </div>
            </div>
            <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
              <DynamicIcon name="circle-check" className="fill-primary text-primary-foreground" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
        ))}
      </div>
    </div>
  );
};

export default TagsTabContent;
