import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { analyticsService, type PersonActivity, type MonthlyPersonActivity } from '@/services/api';
import AsyncStateWrapper from '../async-state-wrapper';
import { cn, getInitials } from '@/lib/utils';
import PeopleActivityPopover from './people-activity-popover';
import transactionUtils from '@/lib/transaction-utils';

interface PeopleActivityProps {
  selectedDate: Date;
}

interface PersonItemProps {
  person: PersonActivity;
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  date: Date;
}

const PersonItem = ({ person, popoverOpen, onPopoverOpenChange, date }: PersonItemProps) => {
  const { user } = useAuth();

  const formatAmount = (amount: number) => {
    return currencyUtils.formatAmount(Math.abs(amount), user?.settings?.currency, {
      showSymbol: true,
      showDecimal: true,
    });
  };

  // Calculate total transactions and percentages for the progress border
  const totalTransactions = person.expenseAmount + person.incomeAmount;
  const sentPercentage = totalTransactions > 0 ? (person.expenseAmount / totalTransactions) * 100 : 0;
  const receivedPercentage = totalTransactions > 0 ? (person.incomeAmount / totalTransactions) * 100 : 0;

  return (
    <PeopleActivityPopover personData={person} open={popoverOpen} onOpenChange={onPopoverOpenChange} date={date}>
      <div className="group relative h-12 w-full cursor-pointer">
        {/* Progress Border Background */}
        <div className="absolute inset-0 rounded-full bg-slate-300 p-0.5 transition-all duration-200 group-hover:shadow-lg dark:bg-slate-600">
          {/* Progress Border */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {/* Background for progress */}
            <div className="h-full w-full rounded-full bg-slate-300 dark:bg-slate-600"></div>

            {/* Sent Progress (Green) */}
            {sentPercentage > 0 && (
              <div
                className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${sentPercentage}%`,
                  borderRadius: sentPercentage === 100 ? '9999px' : '9999px 0 0 9999px',
                }}
              ></div>
            )}

            {/* Received Progress (Red) */}
            {receivedPercentage > 0 && (
              <div
                className="absolute top-0 h-full bg-red-500 transition-all duration-300"
                style={{
                  left: `${sentPercentage}%`,
                  width: `${receivedPercentage}%`,
                  borderRadius: receivedPercentage === 100 ? '9999px' : '0 9999px 9999px 0',
                }}
              ></div>
            )}
          </div>

          {/* Inner Content Container */}
          <div className="relative z-10 flex h-full w-full items-center rounded-full bg-white px-0.5 dark:bg-slate-800">
            {/* Avatar */}
            <Avatar className="h-10 w-10 border-2 border-slate-300 dark:border-slate-600">
              <AvatarImage src={person.avatarUrl || undefined} alt={person.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
                {getInitials(person.name)}
              </AvatarFallback>
            </Avatar>

            {/* Balance Information */}
            <div className="mx-2 flex-1 text-right">
              <div className={cn('text-sm font-bold', transactionUtils.getBalanceColor(person.balance, true))}>
                {person.balance === 0 ? 'Even' : formatAmount(person.balance)}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {person.balance === 0 ? 'Settled' : person.balance >= 0 ? 'You owe' : 'Owes you'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PeopleActivityPopover>
  );
};

const PeopleActivityView = ({ selectedDate }: PeopleActivityProps) => {
  const [peopleActivityData, setPeopleActivityData] = useState<MonthlyPersonActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  useEffect(() => {
    fetchPeopleActivity();
  }, [selectedDate]);

  const fetchPeopleActivity = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyticsService.getPeopleActivity(
        selectedDate.getMonth() + 1,
        selectedDate.getFullYear(),
      );
      setPeopleActivityData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopoverOpenChange = (personId: string, open: boolean) => {
    if (open) {
      setSelectedPerson(personId);
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
      setSelectedPerson(null);
    }
  };

  // Filter out people with zero transactions and sort by balance amount (descending)
  const peopleWithTransactions =
    peopleActivityData?.data
      .filter((person) => person.totalTransactionCount > 0)
      .sort((a, b) => a.balance - b.balance) || [];
  const totalPeople = peopleWithTransactions.length;

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md">People Activity</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={fetchPeopleActivity}>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {peopleWithTransactions.map((person) => (
              <PersonItem
                key={person.id}
                person={person}
                popoverOpen={popoverOpen && selectedPerson === person.id}
                onPopoverOpenChange={(open) => handlePopoverOpenChange(person.id, open)}
                date={selectedDate}
              />
            ))}
          </div>

          {totalPeople === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No people with transactions found for this month
              </p>
            </div>
          )}
        </AsyncStateWrapper>
      </CardContent>
    </Card>
  );
};

export default PeopleActivityView;
