import { DynamicIcon, type IconName } from '@/components/lucide';
import { cn } from '@/lib/utils';

interface ChartNoDataProps {
  title?: string;
  description?: string;
  icon?: IconName;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const ChartNoData = ({
  title = 'No Data Available',
  description = 'There is no data to display for the selected criteria',
  icon = 'bar-chart-3',
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
}: ChartNoDataProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <DynamicIcon
        name={icon}
        className={cn('mx-auto mb-4 h-16 w-16 text-muted-foreground/50', iconClassName)}
      />
      <h3 className={cn('mb-2 text-lg font-medium text-foreground', titleClassName)}>
        {title}
      </h3>
      <p className={cn('text-sm text-muted-foreground max-w-sm', descriptionClassName)}>
        {description}
      </p>
    </div>
  );
};

export default ChartNoData;
