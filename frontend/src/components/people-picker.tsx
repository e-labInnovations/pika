import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import SearchBar from './search-bar';
import { type Person } from '@/services/api';
import { useLookupStore } from '@/store/useLookupStore';
import { cn, getInitials } from '@/lib/utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import transactionUtils from '@/lib/transaction-utils';

interface PeoplePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (person: Person) => void;
  selectedPersonId?: string;
}

const PeoplePicker = ({ isOpen, onClose, onSelect, selectedPersonId }: PeoplePickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const people = useLookupStore((state) => state.people);
  const { user } = useAuth();

  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (person: Person) => {
    onSelect(person);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-md overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Person</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchToggle={() => {}}
            placeholder="Search people..."
          />

          {/* People List */}
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {filteredPeople.map((person) => (
              <div
                key={person.id}
                className={cn(
                  'ring-border hover:bg-accent/50 relative rounded-lg border border-slate-200 px-4 py-3 text-start ring-[0.25px] transition-all dark:border-slate-700',
                  selectedPersonId === person.id.toString()
                    ? 'border-primary ring-primary bg-primary/5 text-primary ring-[1.5px]'
                    : 'text-muted-foreground',
                )}
                onClick={() => handleSelect(person)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={person.avatar?.url} alt={person.name} />
                    <AvatarFallback className="bg-emerald-500 font-semibold text-white">
                      {getInitials(person.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium">{person.name}</p>
                      <span
                        className={cn('text-sm font-semibold', transactionUtils.getBalanceColor(person.balance, true))}
                      >
                        {currencyUtils.formatBalance(person.balance, user?.settings?.currency)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-muted-foreground truncate text-sm">{person.description}</p>
                      {person.balance !== 0 && (
                        <p className="text-muted-foreground text-xs">{person.balance > 0 ? 'You owe' : 'Owes you'}</p>
                      )}
                    </div>
                  </div>
                </div>
                {selectedPersonId === person.id.toString() && (
                  <div className="absolute top-2 right-2">
                    <Check className="fill-primary text-primary-foreground h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPeople.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">No people found</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 border-t pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PeoplePicker;
