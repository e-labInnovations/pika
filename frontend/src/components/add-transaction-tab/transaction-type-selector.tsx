import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type TransactionType } from "@/components/transactions-tab/filter/types";
import { transactionTypes } from "@/data/transaction-types";
import { cn } from "@/lib/utils";

interface TransactionTypeSelectorProps {
  value: TransactionType;
  onChange: (value: TransactionType) => void;
}

const TransactionTypeSelector = ({
  value,
  onChange,
}: TransactionTypeSelectorProps) => {
  const onValueChange = (value: TransactionType) => {
    console.log("🚀 ~ onValueChange ~ value:", value);
    onChange(value);
  };

  return (
    <Tabs
      defaultValue={value}
      className="w-full"
      onValueChange={(value) => onValueChange(value as TransactionType)}
    >
      <TabsList className="p-1 w-full">
        {transactionTypes.map((transactionType) => (
          <TabsTrigger
            key={transactionType.id}
            value={transactionType.id}
            className={cn(
              "px-2.5 sm:px-3",
              transactionType.color,
              "data-[state=active]:text-white",
              `data-[state=active]:${transactionType.tabBgColor.light}`,
              `dark:data-[state=active]:${transactionType.tabBgColor.dark}`
            )}
          >
            {<transactionType.icon className="w-4 h-4" />}{" "}
            {transactionType.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default TransactionTypeSelector;
