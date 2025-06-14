import { cn } from "@/lib/utils";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { CircleCheck, SortAsc, SortDesc } from "lucide-react";

const SortRadioItem = ({
  value,
  label,
  type,
}: {
  value: string;
  label: string;
  type: "asc" | "desc";
}) => {
  return (
    <RadioGroup.Item
      key={value}
      value={value}
      className={cn(
        "relative group ring-[1px] ring-border rounded py-2 px-3 text-start",
        "data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
      )}
    >
      <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-blue-500 stroke-white group-data-[state=unchecked]:hidden" />
      <div className="flex items-center gap-2">
        {type === "asc" ? (
          <SortAsc className="mb-2.5 text-muted-foreground" />
        ) : (
          <SortDesc className="mb-2.5 text-muted-foreground" />
        )}
        <div className="flex flex-col">
          <span className="font-semibold tracking-tight">
            {type === "asc" ? "Ascending" : "Descending"}
          </span>
          <p className="text-xs">{label}</p>
        </div>
      </div>
    </RadioGroup.Item>
  );
};

export default SortRadioItem;
