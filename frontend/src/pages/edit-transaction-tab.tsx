import HeaderRightActions from '@/components/add-transaction-tab/header-right-actions';
import ScanReceipt from '@/components/add-transaction-tab/scan-receipt';
import TransactionTypeSelector from '@/components/add-transaction-tab/transaction-type-selector';
import type { TransactionFormData } from '@/components/add-transaction-tab/types';
import TabsLayout from '@/layouts/tabs';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicInfo from '@/components/add-transaction-tab/basic-info';
import CategoryAccount from '@/components/add-transaction-tab/category-account';
import PersonView from '@/components/add-transaction-tab/person';
import Attachments from '@/components/add-transaction-tab/attachments';
import Tags from '@/components/add-transaction-tab/tags';
import Note from '@/components/add-transaction-tab/note';
import { Button } from '@/components/ui/button';
import { type TransactionType } from '@/lib/transaction-utils';
import { validateTransactionForm } from '@/components/add-transaction-tab/schema';
import {
  transactionsService,
  type AnalyzedTransactionData,
  type TransactionInput,
  type UploadResponse,
} from '@/services/api';
import { toast } from 'sonner';
import { queryUtils } from '@/hooks/query-utils';
import { useCategories } from '@/hooks/queries';
import { runWithLoaderAndError } from '@/lib/utils';
import AsyncStateWrapper from '@/components/async-state-wrapper';

const EditTransactionTab = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: categories = [] } = useCategories();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  const [openAiReceiptScanner, setOpenAiReceiptScanner] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TransactionFormData>({
    title: '',
    amount: 0,
    date: new Date().toISOString(),
    type: 'expense',
    category: queryUtils.getDefaultCategory(categories, 'expense')?.id ?? '',
    account: '',
    toAccount: null,
    person: null,
    tags: [],
    note: '',
  });

  const [attachments, setAttachments] = useState<UploadResponse[]>([]);

  // Load transaction data on component mount
  useEffect(() => {
    if (id) {
      fetchTransaction();
    } else {
      setError(new Error('Transaction not found'));
    }
  }, [id, navigate]);

  const fetchTransaction = () => {
    setIsLoading(true);
    setError(null);
    transactionsService
      .get(id!)
      .then((response) => {
        setFormData({
          title: response.data.title,
          amount: Number(response.data.amount),
          date: response.data.date,
          type: response.data.type,
          category: response.data.category.id,
          account: response.data.account.id,
          toAccount: response.data.toAccount?.id || null,
          person: response.data.person?.id || null,
          tags: response.data.tags.map((tag) => tag.id),
          note: response.data.note,
        });
        setAttachments(response.data.attachments);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTransactionDetails = (transaction: AnalyzedTransactionData) => {
    console.log('AI Analysis Result:', transaction);

    // Populate form data with AI analysis results
    setFormData((prev) => ({
      ...prev,
      title: transaction.title,
      amount: transaction.amount,
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
    setFormData((prev) => ({ ...prev, type, category: queryUtils.getDefaultCategory(categories, type)?.id ?? '' }));

    // Clear toAccount for non-transfer transactions
    if (type !== 'transfer') {
      setFormData((prev) => ({ ...prev, toAccount: null }));
    }
  };

  const handleSubmit = async () => {
    setFormErrors({});

    runWithLoaderAndError(
      async () => {
        // Validate form data
        const validation = validateTransactionForm(formData);

        if (!validation.success) {
          setFormErrors(validation.errors || {});
          toast.error('Please fix the form errors');
          return;
        }

        // Prepare transaction input
        const transactionInput: TransactionInput = {
          title: formData.title,
          amount: formData.amount,
          date: formData.date,
          type: formData.type,
          categoryId: formData.category,
          accountId: formData.account,
          personId: formData.person || null,
          toAccountId: formData.toAccount || null,
          note: formData.note,
          tags: formData.tags,
          attachments: attachments.map((attachment) => attachment.id),
        };

        await transactionsService.update(id || '', transactionInput);
        navigate(`/transactions/${id}`, { replace: true });
      },
      {
        loaderMessage: 'Updating transaction...',
        successMessage: 'Transaction updated successfully',
      },
    );
  };

  return (
    <TabsLayout
      header={{
        title: 'Edit Transaction',
        description: 'Update transaction details',
        linkBackward: `/transactions/${id}`,
        rightActions: <HeaderRightActions handleScanReceipt={() => setOpenAiReceiptScanner(true)} />,
      }}
    >
      <AsyncStateWrapper isLoading={isLoading} error={error} linkBackward="/transactions" onRetry={fetchTransaction}>
        <TransactionTypeSelector value={formData.type} onChange={handleTypeChange} />
        <BasicInfo formData={formData} setFormData={setFormData} />
        <CategoryAccount formData={formData} setFormData={setFormData} />
        {formData.type !== 'transfer' && <PersonView formData={formData} setFormData={setFormData} />}
        <Attachments attachments={attachments} setAttachments={setAttachments} />
        <Tags formData={formData} setFormData={setFormData} />
        <Note formData={formData} setFormData={setFormData} />

        {/* Display validation errors */}
        {Object.keys(formErrors).length > 0 && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <h3 className="mb-2 text-sm font-medium text-red-800 dark:text-red-200">
              Please fix the following errors:
            </h3>
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
          <Button onClick={handleSubmit} className="flex-1">
            Update Transaction
          </Button>
        </div>

        <ScanReceipt
          open={openAiReceiptScanner}
          setOpen={setOpenAiReceiptScanner}
          handleTransactionDetails={handleTransactionDetails}
        />
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default EditTransactionTab;
