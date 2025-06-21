import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import MoneyInput from '@/components/money-input';

interface InitialBalanceSectionProps {
  includeInitialBalance: boolean;
  initialBalance: number;
  onIncludeInitialBalanceChange: (include: boolean) => void;
  onInitialBalanceChange: (balance: number) => void;
}

const InitialBalanceSection = ({
  includeInitialBalance,
  initialBalance,
  onIncludeInitialBalanceChange,
  onInitialBalanceChange,
}: InitialBalanceSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="initial-balance" checked={includeInitialBalance} onCheckedChange={onIncludeInitialBalanceChange} />
        <Label htmlFor="initial-balance">Include Initial Balance</Label>
      </div>

      {includeInitialBalance && (
        <div className="space-y-2">
          <MoneyInput
            value={initialBalance}
            onChange={onInitialBalanceChange}
            id="balance"
            labelText="Initial Balance"
            className="text-xl font-bold"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This will create a system transaction to set the initial balance for this account.
          </p>
        </div>
      )}
    </div>
  );
};

export default InitialBalanceSection;
