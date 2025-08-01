import { CategoryTransactionIcon } from '@/components/category-transaction-icon';
import { Card, CardContent } from '@/components/ui/card';
import type { AnalyzedTransactionData } from '@/services/api/ai.service';
import transactionUtils from '@/lib/transaction-utils';
import { currencyUtils } from '@/lib/currency-utils';
import AccountAvatar from '@/components/account-avatar';
import { ArrowBigRightDash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TagChip } from '@/components/tag-chip';
import { cn, getInitials } from '@/lib/utils';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

interface AnalysisOutputProps {
  analysisOutput: AnalyzedTransactionData;
  onRetryAnalysis?: () => void;
}

const AnalysisOutput = ({ analysisOutput, onRetryAnalysis }: AnalysisOutputProps) => {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <Card className="p-0 transition-all duration-200">
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-3">
              <CategoryTransactionIcon
                transactionType={analysisOutput.type}
                iconName={analysisOutput.category.icon}
                size="md"
                bgColor={analysisOutput.category.bgColor}
                color={analysisOutput.category.color}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="truncate font-medium text-slate-900 dark:text-white">{analysisOutput.title}</h4>
                  <span className={`font-semibold ${transactionUtils.getAmountColor(analysisOutput.type)}`}>
                    {currencyUtils.formatAmount(analysisOutput.amount, user?.settings.currency || 'INR')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex grow flex-col gap-2">
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {transactionUtils.formatDateTime(analysisOutput.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {analysisOutput.account && (
                        <>
                          <AccountAvatar account={analysisOutput.account} size="xs" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {analysisOutput.account.name}
                          </span>
                        </>
                      )}
                      {analysisOutput.toAccount && (
                        <>
                          <ArrowBigRightDash className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                          <AccountAvatar account={analysisOutput.toAccount} size="xs" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {analysisOutput.toAccount.name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {analysisOutput.person && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={analysisOutput.person?.avatar?.url} alt={analysisOutput.person?.name} />
                        <AvatarFallback className="bg-emerald-500 font-semibold text-white">
                          {getInitials(analysisOutput.person?.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {analysisOutput.tags.map((tag) => (
                    <div key={tag.id}>
                      <TagChip name={tag.name} iconName={tag.icon} bgColor={tag.bgColor} color={tag.color} size="xs" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {analysisOutput.note && (
        <div className="text-muted-foreground mt-3 text-sm">
          <p className="mb-1 font-medium">Note</p>
          <p>{analysisOutput.note}</p>
        </div>
      )}
      <div className={cn('flex items-center justify-between', !onRetryAnalysis && 'justify-center')}>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>AI Analysis Complete</span>
        </div>
        {onRetryAnalysis && (
          <Button variant="outline" size="sm" onClick={onRetryAnalysis} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Re-analyze
          </Button>
        )}
      </div>
    </div>
  );
};

export default AnalysisOutput;
