import HeaderRightActions from '@/components/add-transaction-tab/header-right-actions';
import AIAssistant from '@/components/add-transaction-tab/ai-assistant';
import TransactionTypeSelector from '@/components/add-transaction-tab/transaction-type-selector';
import type { TransactionFormData } from '@/components/add-transaction-tab/types';
import TabsLayout from '@/layouts/tabs';
import { useEffect, useState } from 'react';
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
import { queryUtils, invalidateTxRelatedQueries } from '@/hooks/query-utils';
import { useCategories } from '@/hooks/queries';
import { useWebShareTarget } from '@/hooks/use-web-share-target';
import { runWithLoaderAndError } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { DynamicIcon } from '@/components/lucide';
import { useSearchParams } from 'react-router-dom';

const AddTransactionTab = () => {
  const { data: categories = [] } = useCategories();
  const { sharedData, clearSharedData } = useWebShareTarget();
  const [openAiAssistant, setOpenAiAssistant] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [attachments, setAttachments] = useState<UploadResponse[]>([]);
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

  useEffect(() => {
    const account = searchParams.get('account');
    const toAccount = searchParams.get('toAccount');
    const person = searchParams.get('person');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const tags = searchParams.get('tags');
    const note = searchParams.get('note');
    const amount = searchParams.get('amount');
    const date = searchParams.get('date');

    if (account) {
      setFormData((prev) => ({ ...prev, account }));
    }
    if (toAccount && type !== 'transfer') {
      setFormData((prev) => ({ ...prev, toAccount }));
    }
    if (person) {
      setFormData((prev) => ({ ...prev, person }));
    }
    if (type) {
      setFormData((prev) => ({ ...prev, type: type as TransactionType }));
    }
    if (category) {
      setFormData((prev) => ({ ...prev, category }));
    }
    if (tags) {
      setFormData((prev) => ({ ...prev, tags: tags.split(',') }));
    }
    if (note) {
      setFormData((prev) => ({ ...prev, note }));
    }
    if (amount) {
      setFormData((prev) => ({ ...prev, amount: Number(amount) }));
    }
    if (date) {
      setFormData((prev) => ({ ...prev, date: new Date(Number(date)).toISOString() }));
    }
  }, [searchParams]);

  const handleTransactionDetails = (transaction: AnalyzedTransactionData) => {
    // Populate form data with AI analysis results
    setFormData((prev) => ({
      ...prev,
      title: transaction.title,
      amount: transaction.amount,
      date: new Date(transaction.date).toISOString(),
      type: transaction.category.type, // Use category type to determine transaction type
      category: transaction.category.id,
      tags: transaction.tags.map((tag) => tag.id),
      note: transaction.note || '',
      account: transaction.account?.id || '',
      toAccount: transaction.toAccount?.id || null,
      person: transaction.person?.id || null,
    }));

    // Show success message
    toast.success('Receipt data filled automatically!');
  };

  const handleTypeChange = (type: TransactionType) => {
    setFormData((prev) => ({ ...prev, type, category: queryUtils.getDefaultCategory(categories, type)?.id ?? '' }));

    // Reset toAccount and person when type changes
    setFormData((prev) => ({ ...prev, toAccount: null, person: null }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormErrors({});

    // Validate form data
    const validation = validateTransactionForm(formData);

    if (!validation.success) {
      setFormErrors(validation.errors || {});
      toast.error('Please fix the form errors');
      setIsSubmitting(false);
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

    runWithLoaderAndError(
      async () => {
        await transactionsService.create(transactionInput);
        setFormData({
          title: '',
          amount: 0,
          date: new Date().toISOString(),
          type: 'expense',
          category: queryUtils.getDefaultCategory(categories, 'expense')?.id ?? '',
          account: formData.account || '',
          toAccount: null,
          person: null,
          tags: [],
          note: '',
        });
        setAttachments([]);
      },
      {
        loaderMessage: 'Saving transaction...',
        successMessage: 'Transaction saved successfully!',
        finally: () => {
          setIsSubmitting(false);
        },
        onSuccess: () => {
          invalidateTxRelatedQueries(queryClient);
        },
      },
    );
  };

  return (
    <TabsLayout
      header={{
        title: 'Add Transaction',
        description: 'Add a new transaction',
        rightActions: <HeaderRightActions handleOpenAIAssistant={() => setOpenAiAssistant(true)} />,
      }}
      bottom={{
        child: (
          <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
            <DynamicIcon name="save" className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Saving...' : 'Save Transaction'}
          </Button>
        ),
      }}
    >
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

      <AIAssistant
        open={openAiAssistant}
        setOpen={setOpenAiAssistant}
        handleTransactionDetails={handleTransactionDetails}
        sharedData={sharedData}
        onClearSharedData={clearSharedData}
      />
    </TabsLayout>
  );
};

export default AddTransactionTab;
