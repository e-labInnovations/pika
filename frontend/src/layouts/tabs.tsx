import MainHeader from '@/components/main-header';
import { Navigation } from '@/components/navigation';
import { cn } from '@/lib/utils';
import { useMediaQuery } from 'usehooks-ts';

interface TabsLayoutProps {
  header: {
    title: string;
    description?: string;
    linkBackward?: string;
    rightActions?: React.ReactNode;
  };
  bottom?: {
    child?: React.ReactNode;
    className?: string;
  };
  children: React.ReactNode;
}

const TabsLayout = ({ header, children, bottom }: TabsLayoutProps) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <>
      {/* Header */}
      <MainHeader
        linkBackward={header.linkBackward}
        title={header.title}
        description={header.description}
        rightActions={header.rightActions}
      />

      {/* Main Content */}
      <main className={cn('flex h-full flex-1 flex-col pb-18 lg:pb-2', bottom?.child && 'pb-26 lg:pb-10')}>
        <div className="flex h-full w-full flex-1 flex-col lg:flex-row">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-24 p-4">
              <Navigation isDesktop />
            </div>
          </div>

          {/* Content */}
          <div className="flex w-full flex-1 flex-col lg:max-w-[calc(100vw-17rem)]">
            <div className="flex w-full flex-1 flex-col space-y-2 px-4 py-2 lg:py-4">{children}</div>
          </div>

          {isDesktop && bottom && bottom.child && (
            <div
              className={cn('fixed right-0 bottom-2 left-64 z-30 px-4 lg:max-w-[calc(100vw-17rem)]', bottom.className)}
            >
              {bottom.child}
            </div>
          )}
        </div>
      </main>

      {!isDesktop && bottom && bottom.child && (
        <div className={cn('fixed right-0 bottom-17 left-0 z-30 px-4', bottom.className)}>{bottom.child}</div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <Navigation />
      </div>
    </>
  );
};

export default TabsLayout;
