import { Checkbox } from "@/components/ui/checkbox";

interface FilterTabHeaderProps {
  title: string;
  handleSelectAll?: () => void;
  isAllSelected?: boolean | "indeterminate";
  action?: React.ReactNode;
}

const FilterTabHeader = ({
  title,
  handleSelectAll,
  isAllSelected,
  action,
}: FilterTabHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h4 className="font-medium text-slate-900 dark:text-white">{title}</h4>

      {handleSelectAll && (
        <Checkbox
          className="h-5 w-5 rounded-full data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:text-foreground"
          checked={isAllSelected}
          onCheckedChange={handleSelectAll}
        />
      )}
      {action}
    </div>
  );
};

export default FilterTabHeader;
