import { DynamicIcon } from '@/components/lucide';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DetailedPersonActionsProps {
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
}

const DetailedPersonActions = ({ onEdit, onShare, onDelete }: DetailedPersonActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <DynamicIcon name="ellipsis-vertical" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={onEdit}>
          <DynamicIcon name="edit" className="mr-2 h-4 w-4" />
          Edit Person
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onShare}>
          <DynamicIcon name="share" className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
          <DynamicIcon name="trash-2" className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DetailedPersonActions;
