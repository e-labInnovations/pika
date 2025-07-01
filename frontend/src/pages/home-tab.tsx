import TabsLayout from '@/layouts/tabs';
import { weeklyExpenses } from '@/data/dummy-data';
import Accounts from '@/components/home-tab/accounts';
import ExpensesThisWeek from '@/components/home-tab/expenses-this-week';
import MonthlySummary from '@/components/home-tab/monthly-summary';
import { useLookupStore } from '@/store/useLookupStore';

const HomeTab = () => {
  const accounts = useLookupStore((state) => state.accounts);

  return (
    <TabsLayout
      header={{
        title: 'Home',
        description: 'Your financial overview',
      }}
    >
      <Accounts accounts={accounts} />
      <ExpensesThisWeek weeklyExpenses={weeklyExpenses} />
      <MonthlySummary />
    </TabsLayout>
  );
};

export default HomeTab;
