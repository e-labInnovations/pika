import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Paperclip, Upload, X, File } from 'lucide-react';
import type { Attachment } from './types';

interface AttachmentsProps {
  attachments: Attachment[];
  setAttachments: (attachments: Attachment[] | ((prev: Attachment[]) => Attachment[])) => void;
}

const Attachments = ({ attachments, setAttachments }: AttachmentsProps) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const newAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type.startsWith('image/') ? ('image' as const) : ('pdf' as const),
          url: result,
          size: file.size,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    // Reset the input
    event.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="gap-0 p-0">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center text-lg">
          <Paperclip className="mr-2 h-5 w-5" />
          Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Upload Button */}
        <div>
          <input
            type="file"
            accept="image/*,.pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full justify-start border-2 border-dashed hover:bg-slate-50 dark:hover:bg-slate-800"
              asChild
            >
              <div>
                <Upload className="mr-2 h-4 w-4" />
                Upload Images or PDFs
              </div>
            </Button>
          </label>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Support for multiple images and PDF files</p>
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900 dark:text-white">Attached Files ({attachments.length})</h4>
            <div className="grid grid-cols-2 gap-3">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="relative rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500 hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>

                  {attachment.type === 'image' ? (
                    <div className="flex h-full flex-col items-center gap-2">
                      <img
                        src={attachment.url || '/placeholder.svg'}
                        alt={attachment.name}
                        className="h-20 w-full rounded object-cover"
                      />
                      <div className="my-auto flex flex-col items-center gap-1">
                        <p className="truncate text-xs font-medium text-slate-900 dark:text-white">{attachment.name}</p>
                        {attachment.size > 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatFileSize(attachment.size)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col items-center gap-2">
                      <div className="my-auto flex h-16 w-16 items-center justify-center rounded bg-red-100 dark:bg-red-900">
                        <File className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <p className="truncate text-xs font-medium text-slate-900 dark:text-white">{attachment.name}</p>
                        {attachment.size > 0 && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {formatFileSize(attachment.size)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Attachments;
