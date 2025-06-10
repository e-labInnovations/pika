import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { IconRenderer } from "@/components/icon-renderer";
import type { Account } from "@/data/dummy-data";

interface AccountsProps {
  accounts: Account[];
}
const Accounts = ({ accounts }: AccountsProps) => {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Accounts
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-emerald-600 dark:text-emerald-400"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 ${account.color} rounded-full flex items-center justify-center`}
                  >
                    <IconRenderer
                      iconName={account.icon}
                      className="w-5 h-5 text-white"
                    />
                  </div>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {account.name}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    account.balance >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  $
                  {Math.abs(account.balance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Balance</span>
            <span className="text-xl font-bold">
              $
              {totalBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Accounts;
