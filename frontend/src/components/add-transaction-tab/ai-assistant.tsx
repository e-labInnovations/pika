import { DynamicIcon } from '@/components/lucide';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '../ui/card';
import { useState, useEffect } from 'react';
import { aiService, type AnalyzedTransactionData } from '@/services/api';
import AnalysisOutput from './ai-transaction/analysis-output';
import { cn, runWithLoaderAndError } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

const TABS = [
  { id: 'text', label: 'Text' },
  { id: 'receipt', label: 'Receipt' },
];

interface AIAssistantProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleTransactionDetails: (transaction: AnalyzedTransactionData) => void;
  sharedData?: {
    title?: string;
    text?: string;
    url?: string;
    images?: File[];
  } | null;
  onClearSharedData?: () => void;
}

const AIAssistant = ({ open, setOpen, handleTransactionDetails, sharedData, onClearSharedData }: AIAssistantProps) => {
  const [selectedTab, setSelectedTab] = useState<'text' | 'receipt'>('text');
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisOutput, setAnalysisOutput] = useState<AnalyzedTransactionData | null>(null);
  const [textInput, setTextInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Handle shared data when component mounts or sharedData changes
  useEffect(() => {
    if (sharedData?.text || sharedData?.images) {
      // Reset state first
      setAnalysisOutput(null);
      setSelectedReceipt(null);
      setPreviewUrl(null);
      setTextInput('');
      setIsSending(false);
      setIsScanning(false);

      // Handle shared text
      if (sharedData.text) {
        setTextInput(sharedData.text);
        setSelectedTab('text');
      }

      // Handle shared images
      if (sharedData.images && sharedData.images.length > 0) {
        setSelectedReceipt(sharedData.images[0]); // Use first image
        setSelectedTab('receipt');
        // Create preview URL for the first image
        const url = URL.createObjectURL(sharedData.images[0]);
        setPreviewUrl(url);
      }

      // Always open the AI assistant when shared data is received
      setOpen(true);
    } else if (!sharedData && open) {
      // If shared data is cleared but drawer is open, reset to default state
      setSelectedTab('text');
      setTextInput('');
      setSelectedReceipt(null);
      setPreviewUrl(null);
      setAnalysisOutput(null);
    }
  }, [sharedData, setOpen, open]);

  const handleClose = () => {
    setSelectedReceipt(null);
    setIsScanning(false);
    setPreviewUrl(null);
    setAnalysisOutput(null);
    setTextInput('');
    setIsSending(false);
    setSelectedTab('text');
    setOpen(false);

    // Clean up shared data if it exists
    if (sharedData) {
      // Revoke object URLs to free memory
      if (sharedData.images && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    }

    // Call onClearSharedData if provided
    if (onClearSharedData) {
      onClearSharedData();
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      setSelectedReceipt(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = () => {
    setIsScanning(true);
    if (selectedReceipt) {
      runWithLoaderAndError(
        async () => {
          const response = await aiService.analyzeReceipt(selectedReceipt);
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
    runWithLoaderAndError(
      async () => {
        const response = await aiService.analyzeText(textInput);
        setAnalysisOutput(response.data);
      },
      {
        loaderMessage: 'Analyzing text...',
        successMessage: 'Text analyzed successfully',
        finally: () => {
          setIsSending(false);
        },
      },
    );
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

  const handleNextImage = () => {
    if (sharedData?.images && sharedData.images.length > 1) {
      const currentIndex = sharedData.images.findIndex((img) => img === selectedReceipt);
      const nextIndex = (currentIndex + 1) % sharedData.images.length;
      const nextImage = sharedData.images[nextIndex];

      setSelectedReceipt(nextImage);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(nextImage);
      setPreviewUrl(newPreviewUrl);
    }
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
        <DrawerHeader className="items-start gap-3 pb-0">
          <DrawerTitle className="flex w-full items-center gap-3">
            <span className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/30">
              <DynamicIcon name="bot" className="h-4 w-4 text-purple-500" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-base leading-tight font-semibold">AI Transaction Assistant</span>
              <span className="text-muted-foreground text-xs leading-snug font-light">
                Paste or share text/images from other apps to quickly extract transaction details.
              </span>
            </div>
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex h-full flex-col gap-4 px-4">
          {/* Tabs */}
          <div className="mb-2 flex gap-2 border-b">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  'flex-1 px-4 py-2 font-medium transition-colors',
                  selectedTab === tab.id ? 'border-b-2 border-purple-500 text-purple-500' : 'text-muted-foreground',
                )}
                onClick={() => {
                  setSelectedTab(tab.id as 'text' | 'receipt');
                  setAnalysisOutput(null);

                  // Clear receipt-related state when switching to text tab
                  if (tab.id === 'text') {
                    setSelectedReceipt(null);
                    setPreviewUrl(null);
                  }

                  // Clear text input when switching to receipt tab
                  if (tab.id === 'receipt') {
                    setTextInput('');
                  }
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
                placeholder={
                  sharedData?.text
                    ? 'Shared text loaded automatically. You can edit it here...'
                    : 'Paste SMS, receipt text, or share from other apps...'
                }
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
                    <p className="text-muted-foreground mt-1 text-sm">
                      Choose a receipt image from your device or share from other apps
                    </p>
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
                {sharedData?.images && sharedData.images.length > 1 && (
                  <div className="mt-2 flex flex-col items-center gap-2">
                    <p className="text-muted-foreground text-xs">
                      📷 {sharedData.images.length} images shared • Using first image
                    </p>
                    <Button variant="outline" size="sm" onClick={handleNextImage} className="text-xs">
                      <DynamicIcon name="arrow-right" className="mr-1 h-3 w-3" />
                      Next Image
                    </Button>
                  </div>
                )}
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
            <Button variant="outline" className="w-1/2" onClick={handleClose}>
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
              {isSending ? 'Analyzing...' : 'Analyze'}
            </Button>
          )}
          {/* Receipt Tab Analyze Button (footer) */}
          {selectedTab === 'receipt' && !analysisOutput && (
            <Button
              className="w-1/2 border-none bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              onClick={handleAnalyze}
              disabled={isScanning || !selectedReceipt}
            >
              {isScanning ? 'Analyzing...' : 'Analyze'}
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

export default AIAssistant;
