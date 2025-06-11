import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface MainHeaderProps {
  linkBackward?: string;
  title: string;
  description?: string;
  rightActions?: React.ReactNode;
}
const MainHeader = ({
  linkBackward,
  title,
  description,
  rightActions,
}: MainHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {linkBackward && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(linkBackward)}
                className="text-muted-foreground p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏔️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">{rightActions}</div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
