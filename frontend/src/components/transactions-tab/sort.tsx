import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import SortRadioItem from "./sort/sort-radio-item";
import {
  defaultSort,
  type Sort,
  type SortDirection,
  sortOptions,
} from "./sort/types";

interface TransactionsSortProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  sort: Sort;
  setSort: (sort: Sort) => void;
}

const TransactionsSort = ({
  open,
  setOpen,
  sort,
  setSort,
}: TransactionsSortProps) => {
  const [localSort, setLocalSort] = useState<Sort>(sort);

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ localSort:", localSort);
  }, [localSort]);

  const handleSortChange = (value: string) => {
    setLocalSort({
      field: value.split("-")[0],
      direction: value.split("-")[1] as SortDirection,
    });
  };

  const getRadioValue = (field: string, direction: SortDirection) => {
    return `${field}-${direction}`;
  };

  const handleClearSort = () => {
    console.log("clear sort");
    setLocalSort(defaultSort);
  };

  const handleSubmitSort = () => {
    setSort(localSort);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[75%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="flex gap-2 w-full items-center">
            <span className="grow text-left">Sort Transactions</span>
            <Button
              variant="outline"
              className="rounded-full flex-none"
              onClick={handleClearSort}
            >
              <X /> Clear
            </Button>
          </DrawerTitle>
        </DrawerHeader>

        <RadioGroup.Root
          defaultValue={getRadioValue(localSort.field, localSort.direction)}
          onValueChange={handleSortChange}
          className="flex flex-col gap-2 px-4 h-[70%] overflow-y-auto"
        >
          {sortOptions.map((option) => (
            <div key={option.value} className="flex flex-col gap-2">
              <h4 className="font-medium text-slate-900 dark:text-white">
                {option.label}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <SortRadioItem
                  key={`${option.value}-asc`}
                  value={getRadioValue(option.value, "asc")}
                  label={option.ascLabel}
                  type="asc"
                />
                <SortRadioItem
                  key={`${option.value}-desc`}
                  value={getRadioValue(option.value, "desc")}
                  label={option.descLabel}
                  type="desc"
                />
              </div>
            </div>
          ))}
        </RadioGroup.Root>

        <DrawerFooter className="flex flex-row gap-2">
          <DrawerClose className="w-1/2">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
          <Button className="w-1/2" onClick={handleSubmitSort}>
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionsSort;
