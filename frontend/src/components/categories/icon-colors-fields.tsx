import ColorPicker from '@/components/color-picker';
import { Label } from '@/components/ui/label';
import { IconPicker, type IconName } from '@/components/ui/icon-picker';
import { IconRenderer } from '@/components/icon-renderer';

interface IconColorsFieldsProps {
  icon: IconName;
  bgColor: string;
  color: string;
  setIcon: (icon: IconName) => void;
  setBgColor: (bgColor: string) => void;
  setColor: (color: string) => void;
}
const IconColorsFields = ({ icon, bgColor, color, setIcon, setBgColor, setColor }: IconColorsFieldsProps) => {
  return (
    <div className="space-y-4">
      <Label>Icon & Colors</Label>
      <div className="flex items-center space-x-4">
        <IconPicker value={icon} onValueChange={(icon) => setIcon(icon as IconName)}>
          <IconRenderer
            iconName={icon}
            className="cursor-pointer border-2 border-slate-200 dark:border-slate-700"
            size="lg"
            color={color}
            bgColor={bgColor}
          />
        </IconPicker>
        <div className="flex-1 space-y-2">
          <div className="flex space-x-2">
            <div className="flex-1 space-y-2">
              <Label className="text-xs">Background Color</Label>
              <ColorPicker color={bgColor} setColor={(color: string) => setBgColor(color)} />
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-xs">Icon Color</Label>
              <ColorPicker color={color} setColor={(color: string) => setColor(color)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconColorsFields;
