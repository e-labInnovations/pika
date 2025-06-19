import { people, transactions } from '@/data/dummy-data';
import TabsLayout from '@/layouts/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, Mail, Phone } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailedPersonActions from '@/components/people-tab/detailed-person-actions';
import { CategoryTransactionIcon } from '@/components/category-transaction-icon';
import TransactionUtils from '@/lib/transaction-utils';

const DetailedPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const person = people.find((person) => person.id === id);
  const personTransactions = transactions.filter((t) => t.person?.id === id);

  const handleEdit = () => {
    alert('Edit person functionality would open here');
  };

  const handleShare = () => {
    alert('Share functionality would open here');
  };

  const handleDelete = () => {
    if (person && confirm(`Are you sure you want to delete "${person.name}"?`)) {
      // onDelete(person.id)
    }
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
                  <AvatarImage src={person?.avatar} alt={person?.name || 'Person'} />
                  <AvatarFallback className="bg-emerald-500 text-xl font-semibold text-white">
                    {person.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{person.name}</h1>
                  <p className="text-slate-600 dark:text-slate-400">{person.description}</p>
                  <div className="mt-2">
                    <span className={`text-lg font-semibold ${TransactionUtils.getBalanceColor(person.balance)}`}>
                      {person.balance === 0 ? 'All settled up' : `$${Math.abs(person.balance).toFixed(2)}`}
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
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{person.transactionCount}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-500 dark:text-red-400">
                      ${person.totalSpent?.toFixed(2) || 0}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Spent</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${person.totalReceived?.toFixed(2) || 0}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Received</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="gap-4">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" className="text-sm">
                View All
              </Button>
            </CardHeader>
            <CardContent className="gap-4">
              <div className="space-y-3">
                {personTransactions.slice(0, 5).map((transaction) => (
                  <div
                    onClick={() => navigate(`/transactions/${transaction.id}`)}
                    key={transaction.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-800/70"
                  >
                    <div className="flex items-center space-x-3">
                      <CategoryTransactionIcon
                        transactionType={transaction.type}
                        iconName={transaction.category.icon}
                        color={transaction.category.color}
                        bgColor={transaction.category.bgColor}
                      />
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{transaction.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {TransactionUtils.formatDateAndTime(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${TransactionUtils.getAmountColor(transaction.type)}`}>
                      ${transaction.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
