import { Search, SearchX, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeaderRightActionsProps {
  showPeopleSearch: boolean;
  setShowPeopleSearch: (show: boolean) => void;
}

const HeaderRightActions = ({ showPeopleSearch, setShowPeopleSearch }: HeaderRightActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-slate-600 dark:text-slate-400"
        onClick={() => setShowPeopleSearch(!showPeopleSearch)}
      >
        {showPeopleSearch ? <SearchX className="h-4 w-4" /> : <Search className="h-4 w-4" />}
      </Button>
      <Button variant="outline" size="icon" className="rounded-full" onClick={() => navigate('/people/add')}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default HeaderRightActions;
