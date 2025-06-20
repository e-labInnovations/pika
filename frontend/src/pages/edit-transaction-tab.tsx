import HeaderRightActions from '@/components/add-transaction-tab/header-right-actions';
import ScanReceipt from '@/components/add-transaction-tab/scan-receipt';
import TransactionTypeSelector from '@/components/add-transaction-tab/transaction-type-selector';
import type { TransactionFormData } from '@/components/add-transaction-tab/types';
import { type AnalysisOutput, transactions, type Transaction } from '@/data/dummy-data';
import TabsLayout from '@/layouts/tabs';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicInfo from '@/components/add-transaction-tab/basic-info';
import CategoryAccount from '@/components/add-transaction-tab/category-account';
import Person from '@/components/add-transaction-tab/person';
import type { Attachment } from '@/components/add-transaction-tab/types';
import Attachments from '@/components/add-transaction-tab/attachments';
import Tags from '@/components/add-transaction-tab/tags';
import Note from '@/components/add-transaction-tab/note';
import { Button } from '@/components/ui/button';
import { type TransactionType } from '@/lib/transaction-utils';
import { validateTransactionForm } from '@/components/add-transaction-tab/schema';
import { toast } from 'sonner';

const EditTransactionTab = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [openAiReceiptScanner, setOpenAiReceiptScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: 0,
    date: new Date().toISOString(),
    type: 'expense',
    category: '1',
    account: '1',
    toAccount: null,
    person: null,
    tags: [],
    note: '',
  });

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // Load transaction data on component mount
  useEffect(() => {
    if (id) {
      const foundTransaction = transactions.find((t) => t.id === id);
      if (foundTransaction) {
        setTransaction(foundTransaction);

        // Convert transaction data to form data
        setFormData({
          title: foundTransaction.title,
          amount: Math.abs(foundTransaction.amount),
          date: foundTransaction.date,
          type: foundTransaction.type,
          category: foundTransaction.category.id,
          account: foundTransaction.account.id,
          toAccount: foundTransaction.toAccount?.id || null,
          person: foundTransaction.person?.id || null,
          tags: foundTransaction.tags.map((tag) => tag.id),
          note: foundTransaction.note,
        });

        // Convert attachments
        if (foundTransaction.attachments) {
          setAttachments(
            foundTransaction.attachments.map((att) => ({
              id: att.id,
              name: att.name,
              url: att.url,
              type: att.type,
              size: 0, // Default size for existing attachments
            })),
          );
        }
      } else {
        toast.error('Transaction not found');
        navigate('/transactions');
      }
    }
  }, [id, navigate]);

  const handleTransactionDetails = (transaction: AnalysisOutput) => {
    console.log('AI Analysis Result:', transaction);

    // Populate form data with AI analysis results
    setFormData((prev) => ({
      ...prev,
      title: transaction.title,
      amount: transaction.total,
      date: new Date(transaction.date).toISOString(),
      type: transaction.category.type, // Use category type to determine transaction type
      category: transaction.category.id,
      tags: transaction.tags.map((tag) => tag.id),
      note: transaction.note,
    }));

    // Show success message
    toast.success('Receipt data filled automatically!');
  };

  const handleTypeChange = (type: TransactionType) => {
    const defaultCategoryByType = {
      expense: '1',
      income: '10',
      transfer: '16',
    };
    setFormData((prev) => ({ ...prev, type, category: defaultCategoryByType[type] }));

    // Clear toAccount for non-transfer transactions
    if (type !== 'transfer') {
      setFormData((prev) => ({ ...prev, toAccount: null }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Validate form data
      const validation = validateTransactionForm(formData);

      if (!validation.success) {
        setFormErrors(validation.errors || {});
        toast.error('Please fix the form errors');
        return;
      }

      // TODO: Submit to API
      console.log('Validated form data:', validation.data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Transaction updated successfully!');

      // Navigate back to transaction details
      navigate(`/transactions/${id}`);
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!transaction) {
    return (
      <TabsLayout
        header={{
          title: 'Edit Transaction',
          description: 'Loading transaction...',
          linkBackward: '/transactions',
        }}
      >
        <div className="py-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">Loading...</p>
        </div>
      </TabsLayout>
    );
  }

  return (
    <TabsLayout
      header={{
        title: 'Edit Transaction',
        description: 'Update transaction details',
        linkBackward: `/transactions/${id}`,
        rightActions: <HeaderRightActions handleScanReceipt={() => setOpenAiReceiptScanner(true)} />,
      }}
    >
      <TransactionTypeSelector value={formData.type} onChange={handleTypeChange} />
      <BasicInfo formData={formData} setFormData={setFormData} />
      <CategoryAccount formData={formData} setFormData={setFormData} />
      {formData.type !== 'transfer' && <Person formData={formData} setFormData={setFormData} />}
      <Attachments attachments={attachments} setAttachments={setAttachments} />
      <Tags formData={formData} setFormData={setFormData} />
      <Note formData={formData} setFormData={setFormData} />

      {/* Display validation errors */}
      {Object.keys(formErrors).length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <h3 className="mb-2 text-sm font-medium text-red-800 dark:text-red-200">Please fix the following errors:</h3>
          <ul className="space-y-1 text-sm text-red-700 dark:text-red-300">
            {Object.entries(formErrors).map(([field, error]) => (
              <li key={field}>
                • {field}: {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex space-x-2">
        <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Updating...' : 'Update Transaction'}
        </Button>
      </div>

      <ScanReceipt
        open={openAiReceiptScanner}
        setOpen={setOpenAiReceiptScanner}
        handleTransactionDetails={handleTransactionDetails}
      />
    </TabsLayout>
  );
};

export default EditTransactionTab;
