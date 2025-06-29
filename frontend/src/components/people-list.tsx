import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import type { Person } from '@/data/dummy-data';
import { useNavigate } from 'react-router-dom';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';

interface PeopleListProps {
  people: Person[];
  searchTerm: string;
}

export function PeopleList({ people, searchTerm }: PeopleListProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const filteredPeople = people.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-emerald-600 dark:text-emerald-400';
    if (balance < 0) return 'text-red-500 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  const handleCardClick = (personId: string) => {
    navigate(`/people/${personId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-3">
        {filteredPeople.map((person) => (
          <Card
            key={person.id}
            className="cursor-pointer p-0 transition-shadow hover:shadow-md"
            onClick={() => handleCardClick(person.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-1 items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={person.avatar || '/placeholder.svg'} alt={person.name} />
                    <AvatarFallback className="bg-emerald-500 font-semibold text-white">
                      {person.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="truncate font-medium text-slate-900 dark:text-white">{person.name}</h4>
                      <div className="text-right">
                        <span className={`font-semibold ${getBalanceColor(person.balance)}`}>
                          {person.balance === 0
                            ? 'Even'
                            : currencyUtils.formatAmount(Math.abs(person.balance), user?.default_currency)}
                        </span>
                        {person.balance !== 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {person.balance > 0 ? 'owes you' : 'you owe'}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{person.description}</p>
                    <div className="mt-1 flex items-center space-x-4">
                      <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="mr-1 h-3 w-3" />
                        Last: {person.lastTransaction}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {person.transactionCount} transactions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPeople.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">No people found</p>
        </div>
      )}
    </div>
  );
}
