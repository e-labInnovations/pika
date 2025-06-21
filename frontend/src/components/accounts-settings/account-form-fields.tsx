import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AccountFormFieldsProps {
  name: string;
  description: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
}

const AccountFormFields = ({ name, description, onNameChange, onDescriptionChange }: AccountFormFieldsProps) => {
  return (
    <>
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Account Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter account name"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter account description (e.g., bank name, account type, etc.)"
          rows={3}
        />
      </div>
    </>
  );
};

export default AccountFormFields;
