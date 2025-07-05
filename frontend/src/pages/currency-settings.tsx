import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TabsLayout from '@/layouts/tabs';
import { CircleCheck, Globe } from 'lucide-react';
import { currencyUtils, type Currency, type CurrencyCode } from '@/lib/currency-utils';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { cn, runWithLoaderAndError } from '@/lib/utils';
import SearchBar from '@/components/search-bar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { settingsService } from '@/services/api';
import AsyncStateWrapper from '@/components/async-state-wrapper';

const CurrencySettings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCurrencies, setFilteredCurrencies] = useState<Currency[]>(currencyUtils.getCurrencies());
  const [currentCurrency, setCurrentCurrency] = useState<Currency>();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Filter currencies based on search term
  useEffect(() => {
    const filtered = currencyUtils
      .getCurrencies()
      .filter(
        (currency) =>
          currency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          currency.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    setFilteredCurrencies(filtered);
  }, [searchTerm]);

  const fetchSettings = () => {
    setIsLoading(true);
    setError(null);
    settingsService
      .getSettings()
      .then((response) => {
        setCurrentCurrency(currencyUtils.getCurrencyByCode(response.data.currency as CurrencyCode));
        setSelectedCurrency(currencyUtils.getCurrencyByCode(response.data.currency as CurrencyCode));
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = currencyUtils.getCurrencyByCode(currencyCode as CurrencyCode);
    if (currency) {
      setSelectedCurrency(currency);
    }
  };

  const handleSave = () => {
    if (selectedCurrency) {
      runWithLoaderAndError(
        async () => {
          await settingsService.updateSettingsItem('currency', selectedCurrency.code);
          setCurrentCurrency(currencyUtils.getCurrencyByCode(selectedCurrency.code as CurrencyCode));
          setSelectedCurrency(currencyUtils.getCurrencyByCode(selectedCurrency.code as CurrencyCode));
        },
        {
          loaderMessage: 'Updating currency...',
          successMessage: 'Currency updated successfully',
        },
      );
    }
  };

  return (
    <TabsLayout
      header={{
        title: 'Default Currency',
        description: 'Select your currency',
        linkBackward: '/settings',
      }}
    >
      <AsyncStateWrapper isLoading={isLoading} error={error} linkBackward="/settings" onRetry={fetchSettings}>
        {selectedCurrency && currentCurrency && (
          <>
            {/* Search Bar */}
            <div className="relative">
              <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearchToggle={() => {}} />
            </div>

            {/* Current Default Currency */}
            <Card className="border-emerald-200 bg-emerald-50 p-0 dark:border-emerald-800 dark:bg-emerald-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                      <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Current Default</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {selectedCurrency.name} ({selectedCurrency.code})
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                  >
                    {selectedCurrency.symbol}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Currency List */}
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Available Currencies ({filteredCurrencies.length})
              </h3>

              <RadioGroup.Root
                value={selectedCurrency.code}
                onValueChange={handleCurrencyChange}
                className="flex max-h-[calc(100vh-360px)] flex-col gap-2 overflow-y-auto lg:max-h-[100vh-0px]"
              >
                {filteredCurrencies.map((currency) => (
                  <RadioGroup.Item
                    key={currency.code}
                    value={currency.code}
                    className={cn(
                      'ring-border text-muted-foreground relative m-1 rounded-lg px-4 py-3 text-start ring-[0.25px]',
                      'data-[state=checked]:ring-primary data-[state=checked]:text-primary data-[state=checked]:ring-[1.5px]',
                      'hover:bg-accent/50',
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarFallback className="bg-slate-500 text-white">{currency.symbol}</AvatarFallback>
                      </Avatar>
                      <div className="flex grow flex-col text-left">
                        <h4 className="font-medium text-slate-900 dark:text-white">{currency.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {currency.code} • {currency.symbol_native}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {currency.decimal_digits} decimal{currency.decimal_digits !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <RadioGroup.Indicator className="absolute top-2 right-2">
                      <CircleCheck className="fill-primary text-primary-foreground" />
                    </RadioGroup.Indicator>
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </div>

            <div className="flex items-center justify-between gap-2">
              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => setSelectedCurrency(currentCurrency)}
                disabled={selectedCurrency.code === currentCurrency.code}
              >
                Reset
              </Button>

              {/* Save Button */}
              <Button onClick={handleSave} className="w-1/2" disabled={selectedCurrency.code === currentCurrency.code}>
                {selectedCurrency.code === currentCurrency.code ? 'No Changes' : 'Save'}
              </Button>
            </div>
          </>
        )}
      </AsyncStateWrapper>
    </TabsLayout>
  );
};

export default CurrencySettings;
