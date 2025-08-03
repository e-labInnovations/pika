import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchBar from './search-bar';
import { type Person } from '@/services/api';
import { usePeople } from '@/hooks/queries';
import { cn, getColorFromName, getInitials } from '@/lib/utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import transactionUtils from '@/lib/transaction-utils';
import { useMediaQuery } from '@/hooks/use-media-query';

interface PeoplePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (person: Person) => void;
  selectedPersonId?: string;
}

const PeoplePicker = ({ isOpen, onClose, onSelect, selectedPersonId }: PeoplePickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: people = [] } = usePeople();
  const { user } = useAuth();
  const isDesktop = useMediaQuery('(min-width: 768px)');

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

  const scrollableContent = (
    <div className="flex h-full flex-grow flex-col gap-2">
      {/* Search */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchToggle={() => {}}
            placeholder="Search people..."
          />
        </div>
      </div>

      {/* People List */}
      {filteredPeople.length !== 0 && (
        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1">
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
                <Avatar className="h-10 w-10 border-1 border-slate-300 dark:border-slate-600">
                  <AvatarImage src={person.avatar?.url} alt={person.name} />
                  <AvatarFallback className={cn('text-xs font-semibold text-white', getColorFromName(person.name))}>
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
            </div>
          ))}
        </div>
      )}

      {filteredPeople.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-center">
          <p className="text-slate-500 dark:text-slate-400">No people found</p>
        </div>
      )}
    </div>
  );

  const actionButtons = (
    <Button variant="outline" onClick={onClose} className="w-full">
      Cancel
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex h-[80%] flex-col">
          <DialogHeader>
            <DialogTitle>Select Person</DialogTitle>
          </DialogHeader>
          <div className="flex h-full flex-grow flex-col overflow-hidden">{scrollableContent}</div>
          <div className="border-t px-2 pt-4 pb-2">{actionButtons}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[75%]">
        <DrawerHeader>
          <DrawerTitle>Select Person</DrawerTitle>
        </DrawerHeader>
        <div className="flex h-full flex-grow flex-col overflow-hidden px-2">{scrollableContent}</div>
        <DrawerFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PeoplePicker;
