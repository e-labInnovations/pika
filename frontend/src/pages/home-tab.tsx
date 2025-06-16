import TabsLayout from "@/layouts/tabs";
import { transactions, accounts, weeklyExpenses } from "@/data/dummy-data";
import Accounts from "@/components/home-tab/accounts";
import ExpensesThisWeek from "@/components/home-tab/expenses-this-week";
import MonthlySummary from "@/components/home-tab/monthly-summary";

const HomeTab = () => {
  return (
    <TabsLayout
      header={{
        title: "Home",
        description: "Your financial overview",
      }}
    >
      <Accounts accounts={accounts} />
      <ExpensesThisWeek weeklyExpenses={weeklyExpenses} />
      <MonthlySummary transactions={transactions} />
    </TabsLayout>
  );
};

export default HomeTab;
