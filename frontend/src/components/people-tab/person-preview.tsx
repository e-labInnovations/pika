import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn, getColorFromName, getInitials } from '@/lib/utils';

interface PersonPreviewProps {
  name: string;
  email: string;
  phone: string;
  description: string;
  avatar: string;
}

const PersonPreview = ({ name, email, phone, description, avatar }: PersonPreviewProps) => {
  return (
    <div className="space-y-2">
      <Label>Preview</Label>
      <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <Avatar className="h-12 w-12 border-2 border-slate-300 dark:border-slate-600">
            <AvatarImage src={avatar} alt="Person avatar" />
            <AvatarFallback className={cn('text-md font-semibold', getColorFromName(name))}>
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name || 'Full Name'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{email || 'email@example.com'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{phone || '+1 (555) 123-4567'}</p>
            {description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonPreview;
