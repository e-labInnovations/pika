import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { DynamicIcon, type IconName } from '@/components/lucide';

interface NavigationProps {
  isDesktop?: boolean;
}

type Tab = {
  id: string;
  label: string;
  icon: IconName;
  href: string;
  isSpecial?: boolean;
};

const tabs: Tab[] = [
  { id: 'home', label: 'Home', icon: 'home', href: '/' },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: 'list',
    href: '/transactions',
  },
  { id: 'add', label: 'Add', icon: 'plus', isSpecial: true, href: '/add' },
  { id: 'people', label: 'People', icon: 'users', href: '/people' },
  { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
];

export function Navigation({ isDesktop = false }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (href: string) => {
    if (href !== '/') {
      return location.pathname.includes(href);
    }
    return location.pathname === '/';
  };

  if (isDesktop) {
    return (
      <nav className="space-y-2">
        {tabs.map((tab) => {
          return (
            <Button
              key={tab.id}
              variant={isActive(tab.href) ? 'default' : 'ghost'}
              className={`w-full justify-start ${
                tab.isSpecial
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  : isActive(tab.href)
                    ? 'bg-primary/10 text-primary'
                    : ''
              }`}
              onClick={() => navigate(tab.href)}
            >
              <DynamicIcon name={tab.icon} className="mr-3 h-5 w-5" />
              {tab.label}
            </Button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="bg-card/90 border-border fixed right-0 bottom-0 left-0 z-30 border-t backdrop-blur-sm">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          if (tab.isSpecial) {
            return (
              <Button
                key={tab.id}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-12 rounded-full shadow-lg"
                onClick={() => navigate(tab.href)}
              >
                <DynamicIcon name={tab.icon} className="h-6 w-6" />
              </Button>
            );
          }
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`flex flex-1 flex-col items-center py-3 ${
                isActive(tab.href) ? 'text-primary' : 'text-muted-foreground'
              }`}
              onClick={() => navigate(tab.href)}
            >
              <DynamicIcon name={tab.icon} className="mb-1 h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
