import { Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import DatePicker from '../date-picker';
import type { TransactionFormData } from './types';
import MoneyInput from '../money-input';

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
          placeholder="0.00"
          currency="₹"
          className="text-xl font-bold"
        />

        {/* Enhanced Date Time Picker */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date" className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Date & Time *
            </Label>
            <DatePicker
              date={formData.date ? new Date(formData.date) : undefined}
              setDate={(date) =>
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
