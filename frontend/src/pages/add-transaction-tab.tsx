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

const AddTransactionTab = () => {
  const [openAiReceiptScanner, setOpenAiReceiptScanner] = useState(false);
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

  return (
    <TabsLayout
      header={{
        title: 'Add Transaction',
        description: 'Add a new transaction',
        rightActions: <HeaderRightActions handleScanReceipt={() => setOpenAiReceiptScanner(true)} />,
      }}
    >
      <TransactionTypeSelector value={formData.type} onChange={(type) => setFormData((prev) => ({ ...prev, type }))} />
      <BasicInfo formData={formData} setFormData={setFormData} />
      <CategoryAccount formData={formData} setFormData={setFormData} />
      {formData.type !== 'transfer' && <Person formData={formData} setFormData={setFormData} />}
      <Attachments attachments={attachments} setAttachments={setAttachments} />
      <Tags formData={formData} setFormData={setFormData} />
      <Note formData={formData} setFormData={setFormData} />
      <Button className="w-full" onClick={() => console.log('formData', formData)}>
        Save Transaction
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
