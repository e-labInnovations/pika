import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import PikaIcon from './pika-icon';

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
                size="icon"
                onClick={() => navigate(linkBackward, { replace: true })}
                className="text-muted-foreground mr-2"
              >
                <ChevronLeft className="size-8" />
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div className="border-border bg-card flex h-10 w-10 items-center justify-center rounded-full border bg-gradient-to-br">
                <PikaIcon size={40} style="filled" />
              </div>
              <div>
                <h1 className="text-foreground text-lg font-bold">{title}</h1>
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
