import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { runWithLoaderAndError } from '@/lib/utils';
import { transactionsService } from '@/services/api';
import { useConfirmDialog } from '@/store/useConfirmDialog';
import { EllipsisVertical, Edit, Copy, Share, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const HeaderDropdownMenu = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleEdit = () => {
    if (id) {
      navigate(`/transactions/${id}/edit`);
    }
  };

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    console.log('Duplicate transaction:', id);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share transaction:', id);
  };

  const handleDelete = () => {
    useConfirmDialog.getState().open({
      title: 'Delete Transaction',
      message: `Are you sure you want to delete this transaction?`,
      onConfirm: () => {
        runWithLoaderAndError(
          async () => {
            await transactionsService.delete(id!);
            navigate('/transactions');
          },
          {
            loaderMessage: 'Deleting transaction...',
            successMessage: 'Transaction deleted successfully',
          },
        );
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600 dark:text-red-400">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderDropdownMenu;
