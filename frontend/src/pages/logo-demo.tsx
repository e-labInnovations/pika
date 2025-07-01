import Logo from '@/components/logo';
import PikaIcon from '@/components/pika-icon';
import { useTitle } from '@/hooks/use-title';

// 2. Usage in different contexts with Tailwind classes
export const LogoExamples = () => {
  return (
    <div className="space-y-8">
      {/* Header Logo */}
      <header className="flex items-center justify-between bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Logo size={32} className="transition-transform hover:scale-110" />
          <h1 className="text-xl font-bold text-gray-800">Pika Money</h1>
        </div>
      </header>

      {/* App Icon Sizes */}
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col items-center space-y-2">
          <Logo size={16} />
          <span className="text-xs text-gray-600">16px</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Logo size={24} />
          <span className="text-xs text-gray-600">24px</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Logo size={32} />
          <span className="text-xs text-gray-600">32px</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Logo size={48} />
          <span className="text-xs text-gray-600">48px</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Logo size={96} />
          <span className="text-xs text-gray-600">96px</span>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Logo size={128} />
          <span className="text-xs text-gray-600">128px</span>
        </div>
      </div>

      {/* Different Variants */}
      <div className="flex space-x-4">
        <Logo variant="primary" size={48} />
        <Logo variant="monochrome" size={48} />
        <Logo variant="minimalist" size={48} />
      </div>

      {/* With Tailwind Styling */}
      <div className="flex items-center space-x-4">
        <Logo size={40} className="cursor-pointer drop-shadow-lg transition-all duration-300 hover:drop-shadow-xl" />
        <Logo size={40} className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200" />
        <Logo size={40} className="rounded-lg border-2 border-blue-200 p-1 transition-colors hover:border-blue-400" />
      </div>
    </div>
  );
};

// 3. With shadcn/ui Button component
import { Button } from '@/components/ui/button';

export const PikaButton = ({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<typeof Button>) => {
  return (
    <Button className="flex items-center space-x-2" {...props}>
      <Logo size={20} />
      <span>{children}</span>
    </Button>
  );
};

// 4. Loading component with Pika logo
export const PikaLoader = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-bounce">
        <Logo size={48} className="animate-pulse" />
      </div>
    </div>
  );
};

// 5. Card component with shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PikaCard = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <Logo size={24} className="mr-2" />
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

// 6. Usage Examples
export default function LogoDemo() {
  useTitle('Logo Demo');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <LogoExamples />

        {/* Button Examples */}
        <div className="flex space-x-4">
          <PikaButton>Get Started</PikaButton>
          <PikaButton variant="outline">Learn More</PikaButton>
        </div>

        {/* Card Example */}
        <PikaCard title="Account Balance">
          <p className="text-2xl font-bold text-green-600">$1,234.56</p>
        </PikaCard>

        {/* Loading Example */}
        <PikaLoader />
      </div>

      <div className="flex items-center space-x-4">
        <PikaIcon size={32} style="filled" />
        <PikaIcon size={24} style="outline" className="transition-transform hover:scale-110" />
        <PikaIcon size={20} style="minimal" />
      </div>
    </div>
  );
}
