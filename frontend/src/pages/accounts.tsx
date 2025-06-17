import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TabsLayout from '@/layouts/tabs';
import { accounts } from '@/data/dummy-data';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

const Accounts = () => {
  return (
    <TabsLayout
      header={{
        title: 'Accounts',
        description: 'Manage your accounts',
        rightActions: (
          <Button variant="outline" size="icon" className="rounded-full">
            <Plus className="h-4 w-4" />
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
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: account.bgColor,
                      color: account.color,
                    }}
                  >
                    <DynamicIcon name={account.icon as IconName} className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">{account.name}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${account.name}"?`)) {
                        // onDeleteAccount(account.id)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
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

export default Accounts;
