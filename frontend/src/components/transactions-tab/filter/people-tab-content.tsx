import { Button } from "@/components/ui/button";
import {
  CheckSquare,
  CircleCheck,
  Icon,
  Search,
  Square,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { transactions } from "@/data/dummy-data";
import { useState } from "react";
import SearchItem from "./search-item";
import FilterTabHeader from "./filter-tab-header";
import { cn } from "@/lib/utils";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

interface PeopleTabContentProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const PeopleTabContent = ({ filters, setFilters }: PeopleTabContentProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const uniquePeople = Array.from(
    new Set(
      transactions
        .map((t) => t.person)
        .filter(Boolean)
        .map((p) => JSON.stringify(p))
    )
  ).map((p) => JSON.parse(p));

  const getFilteredPeople = () => {
    return uniquePeople.filter((person) =>
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
                <div className="w-8 h-8 bg-orange-200 dark:bg-orange-700 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{person.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {
                      transactions.filter(
                        (t) =>
                          t.person?.id?.toString() === personId ||
                          t.person?.name === person.name
                      ).length
                    }{" "}
                    transactions
                  </p>
                </div>
              </div>
              <CheckboxPrimitive.Indicator className="absolute top-2 right-2">
                <CircleCheck className="fill-primary text-primary-foreground" />
              </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>

            // <div
            //   key={personId}
            //   className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
            //     filters.people.includes(personId)
            //       ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20"
            //       : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            //   }`}
            //   onClick={() => handlePersonToggle(personId)}
            // >
            //   <div className="w-8 h-8 bg-orange-200 dark:bg-orange-700 rounded-full flex items-center justify-center">
            //     <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            //   </div>
            //   <div className="flex-1">
            //     <p className="font-medium text-slate-900 dark:text-white">
            //       {person.name}
            //     </p>
            //     <p className="text-sm text-slate-500 dark:text-slate-400">
            //       {
            //         transactions.filter(
            //           (t) =>
            //             t.person?.id?.toString() === personId ||
            //             t.person?.name === person.name
            //         ).length
            //       }{" "}
            //       transactions
            //     </p>
            //   </div>
            // </div>
          );
        })}
      </div>
    </div>
  );
};

export default PeopleTabContent;
