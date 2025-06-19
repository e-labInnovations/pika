import { Camera, ImageIcon, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '../ui/card';
import { useState } from 'react';
import { type AnalysisOutput, analysisOutput as mockAnalysisOutput } from '@/data/dummy-data';
import { format } from 'date-fns';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { IconRenderer } from '../icon-renderer';

interface ScanReceiptProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleTransactionDetails: (transaction: AnalysisOutput) => void;
}

const ScanReceipt = ({ open, setOpen, handleTransactionDetails }: ScanReceiptProps) => {
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisOutput, setAnalysisOutput] = useState<AnalysisOutput | null>(null);

  const handleClose = () => {
    setSelectedReceipt(null);
    setIsScanning(false);
    setPreviewUrl(null);
    setAnalysisOutput(null);
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

  const handleCameraCapture = () => {
    console.log('camera capture');
  };

  const handleAnalyze = () => {
    setIsScanning(true);
    // TODO: Implement receipt analysis
    setTimeout(() => {
      setIsScanning(false);
      setAnalysisOutput(mockAnalysisOutput);
    }, 4000);
  };

  const handleUseDetails = () => {
    if (analysisOutput) {
      handleTransactionDetails(analysisOutput);
    }
    handleClose();
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="h-[50%]">
        <DrawerHeader className="items-start">
          <DrawerTitle className="flex w-full items-center gap-2">
            <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
            AI Receipt Scanner
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-4">
          {!selectedReceipt && (
            <>
              <div className="text-center">
                <p className="text-muted-foreground">Choose how you want to capture the receipt</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Card className="border-border hover:border-primary cursor-pointer border-2 border-dashed transition-all duration-200 hover:shadow-md">
                      <CardContent className="p-6 text-center">
                        <ImageIcon className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
                        <h3 className="font-medium">Upload Image</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Select from gallery</p>
                      </CardContent>
                    </Card>
                  </label>
                </div>

                <Card
                  className="border-border hover:border-primary cursor-pointer border-2 border-dashed transition-all duration-200 hover:shadow-md"
                  onClick={handleCameraCapture}
                >
                  <CardContent className="p-6 text-center">
                    <Camera className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
                    <h3 className="font-medium">Take Photo</h3>
                    <p className="text-muted-foreground mt-1 text-sm">Use camera</p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {selectedReceipt && !analysisOutput && (
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

          {analysisOutput && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm" />
                <div className="bg-background/50 relative rounded-lg border border-purple-500/20 p-4 backdrop-blur-sm">
                  <div className="absolute -top-3 -right-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconRenderer
                        iconName={analysisOutput.category.icon}
                        bgColor={analysisOutput.category.bgColor}
                        color={analysisOutput.category.color}
                      />
                      <div>
                        <h3 className="font-medium">{analysisOutput.title}</h3>
                        <p className="text-muted-foreground text-sm">
                          {format(new Date(analysisOutput.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">${analysisOutput.total.toFixed(2)}</p>
                      <p className="text-muted-foreground text-sm">{analysisOutput.category.name}</p>
                    </div>
                  </div>

                  {analysisOutput.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {analysisOutput.tags.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: tag.bgColor,
                            color: tag.color,
                          }}
                        >
                          <DynamicIcon name={tag.icon as IconName} className="h-4 w-4 text-white" />
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {analysisOutput.note && (
                    <div className="text-muted-foreground mt-3 text-sm">
                      <p className="mb-1 font-medium">Note</p>
                      <p>{analysisOutput.note}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>AI Analysis Complete</span>
              </div>
            </div>
          )}
        </div>

        <DrawerFooter className="flex flex-row gap-2">
          <DrawerClose className="w-1/2 grow">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DrawerClose>
          {selectedReceipt && !analysisOutput && (
            <Button
              className="w-1/2 border-none bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              onClick={handleAnalyze}
              disabled={isScanning}
            >
              {isScanning ? 'Analyzing...' : 'Analyze Receipt'}
            </Button>
          )}

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
