import { CircleCheck } from "lucide-react";
import { people } from "@/data/dummy-data";
import { useState } from "react";
import SearchItem from "./search-item";
import FilterTabHeader from "./filter-tab-header";
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type { Filter } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PeopleTabContentProps {
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
}

const PeopleTabContent = ({ filters, setFilters }: PeopleTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getFilteredPeople = () => {
    return people.filter((person) =>
      person.name.toLowerCase().includes(searchTerm)
    );
  };

  const handleSelectAllPeople = () => {
    const allPeopleIds = getFilteredPeople().map(
      (person) => person.id?.toString() || person.name
    );
    const allSelected = allPeopleIds.length === filters.people.length;
    setFilters((prev) => ({
      ...prev,
      people: allSelected ? [] : allPeopleIds,
    }));
  };

  const handlePersonToggle = (personId: string) => {
    setFilters((prev) => ({
      ...prev,
      people: prev.people.includes(personId)
        ? prev.people.filter((id) => id !== personId)
        : [...prev.people, personId],
    }));
  };

  return (
    <div className="space-y-3">
      <FilterTabHeader
        title="People"
        handleSelectAll={handleSelectAllPeople}
        isAllSelected={
          filters.people.length === getFilteredPeople().length
            ? true
            : filters.people.length > 0
            ? "indeterminate"
            : false
        }
      />
      <SearchItem
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search person..."
      />

      <div className="grid grid-cols-1 gap-2">
        {getFilteredPeople().map((person) => {
          const personId = person.id?.toString() || person.name;
          return (
            <CheckboxPrimitive.Root
              key={personId}
              checked={filters.people.includes(personId)}
              onCheckedChange={() => handlePersonToggle(personId)}
              className={cn(
                "relative ring-[0.25px] ring-border rounded-lg px-4 py-3 text-start text-muted-foreground",
                "data-[state=checked]:ring-[1.5px] data-[state=checked]:ring-primary data-[state=checked]:text-primary",
                "hover:bg-accent/50"
              )}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback>
                    {person.name.split(" ")[0].charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {person.description}
                  </p>
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
