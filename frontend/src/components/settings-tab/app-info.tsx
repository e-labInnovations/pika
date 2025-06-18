import PikaIcon from '../pika-icon';
import { Card, CardContent } from '../ui/card';

const AppInfo = () => {
  return (
    <Card className="border-slate-200 bg-white/70 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/70">
      <CardContent className="p-4 text-center">
        <div className="border-border bg-card mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full border bg-gradient-to-br">
          <PikaIcon size={60} style="filled" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white">Pika Finance</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Version 1.0.0</p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Simple personal finance management</p>
      </CardContent>
    </Card>
  );
};

export default AppInfo;
