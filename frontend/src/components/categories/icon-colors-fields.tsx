import ColorPicker from '@/components/color-picker';
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
      <span className="flex items-center gap-2 text-sm leading-none font-medium select-none">Icon & Colors</span>
      <div className="flex items-center justify-between gap-4">
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
          <span className="text-xs">Background Color</span>
          <ColorPicker color={bgColor} setColor={(color: string) => setBgColor(color)} />
        </div>
        <div className="flex-1 space-y-2">
          <span className="text-xs">Icon Color</span>
          <ColorPicker color={color} setColor={(color: string) => setColor(color)} />
        </div>
      </div>
    </div>
  );
};

export default IconColorsFields;
