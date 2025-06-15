import { Camera, ImageIcon, Sparkles, X, CheckCircle2 } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { useState } from "react";
import {
  type AnalysisOutput,
  analysisOutput as mockAnalysisOutput,
} from "@/data/dummy-data";
import { format } from "date-fns";
import { IconRenderer } from "@/components/icon-renderer";
import { cn } from "@/lib/utils";

interface ScanReceiptProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleTransactionDetails: (transaction: AnalysisOutput) => void;
}

const ScanReceipt = ({
  open,
  setOpen,
  handleTransactionDetails,
}: ScanReceiptProps) => {
  const [selectedReceipt, setSelectedReceipt] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisOutput, setAnalysisOutput] = useState<AnalysisOutput | null>(
    null
  );

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
    console.log("camera capture");
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
          <DrawerTitle className="flex gap-2 w-full items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
            AI Receipt Scanner
          </DrawerTitle>
        </DrawerHeader>

        <div className="px-4 flex flex-col gap-4">
          {!selectedReceipt && (
            <>
              <div className="text-center">
                <p className="text-muted-foreground">
                  Choose how you want to capture the receipt
                </p>
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
                    <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-dashed border-border hover:border-primary">
                      <CardContent className="p-6 text-center">
                        <ImageIcon className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                        <h3 className="font-medium">Upload Image</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Select from gallery
                        </p>
                      </CardContent>
                    </Card>
                  </label>
                </div>

                <Card
                  className="cursor-pointer hover:shadow-md transition-all duration-200 border-2 border-dashed border-border hover:border-primary"
                  onClick={handleCameraCapture}
                >
                  <CardContent className="p-6 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="font-medium">Take Photo</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use camera
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {selectedReceipt && !analysisOutput && (
            <div className="space-y-4">
              <div className="relative w-full max-w-sm mx-auto">
                <img
                  src={previewUrl || ""}
                  alt="Receipt preview"
                  className="w-full h-[75%] max-h-[200px] object-contain rounded-lg"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                  onClick={() => {
                    setSelectedReceipt(null);
                    setPreviewUrl(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {selectedReceipt.name}
                </p>
              </div>
            </div>
          )}

          {analysisOutput && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg blur-sm" />
                <div className="relative bg-background/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4">
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          analysisOutput.category.color
                        )}
                      >
                        <IconRenderer
                          iconName={analysisOutput.category.icon}
                          className="w-4 h-4 text-white"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{analysisOutput.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(analysisOutput.date), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        ${analysisOutput.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {analysisOutput.category.name}
                      </p>
                    </div>
                  </div>

                  {analysisOutput.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {analysisOutput.tags.map((tag) => (
                        <div
                          key={tag.id}
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            tag.color,
                            "text-white"
                          )}
                        >
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  )}

                  {analysisOutput.notes && (
                    <div className="text-sm text-muted-foreground mt-3">
                      <p className="font-medium mb-1">Notes</p>
                      <p>{analysisOutput.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
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
              className="w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
              onClick={handleAnalyze}
              disabled={isScanning}
            >
              {isScanning ? "Analyzing..." : "Analyze Receipt"}
            </Button>
          )}

          {analysisOutput && (
            <Button
              className="w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
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
