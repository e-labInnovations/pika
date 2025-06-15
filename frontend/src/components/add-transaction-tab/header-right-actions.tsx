import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";

interface HeaderRightActionsProps {
  handleScanReceipt: () => void;
}

const HeaderRightActions = ({ handleScanReceipt }: HeaderRightActionsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        onClick={handleScanReceipt}
        size="icon"
        className="bg-gradient-to-r rounded-full from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
      >
        <Sparkles className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default HeaderRightActions;
