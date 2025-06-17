import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

interface MainHeaderProps {
  linkBackward?: string;
  title: string;
  description?: string;
  rightActions?: React.ReactNode;
}
const MainHeader = ({ linkBackward, title, description, rightActions }: MainHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-card/80 border-border sticky top-0 z-30 border-b backdrop-blur-sm">
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
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
                <span className="text-lg font-bold text-white">🏔️</span>
              </div>
              <div>
                <h1 className="text-foreground text-xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-xs">{description}</p>
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
