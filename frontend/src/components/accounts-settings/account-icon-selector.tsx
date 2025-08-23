import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type IconName } from '@/components/ui/icon-picker';
import IconColorsFields from '@/components/categories/icon-colors-fields';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { DynamicIcon } from '@/components/lucide';

// Helper function to create cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<{ file: File; url: string }> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  // Set canvas size to the crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Draw the cropped image
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Canvas is empty');
        }
        const file = new File([blob], 'account-avatar.jpg', { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        resolve({ file, url });
      },
      'image/jpeg',
      0.9,
    );
  });
};

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
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setImageToCrop(imageUrl);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    // Clear the input so the same file can be selected again
    e.target.value = '';
  };

  const handleCropSave = async () => {
    if (!croppedAreaPixels || !imageToCrop) return;

    try {
      const { file, url } = await getCroppedImg(imageToCrop, croppedAreaPixels);
      onAvatarChange(file, url);
      setShowCropModal(false);
      setImageToCrop('');
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
    setImageToCrop('');
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleRemoveAvatar = () => {
    onAvatarChange(null, null);
  };

  return (
    <>
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
          <Button
            type="button"
            variant={useAvatar ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUseAvatar(true)}
          >
            Image
          </Button>
        </div>

        {useAvatar ? (
          /* Avatar Upload */
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-slate-300 dark:border-slate-600">
                  <AvatarImage src={avatar || undefined} alt="Account avatar" />
                  <AvatarFallback className="text-lg">{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                {/* Edit button - bottom right */}
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <Button
                    type="button"
                    size="sm"
                    className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    asChild
                  >
                    <span>
                      <DynamicIcon name="camera" className="h-3 w-3" />
                    </span>
                  </Button>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                {/* Delete button - bottom left (only show if avatar exists) */}
                {avatar && (
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -bottom-1 -left-1 h-6 w-6 rounded-full"
                    onClick={handleRemoveAvatar}
                  >
                    <DynamicIcon name="x" className="h-3 w-3" />
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

      {/* Crop Modal */}
      <Dialog open={showCropModal} onOpenChange={setShowCropModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Account Icon</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Cropper Container */}
            <div className="relative h-96 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={false}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent',
                  },
                }}
              />
            </div>

            {/* Zoom Control */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Zoom</Label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-500">1x</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-slate-600 dark:[&::-webkit-slider-thumb]:bg-slate-300"
                />
                <span className="text-sm text-slate-500">3x</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCrop({ x: 0, y: 0 });
                  setZoom(1);
                }}
                className="gap-2"
              >
                <DynamicIcon name="rotate-ccw" className="h-4 w-4" />
                Reset
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCropCancel}>
                  Cancel
                </Button>
                <Button onClick={handleCropSave}>Save</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountIconSelector;
