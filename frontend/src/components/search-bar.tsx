import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  onSearchToggle: (show: boolean) => void;
  placeholder?: string;
}

const SearchBar = ({ searchTerm, setSearchTerm, onSearchToggle, placeholder = 'Search...' }: SearchBarProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-top-2 relative duration-300">
      <Search className="animate-in fade-in absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400 duration-300" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-card/50 border-border focus-visible:ring-ring placeholder:text-muted-foreground/50 h-9 pr-9 pl-9 focus-visible:ring-1"
        autoFocus
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground animate-in fade-in absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0 duration-200"
          onClick={() => {
            setSearchTerm('');
            onSearchToggle(false);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default SearchBar;
