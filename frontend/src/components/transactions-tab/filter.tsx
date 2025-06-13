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
} from "lucide-react";
import { useState } from "react";
import TypesTabContent from "./filter/types-tab-content";
import CategoriesTabContent from "./filter/categories-tab-content";
import TagsTabContent from "./filter/tags-tab-content";
import PeopleTabContent from "./filter/people-tab-content";
import DateTabContent from "./filter/date-tab-content";
import AmountTabContent from "./filter/amount-tab-content";

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
  filters: any;
  setFilters: (filters: any) => void;
}

export type AmountFilter = {
  operator:
    | "between"
    | "greater"
    | "less"
    | "equal"
    | "not_equal"
    | "greater_equal"
    | "less_equal";
  value1: string;
  value2?: string; // For "between" operator
};

export type DateFilter = {
  from: string;
  to: string;
};

const TransactionsFilter = ({
  open,
  setOpen,
  filters,
  setFilters,
}: TransactionsFilterProps) => {
  // Add search states for each tab
  const [tabSearchTerms, setTabSearchTerms] = useState({
    types: "",
    categories: "",
    tags: "",
    people: "",
  });

  const getActiveFiltersCount = () => {
    return 1;
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[75%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="flex gap-2">
            <span>Filter Transactions</span>
            {getActiveFiltersCount() > 0 && (
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-800"
              >
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex px-4 h-full">
          <Tabs
            defaultValue={tabs[0].id}
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
                  <item.content filters={filters} setFilters={setFilters} />
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
          <Button className="w-1/2">Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionsFilter;
