import TabsLayout from '@/layouts/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Tag, Wallet, User, FileText, Paperclip, Eye } from 'lucide-react';
import { IconRenderer } from '@/components/icon-renderer';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HeaderDropdownMenu from '@/components/transactions-tab/header-dropdown-menu';
import { CategoryTransactionIcon } from '@/components/category-transaction-icon';
import { Button } from '@/components/ui/button';
import { TagChip } from '@/components/tag-chip';
import AccountAvatar from '@/components/account-avatar';
import { transactionsService, type Transaction } from '@/services/api';
import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import transactionUtils from '@/lib/transaction-utils';
import { runWithLoaderAndError } from '@/lib/async-handler';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (id) {
      runWithLoaderAndError(
        async () => {
          const response = await transactionsService.get(id);
          setTransaction(response.data);
        },
        {
          loaderMessage: 'Loading transaction...',
        },
      );
    }
  }, [id]);

  const getTransactionType = (type: string) => {
    const transactionType = transactionUtils.types.find((transactionType) => transactionType.id === type);
    return transactionType;
  };

  return (
    <TabsLayout
      header={{
        title: 'Transaction Details',
        description: 'Manage your transaction details',
        linkBackward: '/transactions',
        rightActions: <HeaderDropdownMenu />,
      }}
    >
      {transaction && (
        <div className="flex flex-col gap-4">
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center space-x-2">
              <CategoryTransactionIcon
                transactionType={transaction.type}
                iconName={transaction.category.icon}
                size="lg"
                bgColor={transaction.category.bgColor}
                color={transaction.category.color}
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{transaction.title}</h1>
            <p className={`text-3xl font-bold ${transactionUtils.getAmountColor(transaction.type)}`}>
              {Math.abs(transaction.amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <Card className="border-slate-200 bg-white/70 p-0 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Transaction Details</h3>
                <TagChip
                  name={getTransactionType(transaction.type)?.name || ''}
                  iconName={getTransactionType(transaction.type)?.icon || ''}
                  color="#ffffff"
                  size="sm"
                  className={`rounded-md ${getTransactionType(transaction.type)?.bgColor}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>Date</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {transactionUtils.formatDate(transaction.date)}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="h-4 w-4" />
                    <span>Time</span>
                  </div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {transactionUtils.formatTime(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Tag className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <IconRenderer
                      iconName={transaction.category.icon}
                      size="sm"
                      bgColor={transaction.category.bgColor}
                      color={transaction.category.color}
                    />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {transaction.category.name}
                    </span>
                  </div>
                </div>

                {transaction.type !== 'transfer' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Wallet className="h-4 w-4" />
                      <span>Account</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AccountAvatar account={transaction.account} size="sm" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {transaction.account.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Show transfer accounts for transfer transactions */}
              {transaction.type === 'transfer' && transaction.toAccount && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Wallet className="h-4 w-4" />
                      <span>From</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AccountAvatar account={transaction.account} size="sm" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {transaction.account.name}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                      <Wallet className="h-4 w-4" />
                      <span>To</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AccountAvatar account={transaction.toAccount} size="sm" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {transaction.toAccount.name}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {transaction.person?.name && (
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <User className="h-4 w-4" />
                    <span>Person</span>
                  </div>
                  <div className="flex items-center justify-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={transaction.person?.avatar?.url} alt={transaction.person?.name} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-1 flex-col">
                      <span className="font-semibold tracking-tight">{transaction.person?.name}</span>
                      <span className="text-muted-foreground text-sm leading-none">{transaction.person?.email}</span>
                    </div>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-8 w-8 rounded-full border border-slate-200 bg-white/70 p-2 dark:border-slate-700 dark:bg-slate-800/70"
                      onClick={() => navigate(`/people/${transaction.person?.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Tag className="h-4 w-4" />
                  <span>Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {transaction.tags.map((tag) => (
                    <TagChip
                      name={tag.name}
                      iconName={tag.icon}
                      bgColor={tag.bgColor}
                      color={tag.color}
                      size="xs"
                      key={tag.id}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Description & Notes */}
          <Card className="border-slate-200 bg-white/70 p-0 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Additional Information</h3>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <FileText className="h-4 w-4" />
                  <span>Note</span>
                </div>
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white">
                  {transaction.note}
                </p>
              </div>

              {/* Attachments */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                    <Paperclip className="h-4 w-4" />
                    <span>Attachments</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {transaction.attachments?.map((attachment, index) => (
                    <div
                      key={index}
                      className="cursor-pointer rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {attachment.type === 'image' ? (
                        <div className="flex h-full flex-col items-center justify-center gap-2">
                          <img
                            src={attachment.url || '/placeholder.svg'}
                            alt={attachment.name}
                            className="h-20 w-full rounded object-cover"
                          />
                          <div className="flex max-w-full flex-col items-center gap-1 overflow-hidden">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="max-w-full truncate text-xs font-medium text-slate-900 dark:text-white">
                                  {attachment.name}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>{attachment.name}</TooltipContent>
                            </Tooltip>
                            {Number(attachment.size) > 0 && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {transactionUtils.formatFileSize(attachment.size)}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2">
                          <div className="flex h-20 w-20 items-center justify-center rounded bg-red-100 dark:bg-red-900">
                            <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div className="flex max-w-full flex-col items-center gap-1 overflow-hidden">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="max-w-full truncate text-xs font-medium text-slate-900 dark:text-white">
                                  {attachment.name}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent>{attachment.name}</TooltipContent>
                            </Tooltip>
                            {Number(attachment.size) > 0 && (
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {transactionUtils.formatFileSize(attachment.size)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!transaction && (
        <div className="flex h-full items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Transaction not found</p>
        </div>
      )}
    </TabsLayout>
  );
};

export default TransactionDetails;
