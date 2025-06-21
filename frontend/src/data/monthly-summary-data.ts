export interface MonthlyData {
  month: string;
  year: number;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

export const generateMonthlySummaryData = (): MonthlyData[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthlyData: MonthlyData[] = [];

  // Generate data for current month and 5 previous months
  for (let i = 5; i >= 0; i--) {
    const targetMonth = (currentMonth - i + 12) % 12;
    const targetYear = currentYear - Math.floor((i - currentMonth) / 12);

    // Generate realistic random data
    const baseIncome = 3500 + Math.random() * 2000; // $3500-$5500
    const baseExpenses = 2800 + Math.random() * 1500; // $2800-$4300

    // Add some seasonal variation
    const seasonalFactor = 1 + 0.2 * Math.sin((targetMonth / 12) * 2 * Math.PI);
    const income = Math.round(baseIncome * seasonalFactor);
    const expenses = Math.round(baseExpenses * seasonalFactor);

    monthlyData.push({
      month: monthNames[targetMonth],
      year: targetYear,
      income,
      expenses,
      balance: income - expenses,
      transactionCount: Math.floor(15 + Math.random() * 25), // 15-40 transactions
    });
  }

  return monthlyData;
};

// Pre-generated data for consistent testing
export const monthlySummaryData: MonthlyData[] = [
  {
    month: 'June',
    year: 2024,
    income: 4200,
    expenses: 3100,
    balance: 1100,
    transactionCount: 28,
  },
  {
    month: 'July',
    year: 2024,
    income: 4800,
    expenses: 3400,
    balance: 1400,
    transactionCount: 32,
  },
  {
    month: 'August',
    year: 2024,
    income: 5200,
    expenses: 3800,
    balance: 1400,
    transactionCount: 35,
  },
  {
    month: 'September',
    year: 2024,
    income: 4500,
    expenses: 3200,
    balance: 1300,
    transactionCount: 29,
  },
  {
    month: 'October',
    year: 2024,
    income: 4100,
    expenses: 2900,
    balance: 1200,
    transactionCount: 26,
  },
  {
    month: 'November',
    year: 2024,
    income: 3800,
    expenses: 2700,
    balance: 1100,
    transactionCount: 24,
  },
];
