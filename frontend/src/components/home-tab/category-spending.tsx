import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/components/lucide';
import { currencyUtils } from '@/lib/currency-utils';
import { useAuth } from '@/hooks/use-auth';
import { type CategorySpending, type MonthlyCategorySpending } from '@/services/api';
import AsyncStateWrapper from '../async-state-wrapper';
import { IconRenderer } from '../icon-renderer';
import CategoryPopover from './category-popover';
import { cn } from '@/lib/utils';
import { useCategorySpending } from '@/hooks/queries';

interface CategorySpendingProps {
  selectedDate: Date;
}

interface CategorySpendingBarProps {
  category: CategorySpending;
  percentage: number;
  isChild?: boolean;
  popoverOpen: boolean;
  onPopoverOpenChange: (open: boolean) => void;
  date: Date;
}

const CategorySpendingBar = ({
  category,
  percentage,
  isChild = false,
  popoverOpen,
  onPopoverOpenChange,
  date,
}: CategorySpendingBarProps) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    setAnimatedPercentage(0);
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 50);

    return () => clearTimeout(timer);
  }, [percentage]);

  const formatAmount = (amount: number) => {
    return currencyUtils.formatAmount(amount, user?.settings?.currency, {
      showSymbol: true,
      showDecimal: false,
      showNegative: false,
    });
  };

  return (
    <CategoryPopover categoryData={category} open={popoverOpen} onOpenChange={onPopoverOpenChange} date={date}>
      <div className={cn('relative h-6 cursor-pointer', isChild && 'ml-4 h-5')}>
        {/* Single Progress Bar Background */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {/* Background with category color */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: category.categoryBgColor,
              opacity: 0.2,
            }}
          />
          {/* Fill with full category color */}
          <div
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${animatedPercentage}%`,
              backgroundColor: category.categoryBgColor,
            }}
          />
        </div>

        {/* Icon and Name Section - Overlaid on Left */}
        <div
          className={cn('absolute top-0 left-0 z-10 flex h-6 items-center gap-1 px-1 py-1', isChild && 'h-5 py-0.5')}
        >
          <IconRenderer
            iconName={category.categoryIcon}
            size={isChild ? 'xs' : 'sm'}
            bgColor={category.categoryBgColor}
            color={category.categoryColor}
          />
          <span
            className={cn('font-medium', isChild ? 'text-xs' : 'text-sm')}
            style={{ color: category.categoryColor }}
          >
            {category.categoryName}
          </span>
        </div>

        {/* Amount Section - Overlaid on Right */}
        <div className="absolute top-0 right-0 z-10 flex h-6 items-center justify-center px-2 py-1">
          <span className={cn('font-semibold text-white', isChild ? 'text-xs' : 'text-sm')}>
            {formatAmount(category.amount)}
          </span>
        </div>
      </div>
    </CategoryPopover>
  );
};

const CategorySpendingView = ({ selectedDate }: CategorySpendingProps) => {
  const [categorySpending, setCategorySpending] = useState<MonthlyCategorySpending | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    parentCategories: CategorySpending[];
    childCategories: CategorySpending[];
    maxAmount: number;
  } | null>(null);

  const {
    data: categorySpendingData,
    isLoading,
    error,
    refetch,
  } = useCategorySpending(selectedDate.getMonth() + 1, selectedDate.getFullYear());

  useEffect(() => {
    if (categorySpendingData) {
      setCategorySpending(categorySpendingData);
      setMeta(getMeta(categorySpendingData));
    }
  }, [categorySpendingData]);

  const toggleExpanded = () => {
    if (expandedCategories.size === 0) {
      // Expand all parent categories
      const parentIds = new Set(
        categorySpending?.data.filter((cat) => cat.isParent).map((cat) => cat.categoryId) || [],
      );
      setExpandedCategories(parentIds);
    } else {
      // Collapse all
      setExpandedCategories(new Set());
    }
  };

  const handlePopoverOpenChange = (categoryId: string, open: boolean) => {
    if (open) {
      setSelectedCategory(categoryId);
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
      setSelectedCategory(null);
    }
  };

  const getMeta = (data: MonthlyCategorySpending | null) => {
    if (!data) {
      return {
        parentCategories: [],
        childCategories: [],
        maxAmount: 0,
      };
    }

    // Filter to only show expense categories with transactions
    const expenseCategories = data.data.filter((cat) => cat.amount > 0);

    // Group by parent categories
    const parentCategories = expenseCategories.filter((cat) => cat.isParent);
    const childCategories = expenseCategories.filter((cat) => !cat.isParent);

    // Calculate max amount for percentage calculation
    const maxAmount = Math.max(...expenseCategories.map((cat) => cat.amount));

    return {
      parentCategories,
      childCategories,
      maxAmount,
    };
  };

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md">Category Spending</CardTitle>
          <Button variant="ghost" size="sm" onClick={toggleExpanded} className="h-8 w-8 p-0">
            {expandedCategories.size === 0 ? (
              <DynamicIcon name="chevron-right" className="h-4 w-4" />
            ) : (
              <DynamicIcon name="chevron-down" className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AsyncStateWrapper isLoading={isLoading} error={error} onRetry={refetch}>
          <div className="space-y-2">
            {meta?.parentCategories.map((parentCategory) => {
              const isExpanded = expandedCategories.has(parentCategory.categoryId);
              const childCategoriesForParent = meta?.childCategories.filter(
                (child) => child.parentId === parentCategory.categoryId,
              );
              const percentage = (parentCategory.amount / meta?.maxAmount) * 100;

              return (
                <div key={parentCategory.categoryId} className="space-y-1">
                  <CategorySpendingBar
                    category={parentCategory}
                    percentage={percentage}
                    popoverOpen={popoverOpen && selectedCategory === parentCategory.categoryId}
                    onPopoverOpenChange={(open) => handlePopoverOpenChange(parentCategory.categoryId, open)}
                    date={selectedDate}
                  />

                  {isExpanded &&
                    childCategoriesForParent.map((childCategory) => {
                      const childPercentage = (childCategory.amount / meta?.maxAmount) * 100;
                      return (
                        <CategorySpendingBar
                          key={childCategory.categoryId}
                          category={childCategory}
                          percentage={childPercentage}
                          isChild={true}
                          popoverOpen={popoverOpen && selectedCategory === childCategory.categoryId}
                          onPopoverOpenChange={(open) => handlePopoverOpenChange(childCategory.categoryId, open)}
                          date={selectedDate}
                        />
                      );
                    })}
                </div>
              );
            })}

            {meta?.childCategories.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-sm text-slate-500 dark:text-slate-400">No expenses found for this month</p>
              </div>
            )}
          </div>
        </AsyncStateWrapper>
      </CardContent>
    </Card>
  );
};

export default CategorySpendingView;
