import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchItemProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
}

const SearchItem = ({
  searchTerm,
  setSearchTerm,
  placeholder,
}: SearchItemProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3" />
      <Input
        placeholder={placeholder || "Search..."}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 h-8 text-sm"
      />
    </div>
  );
};

export default SearchItem;
