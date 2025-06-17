import { Search, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderRightActionsProps {
  showPeopleSearch: boolean;
  setShowPeopleSearch: (show: boolean) => void;
}

const HeaderRightActions = ({
  showPeopleSearch,
  setShowPeopleSearch,
}: HeaderRightActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 dark:text-slate-400"
        onClick={() => setShowPeopleSearch(!showPeopleSearch)}
      >
        {showPeopleSearch ? (
          <SearchX className="w-4 h-4" />
        ) : (
          <Search className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default HeaderRightActions;
