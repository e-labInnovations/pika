import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { DynamicIcon } from '@/components/lucide';
import AccountAvatar from '@/components/account-avatar';
import { useNavigate } from 'react-router-dom';
import { cn, runWithLoaderAndError } from '@/lib/utils';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { type Account } from '@/services/api';
import { useAccounts, useAccountMutations } from '@/hooks/queries';
import { useConfirmDialog } from '@/store/useConfirmDialog';

const AccountsSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: accounts = [] } = useAccounts();
  const { deleteAccount } = useAccountMutations();

  const handleDeleteAccount = async (account: Account) => {
    useConfirmDialog.getState().open({
      title: 'Delete Account',
      message: `Are you sure you want to delete "${account.name}"?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await deleteAccount.mutateAsync(account.id);
          },
          {
            loaderMessage: 'Deleting account...',
            successMessage: 'Account deleted successfully',
          },
        );
      },
    });
  };

  return (
    <TabsLayout
      header={{
        title: 'Accounts',
        description: 'Manage your accounts',
        rightActions: (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => navigate('/settings/accounts/add')}
          >
            <DynamicIcon name="plus" className="h-4 w-4" />
          </Button>
        ),
        linkBackward: '/settings',
      }}
    >
      <div className="flex flex-col gap-2">
        {accounts.map((account) => (
          <Card key={account.id} className="p-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AccountAvatar account={account} size="md" />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">{account.name}</span>
                    <p className="text-muted-foreground text-sm">{account.description}</p>
                    <p className={cn('text-xs', transactionUtils.getBalanceColor(account.balance))}>
                      {currencyUtils.formatAmount(account.balance, user?.settings.currency)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/settings/accounts/${account.id}/edit`)}>
                    <DynamicIcon name="edit-2" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleDeleteAccount(account);
                    }}
                  >
                    <DynamicIcon name="trash-2" className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsLayout>
  );
};

export default AccountsSettings;
