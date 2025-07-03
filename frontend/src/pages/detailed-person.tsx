import TabsLayout from '@/layouts/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, Mail, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailedPersonActions from '@/components/people-tab/detailed-person-actions';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { peopleService, type Person } from '@/services/api';
import { useConfirmDialog } from '@/store/useConfirmDialog';
import { runWithLoaderAndError } from '@/lib/async-handler';
import { useLookupStore } from '@/store/useLookupStore';
import { getInitials } from '@/lib/utils';
import PersonTransactions from '@/components/people-tab/person-transactions';

const DetailedPerson = () => {
  const [person, setPerson] = useState<Person | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    runWithLoaderAndError(
      async () => {
        const response = await peopleService.get(id as string);
        setPerson(response.data);
      },
      {
        loaderMessage: 'Loading person...',
      },
    );
  }, [id]);

  const handleEdit = () => {
    navigate(`/people/${id}/edit`);
  };

  const handleShare = () => {
    useConfirmDialog.getState().open({
      title: 'Share Person',
      message: 'Share functionality would open here',
      onConfirm: () => {},
    });
  };

  const handleDelete = () => {
    useConfirmDialog.getState().open({
      title: 'Delete Person',
      message: `Are you sure you want to delete "${person?.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await peopleService.delete(id as string);
            await useLookupStore.getState().fetchPeople();
            navigate('/people');
          },
          {
            loaderMessage: 'Deleting person...',
            successMessage: 'Person deleted successfully',
          },
        );
      },
    });
  };

  return (
    <TabsLayout
      header={{
        title: person?.name || 'Person',
        description: person?.description || '',
        rightActions: person && (
          <DetailedPersonActions onEdit={handleEdit} onShare={handleShare} onDelete={handleDelete} />
        ),
        linkBackward: '/people',
      }}
    >
      {person && (
        <div className="flex flex-col gap-4">
          {/* Member Header */}
          <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={person?.avatar.url || undefined} alt={person?.name || 'Person'} />
                  <AvatarFallback className="bg-emerald-500 text-xl font-semibold text-white">
                    {getInitials(person.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{person.name}</h1>
                  <p className="text-slate-600 dark:text-slate-400">{person.description}</p>
                  <div className="mt-2">
                    <span className={`text-lg font-semibold ${transactionUtils.getBalanceColor(person.balance)}`}>
                      {person.balance === 0
                        ? 'All settled up'
                        : currencyUtils.formatAmount(Math.abs(person.balance), user?.settings?.currency)}
                    </span>
                    {person.balance !== 0 && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {person.balance > 0 ? 'owes you' : 'you owe'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
            <Button variant="outline">
              <DollarSign className="mr-2 h-4 w-4" />
              Settle Up
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Contact Information */}
            <Card className="gap-4">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{person.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{person.phone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="gap-4">
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent className="gap-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{person.totalTransactions}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                      {currencyUtils.formatAmount(person.balance || 0, user?.settings?.currency)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Spent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {currencyUtils.formatAmount(person.balance || 0, user?.settings?.currency)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Received</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <PersonTransactions personId={id as string} />
        </div>
      )}

      {!person && (
        <div className="px-4 py-6 text-center">
          <p className="text-slate-500 dark:text-slate-400">Person not found</p>
          <Button onClick={() => navigate('/people')} className="mt-4">
            Go Back
          </Button>
        </div>
      )}
    </TabsLayout>
  );
};

export default DetailedPerson;
