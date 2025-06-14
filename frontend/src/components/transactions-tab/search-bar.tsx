import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  onSearchToggle: (show: boolean) => void;
}

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  onSearchToggle,
}: SearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={cn(
          "pl-9 pr-9 h-9",
          "bg-card/50 backdrop-blur-sm",
          "border-border focus-visible:ring-1 focus-visible:ring-ring",
          "placeholder:text-muted-foreground/50"
        )}
        autoFocus
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setSearchTerm("");
            onSearchToggle(false);
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
