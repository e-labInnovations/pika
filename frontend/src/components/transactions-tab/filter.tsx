import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Calculator,
  Calendar,
  DollarSign,
  Folder,
  Tag,
  User,
  X,
} from "lucide-react";
import TypesTabContent from "./filter/types-tab-content";
import CategoriesTabContent from "./filter/categories-tab-content";
import TagsTabContent from "./filter/tags-tab-content";
import PeopleTabContent from "./filter/people-tab-content";
import DateTabContent from "./filter/date-tab-content";
import AmountTabContent from "./filter/amount-tab-content";
import { defaultFilterValues, type Filter } from "./filter/types";
import { useEffect, useState } from "react";

const tabs = [
  { id: "types", label: "Type", icon: DollarSign, content: TypesTabContent },
  {
    id: "categories",
    label: "Categories",
    icon: Folder,
    content: CategoriesTabContent,
  },
  { id: "tags", label: "Tags", icon: Tag, content: TagsTabContent },
  { id: "people", label: "People", icon: User, content: PeopleTabContent },
  { id: "date", label: "Date", icon: Calendar, content: DateTabContent },
  {
    id: "amount",
    label: "Amount",
    icon: Calculator,
    content: AmountTabContent,
  },
];

interface TransactionsFilterProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  filters: Filter;
  setFilters: (filters: Filter | ((prev: Filter) => Filter)) => void;
  defaultTab?: string;
}

const TransactionsFilter = ({
  open,
  setOpen,
  filters,
  setFilters,
  defaultTab,
}: TransactionsFilterProps) => {
  const [localFilters, setLocalFilters] = useState<Filter>(defaultFilterValues);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter((key) => {
      const value = filters[key as keyof Filter];
      return Array.isArray(value) && value.length > 0;
    }).length;
  };

  const handleClearFilters = () => {
    setLocalFilters(defaultFilterValues);
  };

  const handleSubmitFilters = () => {
    setFilters(localFilters);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[75%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="flex gap-2 w-full">
            <div className="flex grow items-center gap-2">
              <span>Filter Transactions</span>
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              className="rounded-full flex-none"
              onClick={handleClearFilters}
            >
              <X /> Clear
            </Button>
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex px-4 h-full">
          <Tabs
            defaultValue={defaultTab ?? tabs[0].id}
            orientation="vertical"
            className="w-full h-full flex items-start items-stretch justify-center gap-2"
          >
            <TabsList className="grid grid-cols-1 min-h-full overflow-y-auto w-fit p-0 divide-y border shrink-0">
              {tabs.map((item) => (
                <TabsTrigger
                  key={item.id}
                  value={item.id}
                  className={cn(
                    "flex flex-col rounded-none first:rounded-t-md last:rounded-b-md bg-background h-full w-14 p-0",
                    "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-[8px] text-center">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex-1 w-full min-h-full border rounded-lg p-2">
              {tabs.map((item) => (
                <TabsContent key={item.id} value={item.id} className="h-full">
                  <item.content
                    filters={localFilters}
                    setFilters={setLocalFilters}
                  />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
        <DrawerFooter className="flex flex-row gap-2">
          <DrawerClose className="w-1/2">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
          <Button className="w-1/2" onClick={handleSubmitFilters}>
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionsFilter;
