import { useEffect, useState } from 'react';
import TabsLayout from '@/layouts/tabs';
import Accounts from '@/components/home-tab/accounts';
import ExpensesThisWeek from '@/components/home-tab/expenses-this-week';
import MonthlySummary from '@/components/home-tab/monthly-summary';
import DailyCalendar from '@/components/home-tab/daily-calendar';
import MonthNavigator from '@/components/home-tab/month-navigator';
import { Separator } from '@/components/ui/separator';
import { useLookupStore } from '@/store/useLookupStore';
import { useNavigate, useSearchParams } from 'react-router-dom';

const HomeTab = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accounts = useLookupStore((state) => state.accounts);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const month = Number(searchParams.get('month'));
  const year = Number(searchParams.get('year'));

  useEffect(() => {
    if (month && year && month > 0 && year > 2000 && month <= 12) {
      const date = new Date(`${year}-${month}-01`);
      setSelectedDate(date);
    }
  }, [month, year]);

  const handleChangeDate = (action: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (action === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);

    const presentDate = new Date();
    if (presentDate.getMonth() !== newDate.getMonth() || presentDate.getFullYear() !== newDate.getFullYear()) {
      navigate(`/?month=${newDate.getMonth() + 1}&year=${newDate.getFullYear()}`, { replace: true });
    } else {
      navigate(`/`, { replace: true });
    }
  };

  return (
    <TabsLayout
      header={{
        title: 'Home',
        description: 'Your financial overview',
      }}
    >
      <div className="flex flex-col gap-4">
        <Accounts accounts={accounts} />
        <ExpensesThisWeek />

        <Separator className="my-4" />

        <MonthNavigator selectedDate={selectedDate} onChangeDate={handleChangeDate} />

        <DailyCalendar selectedDate={selectedDate} />

        <MonthlySummary selectedDate={selectedDate} />
      </div>
    </TabsLayout>
  );
};

export default HomeTab;
