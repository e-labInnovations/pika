import HeaderRightActions from '@/components/add-transaction-tab/header-right-actions';
import ScanReceipt from '@/components/add-transaction-tab/scan-receipt';
import TransactionTypeSelector from '@/components/add-transaction-tab/transaction-type-selector';
import type { TransactionFormData } from '@/components/add-transaction-tab/types';
import { type AnalysisOutput } from '@/data/dummy-data';
import TabsLayout from '@/layouts/tabs';
import { useState } from 'react';
import BasicInfo from '@/components/add-transaction-tab/basic-info';
import CategoryAccount from '@/components/add-transaction-tab/category-account';
import Person from '@/components/add-transaction-tab/person';
import type { Attachment } from '@/components/add-transaction-tab/types';
import Attachments from '@/components/add-transaction-tab/attachments';
import Tags from '@/components/add-transaction-tab/tags';
import Note from '@/components/add-transaction-tab/note';
import { Button } from '@/components/ui/button';
import type { TransactionType } from '@/data/types';
import { validateTransactionForm } from '@/components/add-transaction-tab/schema';
import { toast } from 'sonner';

const AddTransactionTab = () => {
  const [openAiReceiptScanner, setOpenAiReceiptScanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const handleTransactionDetails = (transaction: AnalysisOutput) => {
    console.log(transaction);
  };

  const handleTypeChange = (type: TransactionType) => {
    const defaultCategoryByType = {
      expense: '1',
      income: '10',
      transfer: '16',
    };
    setFormData((prev) => ({ ...prev, type, category: defaultCategoryByType[type] }));

    // TODO: Handle account and person selection
    // if (type === 'expense' || type === 'income') {
    //   setFormData((prev) => ({ ...prev, toAccount: null }));
    // } else {
    //   setFormData((prev) => ({ ...prev, person: null }));
    // }
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

      toast.success('Transaction saved successfully!');

      // Reset form
      setFormData({
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
      setAttachments([]);
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error('Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TabsLayout
      header={{
        title: 'Add Transaction',
        description: 'Add a new transaction',
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

      <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Transaction'}
      </Button>

      <ScanReceipt
        open={openAiReceiptScanner}
        setOpen={setOpenAiReceiptScanner}
        handleTransactionDetails={handleTransactionDetails}
      />
    </TabsLayout>
  );
};

export default AddTransactionTab;
