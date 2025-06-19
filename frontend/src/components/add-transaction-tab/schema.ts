import { z } from 'zod';

// Individual field schemas for validation
const titleSchema = z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters').trim();
const amountSchema = z.number().min(0.01, 'Amount must be greater than 0');
const dateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine((date) => !isNaN(Date.parse(date)), 'Invalid date format');

export const transactionFormSchema = z
  .object({
    title: titleSchema,
    amount: amountSchema,
    date: dateSchema,
    type: z.enum(['income', 'expense', 'transfer']),
    category: z.string().min(1, 'Category is required'),
    account: z.string().min(1, 'Please select an account or create one if none exists'),
    toAccount: z.string().nullable(),
    person: z.string().nullable(),
    tags: z.array(z.string()).max(10, 'Maximum 10 tags allowed'),
    note: z.string().max(1000, 'Note must be less than 1000 characters').optional().default(''),
  })
  .refine(
    (data) => {
      if (data.type === 'transfer' && !data.toAccount) {
        return false;
      }
      return true;
    },
    {
      message: 'To account is required for transfers',
      path: ['toAccount'],
    },
  );

export type TransactionFormSchema = z.infer<typeof transactionFormSchema>;

// Validation functions for specific fields
export const validateAmount = (amount: number) => {
  const result = amountSchema.safeParse(amount);
  return result.success ? null : result.error.errors[0].message;
};

export const validateTitle = (title: string) => {
  const result = titleSchema.safeParse(title);
  return result.success ? null : result.error.errors[0].message;
};

export const validateDate = (date: string) => {
  const result = dateSchema.safeParse(date);
  return result.success ? null : result.error.errors[0].message;
};

// Complete form validation
export const validateTransactionForm = (data: TransactionFormSchema) => {
  const result = transactionFormSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      errors: result.error.errors.reduce(
        (acc, error) => {
          const field = error.path.join('.');
          acc[field] = error.message;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
  }
};
