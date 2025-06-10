import TabsLayout from "@/layouts/tabs";
import { transactions, accounts } from "@/data/dummy-data";
import Accounts from "@/components/home-tab/accounts";
import ExpensesThisWeek from "@/components/home-tab/expenses-this-week";
import MonthlySummary from "@/components/home-tab/monthly-summary";

const HomeTab = () => {
  const weeklyExpenses = [
    { day: "Mon", amount: 45.5 },
    { day: "Tue", amount: 120.0 },
    { day: "Wed", amount: 85.25 },
    { day: "Thu", amount: 200.0 },
    { day: "Fri", amount: 95.75 },
    { day: "Sat", amount: 180.5 },
    { day: "Sun", amount: 65.0 },
  ];

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
