import { DynamicIcon } from '@/components/lucide';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '../ui/card';
import { useState } from 'react';
import { aiService, type AnalyzedTransactionData } from '@/services/api';
import AnalysisOutput from './ai-transaction/analysis-output';
import { cn, runWithLoaderAndError } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

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
  const [base64Image, setBase64Image] = useState<string | null>(null);
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBase64Image(null);
    }
  };

  const handleAnalyze = () => {
    setIsScanning(true);
    if (base64Image) {
      runWithLoaderAndError(
        async () => {
          const response = await aiService.analyzeReceipt(base64Image);
          setAnalysisOutput(response.data);
        },
        {
          loaderMessage: 'Analyzing receipt...',
          successMessage: 'Receipt analyzed successfully',
          finally: () => {
            setIsScanning(false);
          },
        },
      );
    } else {
      toast.error('Please select a receipt image');
    }
  };

  const handleSendText = () => {
    setIsSending(true);
    aiService.analyzeText(textInput).then((response) => {
      setIsSending(false);
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

  const handleRetryAnalysis = () => {
    setAnalysisOutput(null);
    if (selectedTab === 'text') {
      handleSendText();
    } else {
      handleAnalyze();
    }
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="h-[60%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="flex w-full items-center gap-2">
            <DynamicIcon name="sparkles" className="mr-2 h-5 w-5 text-purple-500" />
            AI Transaction Extractor
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex h-full flex-col gap-4 px-4">
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
            <div className="flex h-full flex-col gap-3">
              <Textarea
                id="text-input"
                className="h-[75%] max-h-[350px] resize-none"
                placeholder="Paste or type receipt text here..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                disabled={isSending}
                rows={5}
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
                    <DynamicIcon name="image" className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
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
                  <DynamicIcon name="x" className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground text-sm">{selectedReceipt.name}</p>
              </div>
            </div>
          )}

          {/* Analysis Output */}
          {analysisOutput && <AnalysisOutput analysisOutput={analysisOutput} onRetryAnalysis={handleRetryAnalysis} />}
        </div>

        <DrawerFooter className="flex flex-row gap-2">
          {analysisOutput && !isSending && (
            <Button variant="outline" className="w-1/2" onClick={handleRejectSuggestion}>
              Reject Suggestion
            </Button>
          )}
          {!analysisOutput && (
            <Button
              variant="outline"
              className={cn('w-1/2', selectedTab === 'receipt' && !selectedReceipt && 'w-full')}
              onClick={handleClose}
            >
              Cancel
            </Button>
          )}
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
