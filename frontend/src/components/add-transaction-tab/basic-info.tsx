import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TransactionFormData } from './types';
import MoneyInput from '../money-input';
import { DateTimePicker } from '@/components/datetime-picker';

interface BasicInfoProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData | ((prev: TransactionFormData) => TransactionFormData)) => void;
}

const BasicInfo = ({ formData, setFormData }: BasicInfoProps) => {
  return (
    <Card className="gap-0 p-0">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="flex items-center text-lg">
          <DollarSign className="mr-2 h-5 w-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Enter transaction title"
            required
          />
        </div>
        <MoneyInput
          value={formData.amount}
          onChange={(amount) => setFormData((prev) => ({ ...prev, amount }))}
          id="amount"
          labelText="Amount *"
          className="text-xl font-bold"
        />

        {/* Enhanced Date Time Picker */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="flex items-center">
              Date & Time *
            </Label>
            <DateTimePicker
              value={formData.date ? new Date(formData.date) : undefined}
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  date: date ? date.toISOString() : '',
                }))
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfo;
