import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EyeIcon, EyeOff, Wallet } from "lucide-react";
import type { Account } from "@/data/dummy-data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

interface AccountsProps {
  accounts: Account[];
}
const Accounts = ({ accounts }: AccountsProps) => {
  const [showMoney, setShowMoney] = useState(false);

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
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={() => setShowMoney(!showMoney)}
        >
          {showMoney ? <EyeOff /> : <EyeIcon />}
        </Button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
        {accounts.map((account) => (
          <Card key={account.id} className="py-4">
            <CardContent className="h-full py-0 px-2">
              <div className="flex flex-col items-center justify-between gap-2 h-full">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center ",
                    account.color
                  )}
                >
                  <DynamicIcon
                    name={account.icon as IconName}
                    className="w-5 h-5 text-white"
                  />
                </div>
                <span className="text-xs md:text-sm text-center">
                  {account.name}
                </span>
                <span
                  className={`font-semibold ${
                    account.balance >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                >
                  $
                  {showMoney
                    ? Math.abs(account.balance).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })
                    : "----"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-lg p-0">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">Total Balance</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              $
              {showMoney
                ? totalBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })
                : "----"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Accounts;
