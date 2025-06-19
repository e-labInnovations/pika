import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { NotebookPen } from 'lucide-react';
import { type TransactionFormData } from './types';

interface NoteProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData | ((prev: TransactionFormData) => TransactionFormData)) => void;
}
const Note = ({ formData, setFormData }: NoteProps) => {
  return (
    <Card className="gap-0 p-0">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center text-lg">
          <NotebookPen className="mr-2 h-5 w-5" />
          Note
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-4">
        <Textarea
          value={formData.note}
          onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="Add a note for this transaction..."
          rows={3}
          required
          className="resize-none"
        />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Note is required to help you remember this transaction
        </p>
      </CardContent>
    </Card>
  );
};

export default Note;
