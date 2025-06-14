import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterChipProps {
  id: string;
  name: string;
  color?: string;
  bgColor?: string;
  onClick?: () => void;
  shouldShowRemove?: boolean;
}
const FilterChip = ({
  id,
  name,
  color,
  bgColor,
  onClick,
  shouldShowRemove = true,
}: FilterChipProps) => {
  return (
    <Badge
      className={cn(
        "rounded-full gap-1 text-[10px] px-2 py-0.5 flex-shrink-0",
        color ?? "",
        bgColor ?? ""
      )}
      key={id}
      variant="secondary"
      onClick={onClick}
    >
      {name}
      {shouldShowRemove && <XIcon className="h-4 w-4" />}
    </Badge>
  );
};

export default FilterChip;
