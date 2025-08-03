import { IconRenderer, iconRendererVariants } from './icon-renderer';
import { type Category } from '@/data/dummy-data';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DynamicIcon } from '@/components/lucide';

interface CategoryItemViewProps extends VariantProps<typeof iconRendererVariants> {
  category: Category;
  className?: string;
}

const CategoryItemView = ({ category, className, size, variant }: CategoryItemViewProps) => {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <IconRenderer
        iconName={category.icon}
        color={category.color}
        bgColor={category.bgColor}
        size={size}
        variant={variant}
      />
      <div className="flex-1">
        <p className="font-medium">{category.name}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
      </div>
      {category.isSystem && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              <DynamicIcon name="lock" className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>System category</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default CategoryItemView;
