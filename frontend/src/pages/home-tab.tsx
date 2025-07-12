import { useState } from 'react';
import TabsLayout from '@/layouts/tabs';
import Accounts from '@/components/home-tab/accounts';
import ExpensesThisWeek from '@/components/home-tab/expenses-this-week';
import MonthlySummary from '@/components/home-tab/monthly-summary';
import DailyCalendar from '@/components/home-tab/daily-calendar';
import MonthNavigator from '@/components/home-tab/month-navigator';
import { Separator } from '@/components/ui/separator';
import { useLookupStore } from '@/store/useLookupStore';

const HomeTab = () => {
  const accounts = useLookupStore((state) => state.accounts);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleChangeDate = (action: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (action === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  return (
    <TabsLayout
      header={{
        title: 'Home',
        description: 'Your financial overview',
      }}
    >
      <Accounts accounts={accounts} />
      <ExpensesThisWeek />

      <Separator className="my-4" />

      <MonthNavigator selectedDate={selectedDate} onChangeDate={handleChangeDate} />

      <DailyCalendar selectedDate={selectedDate} />

      <MonthlySummary />
    </TabsLayout>
  );
};

export default HomeTab;
