import { ImageIcon, Sparkles, X, CheckCircle2, ArrowBigRightDash } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '../ui/card';
import { useState } from 'react';
import { format } from 'date-fns';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { IconRenderer } from '../icon-renderer';
import { aiService, mockTransactionData, type AnalyzedTransactionData } from '@/services/api';
import { currencyUtils } from '@/lib/currency-utils';
import transactionUtils from '@/lib/transaction-utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AccountAvatar from '../account-avatar';
import { TagChip } from '../tag-chip';
import { getInitials } from '@/lib/utils';
import { CategoryTransactionIcon } from '../category-transaction-icon';

const TABS = [
  { id: 'text', label: 'Text' },
  { id: 'receipt', label: 'Receipt' },
];

interface ScanReceiptProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleTransactionDetails: (transaction: AnalyzedTransactionData) => void;
}

const ScanReceipt = ({ open, setOpen, handleTransactionDetails }: ScanReceiptProps) => {
  const [selectedTab, setSelectedTab] = useState<'text' | 'receipt'>('text');
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisOutput, setAnalysisOutput] = useState<AnalyzedTransactionData | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleClose = () => {
    setSelectedReceipt(null);
    setIsScanning(false);
    setPreviewUrl(null);
    setAnalysisOutput(null);
    setTextInput('');
    setIsSending(false);
    setSelectedTab('text');
    setOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedReceipt(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = () => {
    setIsScanning(true);
    // TODO: Implement receipt analysis
    setTimeout(() => {
      setIsScanning(false);
      setAnalysisOutput(mockTransactionData);
    }, 4000);
  };

  const handleSendText = () => {
    setIsSending(true);
    aiService.analyzeText(textInput).then((response) => {
      setIsSending(false);
      console.log(response.data);
      setAnalysisOutput(response.data);
    });
  };

  const handleUseDetails = () => {
    if (analysisOutput) {
      handleTransactionDetails(analysisOutput);
    }
    handleClose();
  };

  const handleRejectSuggestion = () => {
    setAnalysisOutput(null);
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="h-[60%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="flex w-full items-center gap-2">
            <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
            AI Transaction Extractor
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4">
          {/* Tabs */}
          <div className="mb-2 flex gap-2 border-b">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`px-4 py-2 font-medium transition-colors ${selectedTab === tab.id ? 'border-b-2 border-purple-500 text-purple-600' : 'text-muted-foreground'}`}
                onClick={() => {
                  setSelectedTab(tab.id as 'text' | 'receipt');
                  setAnalysisOutput(null);
                  setSelectedReceipt(null);
                  setPreviewUrl(null);
                  setTextInput('');
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Text Tab */}
          {selectedTab === 'text' && !analysisOutput && (
            <div className="flex flex-col gap-3">
              <textarea
                className="focus-visible:border-ring focus-visible:ring-ring/50 border-input min-h-[100px] w-full rounded-md border px-3 py-2 text-base focus-visible:ring-[3px]"
                placeholder="Paste or type receipt text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isSending}
              />
            </div>
          )}

          {/* Receipt Tab */}
          {selectedTab === 'receipt' && !selectedReceipt && !analysisOutput && (
            <div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
              <label htmlFor="image-upload">
                <Card className="border-border hover:border-primary cursor-pointer border-2 border-dashed transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-6 text-center">
                    <ImageIcon className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
                    <h3 className="font-medium">Select Image</h3>
                    <p className="text-muted-foreground mt-1 text-sm">Choose a receipt image from your device</p>
                  </CardContent>
                </Card>
              </label>
            </div>
          )}

          {/* Receipt Preview and Analyze */}
          {selectedTab === 'receipt' && selectedReceipt && !analysisOutput && (
            <div className="space-y-4">
              <div className="relative mx-auto w-full max-w-sm">
                <img
                  src={previewUrl || ''}
                  alt="Receipt preview"
                  className="h-[75%] max-h-[200px] w-full rounded-lg object-contain"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-background/80 absolute top-2 right-2 backdrop-blur-sm"
                  onClick={() => {
                    setSelectedReceipt(null);
                    setPreviewUrl(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">{selectedReceipt.name}</p>
              </div>
            </div>
          )}

          {/* Analysis Output */}
          {analysisOutput && (
            <div className="space-y-4">
              <Card className="p-0 transition-all duration-200">
                <CardContent className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-1 items-center space-x-3">
                      <CategoryTransactionIcon
                        transactionType={analysisOutput.type}
                        iconName={analysisOutput.category.icon}
                        size="md"
                        bgColor={analysisOutput.category.bgColor}
                        color={analysisOutput.category.color}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="truncate font-medium text-slate-900 dark:text-white">
                            {analysisOutput.title}
                          </h4>
                          <span className={`font-semibold ${transactionUtils.getAmountColor(analysisOutput.type)}`}>
                            {currencyUtils.formatAmount(analysisOutput.amount, 'USD')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex grow flex-col gap-2">
                            <div className="mt-1 flex items-center space-x-2">
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {transactionUtils.formatDateTime(analysisOutput.date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {analysisOutput.account && (
                                <>
                                  <AccountAvatar account={analysisOutput.account} size="xs" />
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {analysisOutput.account.name}
                                  </span>
                                </>
                              )}
                              {analysisOutput.toAccount && (
                                <>
                                  <ArrowBigRightDash className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                  <AccountAvatar account={analysisOutput.toAccount} size="xs" />
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {analysisOutput.toAccount.name}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {analysisOutput.person && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={analysisOutput.person?.avatar?.url}
                                  alt={analysisOutput.person?.name}
                                />
                                <AvatarFallback className="bg-emerald-500 font-semibold text-white">
                                  {getInitials(analysisOutput.person?.name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {analysisOutput.tags.map((tag) => (
                            <div key={tag.id}>
                              <TagChip
                                name={tag.name}
                                iconName={tag.icon}
                                bgColor={tag.bgColor}
                                color={tag.color}
                                size="xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {analysisOutput.note && (
                <div className="text-muted-foreground mt-3 text-sm">
                  <p className="mb-1 font-medium">Note</p>
                  <p>{analysisOutput.note}</p>
                </div>
              )}
              <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>AI Analysis Complete</span>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="flex flex-row gap-2">
          {analysisOutput && !isSending && (
            <Button variant="outline" className="w-1/2" onClick={handleRejectSuggestion}>
              Reject Suggestion
            </Button>
          )}
          <DrawerClose className="w-1/2 grow">
            {!analysisOutput && (
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            )}
          </DrawerClose>
          {/* Text Tab Send Button (footer) */}
          {selectedTab === 'text' && !analysisOutput && (
            <Button
              className="w-1/2 border-none bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              onClick={handleSendText}
              disabled={!textInput.trim() || isSending}
            >
              {isSending ? 'Analyzing...' : 'Send'}
            </Button>
          )}
          {/* Receipt Tab Analyze Button (footer) */}
          {selectedTab === 'receipt' && selectedReceipt && !analysisOutput && (
            <Button
              className="w-1/2 border-none bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              onClick={handleAnalyze}
              disabled={isScanning}
            >
              {isScanning ? 'Analyzing...' : 'Analyze Receipt'}
            </Button>
          )}
          {/* Use Details Button (footer) */}
          {analysisOutput && (
            <Button
              className="w-1/2 border-none bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              onClick={handleUseDetails}
            >
              Use Details
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ScanReceipt;
