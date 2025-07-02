import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconRenderer } from './icon-renderer';
import type { TransactionAccount } from '@/data/dummy-data';
import type { Account } from '@/services/api';

interface AccountAvatarProps {
  account: Account | TransactionAccount;
  size?: 'xs' | 'sm' | 'default' | 'md' | 'lg' | 'xl';
  className?: string;
}

const AccountAvatar = ({ account, size = 'default', className = '' }: AccountAvatarProps) => {
  const sizeClasses = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    default: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Check if account has avatar property (Account type)
  const hasAvatar = 'avatar' in account && account.avatar;

  if (hasAvatar) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={account.avatar?.url} alt={account.name} />
        <AvatarFallback className={`${sizeClasses[size]} bg-slate-100 dark:bg-slate-800`}>
          <IconRenderer iconName={account.icon} size={size} bgColor={account.bgColor} color={account.color} />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <IconRenderer iconName={account.icon} size={size} bgColor={account.bgColor} color={account.color} />
    </div>
  );
};

export default AccountAvatar;
