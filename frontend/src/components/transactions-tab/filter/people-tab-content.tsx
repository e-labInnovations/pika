import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import SearchItem from './search-item';
import FilterTabHeader from './filter-tab-header';
import { getInitials } from '@/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { Filter } from './types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLookupStore } from '@/store/useLookupStore';

interface PeopleTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const PeopleTabContent = ({ filters, setFilters }: PeopleTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const people = useLookupStore((state) => state.people);

  const getFilteredPeople = () => {
    return people.filter((person) => person.name.toLowerCase().includes(searchTerm));
  };

  const handleSelectAllPeople = () => {
    const allPeopleIds = getFilteredPeople().map((person) => person.id?.toString() || person.name);
    const allSelected = allPeopleIds.length === filters.people.length;
    setFilters((prev) => ({
      ...prev,
      people: allSelected ? [] : allPeopleIds,
    }));
  };

  const handlePersonToggle = (personId: string) => {
    setFilters((prev) => ({
      ...prev,
      people: prev.people.includes(personId) ? prev.people.filter((id) => id !== personId) : [...prev.people, personId],
    }));
  };

  return (
    <div className="flex h-full flex-grow flex-col gap-2">
      <div className="flex flex-col gap-2">
        <FilterTabHeader
          title="People"
          handleSelectAll={handleSelectAllPeople}
          isAllSelected={
            filters.people.length === getFilteredPeople().length
              ? true
              : filters.people.length > 0
                ? 'indeterminate'
                : false
          }
        />
        <SearchItem searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search person..." />
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
        {getFilteredPeople().map((person) => {
          const personId = person.id?.toString() || person.name;
          return (
            <CheckboxPrimitive.Root
              key={personId}
              checked={filters.people.includes(personId)}
              onCheckedChange={() => handlePersonToggle(personId)}
              className="ring-border text-muted-foreground data-[state=checked]:ring-primary data-[state=checked]:text-primary hover:bg-accent/50 relative rounded-lg border border-slate-200 px-4 py-3 text-start ring-[0.25px] data-[state=checked]:ring-[1.5px] dark:border-slate-700"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={person.avatar?.url} alt={person.name} />
                  <AvatarFallback>{getInitials(person.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{person.name}</p>
                  <p className="text-muted-foreground line-clamp-1 text-sm">{person.description}</p>
                </div>
              </div>
              <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
                <CircleCheck className="fill-primary text-primary-foreground" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
          );
        })}
      </div>
    </div>
  );
};

export default PeopleTabContent;
