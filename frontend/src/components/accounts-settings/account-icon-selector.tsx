import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type IconName } from '@/components/ui/icon-picker';
import IconColorsFields from '@/components/categories/icon-colors-fields';

interface AccountIconSelectorProps {
  name: string;
  icon: IconName;
  bgColor: string;
  color: string;
  avatar: string | null;
  onIconChange: (icon: IconName) => void;
  onBgColorChange: (bgColor: string) => void;
  onColorChange: (color: string) => void;
  onAvatarChange: (avatar: File | null, url: string | null) => void;
}

const AccountIconSelector = ({
  name,
  icon,
  bgColor,
  color,
  avatar,
  onIconChange,
  onBgColorChange,
  onColorChange,
  onAvatarChange,
}: AccountIconSelectorProps) => {
  const [useAvatar, setUseAvatar] = useState(!!avatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAvatarChange(file, event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Account Icon</Label>

      {/* Toggle between Avatar and Icon */}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={!useAvatar ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUseAvatar(false)}
        >
          Icon
        </Button>
        <Button type="button" variant={useAvatar ? 'default' : 'outline'} size="sm" onClick={() => setUseAvatar(true)}>
          Image
        </Button>
      </div>

      {useAvatar ? (
        /* Avatar Upload */
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border-2 border-slate-300 dark:border-slate-600">
              <AvatarImage src={avatar || undefined} alt="Account avatar" />
              <AvatarFallback className="text-lg">{name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>{avatar ? 'Change Image' : 'Select Image'}</span>
                </Button>
              </Label>
              <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              {avatar && (
                <Button type="button" variant="outline" size="sm" onClick={() => onAvatarChange(null, null)}>
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Icon Selection */
        <IconColorsFields
          icon={icon}
          bgColor={bgColor}
          color={color}
          setIcon={(icon) => onIconChange(icon as IconName)}
          setBgColor={onBgColorChange}
          setColor={onColorChange}
        />
      )}
    </div>
  );
};

export default AccountIconSelector;
