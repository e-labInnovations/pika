import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check } from 'lucide-react';
import SearchBar from './search-bar';
import { personService, type Person } from '@/services/api/people.service';

interface PeoplePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (person: Person) => void;
  selectedPersonId?: string;
}

const PeoplePicker = ({ isOpen, onClose, onSelect, selectedPersonId }: PeoplePickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    personService.list().then((response) => {
      setPeople(response.data);
    });
  }, []);
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
                className={`flex cursor-pointer items-center space-x-3 rounded-lg p-3 transition-colors ${
                  selectedPersonId === person.id.toString()
                    ? 'border border-emerald-200 bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => handleSelect(person)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={person.avatar.url} alt={person.name} />
                  <AvatarFallback className="bg-emerald-500 font-semibold text-white">
                    {person.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-900 dark:text-white">{person.name}</p>
                  <p className="truncate text-sm text-slate-500 dark:text-slate-400">{person.description}</p>
                </div>
                {selectedPersonId === person.id.toString() && (
                  <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
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
