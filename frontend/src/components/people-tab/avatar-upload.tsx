import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, X } from 'lucide-react';
import { cn, getColorFromName } from '@/lib/utils';

interface AvatarUploadProps {
  avatar: string;
  name: string;
  onAvatarChange: (avatarFile: File | null, avatarUrl: string | null) => void;
}

const AvatarUpload = ({ avatar, name, onAvatarChange }: AvatarUploadProps) => {
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

  const handleRemoveAvatar = () => {
    onAvatarChange(null, null);
  };

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>
      <div className="flex justify-center">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-slate-300 dark:border-slate-600">
            <AvatarImage src={avatar} alt="Person avatar" />
            <AvatarFallback className={cn('text-3xl font-semibold', name && getColorFromName(name))}>
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Edit button - bottom right */}
          <Label htmlFor="avatar-upload" className="cursor-pointer">
            <Button
              type="button"
              size="sm"
              className="absolute -right-1 -bottom-1 h-8 w-8 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              asChild
            >
              <span>
                <Camera className="h-4 w-4" />
              </span>
            </Button>
          </Label>
          <Input id="avatar-upload" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />

          {/* Delete button - bottom left (only show if avatar exists) */}
          {avatar && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="absolute -bottom-1 -left-1 h-8 w-8 rounded-full"
              onClick={handleRemoveAvatar}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;
