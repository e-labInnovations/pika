import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconRenderer } from '@/components/icon-renderer';
import { type IconName } from '@/components/ui/icon-picker';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';

interface AccountPreviewProps {
  name: string;
  description: string;
  icon: IconName;
  bgColor: string;
  color: string;
  avatar: string | null;
  balance: number;
  useAvatar: boolean;
}

const AccountPreview = ({
  name,
  description,
  icon,
  bgColor,
  color,
  avatar,
  balance,
  useAvatar,
}: AccountPreviewProps) => {
  const { user } = useAuth();

  return (
    <div className="space-y-2">
      <Label>Preview</Label>
      <div className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          {useAvatar && avatar ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatar} alt="Account avatar" />
              <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <IconRenderer iconName={icon} size="md" color={color} bgColor={bgColor} />
          )}
          <div>
            <p className="font-medium">{name || 'Account Name'}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description || 'Account description'}</p>
            <p className="text-sm font-medium text-slate-900 dark:text-white">
              {currencyUtils.formatAmount(balance, user?.settings?.currency)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPreview;
