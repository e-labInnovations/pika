import { ArrowDownUp, FilterIcon, Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderRightActionsProps {
  showTransactionSearch: boolean;
  setShowTransactionSearch: (show: boolean) => void;
  showFilterModal: boolean;
  handleFilterOpen: () => void;
  showSortModal: boolean;
  setShowSortModal: (show: boolean) => void;
  filterCount: number;
}

const HeaderRightActions = ({
  showTransactionSearch,
  setShowTransactionSearch,
  handleFilterOpen,
  setShowSortModal,
  filterCount,
}: HeaderRightActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 dark:text-slate-400"
        onClick={() => setShowTransactionSearch(!showTransactionSearch)}
      >
        {showTransactionSearch ? (
          <SearchX className="w-4 h-4" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </Button>

      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-600 dark:text-slate-400"
          onClick={handleFilterOpen}
        >
          <FilterIcon className="w-4 h-4" />
        </Button>
        {filterCount > 0 && (
          <span className="absolute top-1 right-1 px-1 min-w-4 translate-x-1/2 -translate-y-1/2 origin-center flex items-center justify-center rounded-full text-xs bg-destructive text-destructive-foreground">
            {filterCount}
          </span>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 dark:text-slate-400"
        onClick={() => setShowSortModal(true)}
      >
        <ArrowDownUp className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default HeaderRightActions;
