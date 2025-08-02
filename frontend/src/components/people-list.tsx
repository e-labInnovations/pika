import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from 'lucide-react';
import type { Person } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import transactionUtils from '@/lib/transaction-utils';
import { cn, getColorFromName, getInitials } from '@/lib/utils';

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
                  <Avatar className="h-12 w-12 border-2 border-slate-300 dark:border-slate-600">
                    <AvatarImage src={person.avatar?.url} alt={person.name} />
                    <AvatarFallback className={cn('text-xs font-semibold text-white', getColorFromName(person.name))}>
                      {getInitials(person.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="truncate font-medium text-slate-900 dark:text-white">{person.name}</h4>
                      <div className="text-right">
                        <span className={cn('font-semibold', transactionUtils.getBalanceColor(person.balance, true))}>
                          {person.balance == 0
                            ? 'Even'
                            : currencyUtils.formatAmount(Math.abs(person.balance), user?.settings?.currency)}
                        </span>
                        {person.balance !== 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {person.balance > 0 ? 'You owe' : 'Owes you'}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="truncate text-sm text-slate-500 dark:text-slate-400">{person.description}</p>
                    <div className="mt-1 flex items-center justify-between space-x-4">
                      <span className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                        <Calendar className="mr-1 h-3 w-3" />
                        Last:{' '}
                        {person.lastTransactionAt ? transactionUtils.formatDateTime(person.lastTransactionAt) : '-'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {person.totalTransactions} transactions
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
