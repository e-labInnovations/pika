import DynamicIcon from '@/components/lucide/dynamic-icon';
import { Button } from '@/components/ui/button';

interface HeaderRightActionsProps {
  handleOpenAIAssistant: () => void;
}

const HeaderRightActions = ({ handleOpenAIAssistant }: HeaderRightActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        onClick={handleOpenAIAssistant}
        size="icon"
        className="rounded-full border-none bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
      >
        <DynamicIcon name="bot" className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default HeaderRightActions;
