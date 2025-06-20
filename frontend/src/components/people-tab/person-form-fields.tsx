import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PersonFormFieldsProps {
  name: string;
  email: string;
  phone: string;
  description: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
  onDescriptionChange: (description: string) => void;
}

const PersonFormFields = ({
  name,
  email,
  phone,
  description,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onDescriptionChange,
}: PersonFormFieldsProps) => {
  return (
    <>
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter full name"
          required
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter email address"
        />
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Enter phone number"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter description (e.g., relationship, how you know them, etc.)"
          rows={3}
        />
      </div>
    </>
  );
};

export default PersonFormFields;
