import { people, transactions } from '@/data/dummy-data';
import TabsLayout from '@/layouts/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, Mail, Phone, MessageCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import DetailedPersonActions from '@/components/people-tab/detailed-person-actions';

const DetailedPerson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const person = people.find((person) => person.id === id);
  const personTransactions = transactions.filter((t) => t.person?.id === id);

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-emerald-600 dark:text-emerald-400';
    if (balance < 0) return 'text-red-500 dark:text-red-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  const getTransactionIcon = (type: string) => {
    return type === 'income' ? (
      <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
    ) : (
      <ArrowUpRight className="h-4 w-4 text-red-500" />
    );
  };

  const getAmountColor = (amount: number, type: string) => {
    if (type === 'income') return 'text-emerald-600 dark:text-emerald-400';
    if (type === 'expense') return 'text-red-500 dark:text-red-400';
    return 'text-blue-600 dark:text-blue-400';
  };

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
      }}
    >
      {person && (
        <div className="space-y-6">
          {/* Member Header */}
          <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={person?.avatar || '/placeholder.svg'} alt={person?.name || 'Person'} />
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
                    <span className={`text-lg font-semibold ${getBalanceColor(person.balance)}`}>
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
            <Button className="bg-emerald-500 hover:bg-emerald-600">
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
            <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
              <CardContent className="space-y-4 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Contact Information</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{person.email}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 dark:text-slate-400">{person.phone}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
              <CardContent className="space-y-4 p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Financial Summary</h3>

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
          <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {personTransactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                  >
                    <div className="flex items-center space-x-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{transaction.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {transaction.date} • {transaction.category.name}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${getAmountColor(transaction.amount, transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
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
