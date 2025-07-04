import MainHeader from '@/components/main-header';
import { Navigation } from '@/components/navigation';

interface TabsLayoutProps {
  header: {
    title: string;
    description?: string;
    linkBackward?: string;
    rightActions?: React.ReactNode;
  };
  children: React.ReactNode;
}

const TabsLayout = ({ header, children }: TabsLayoutProps) => {
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
      <main className="flex h-full flex-1 flex-col pb-20 lg:pb-4">
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
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden">
        <Navigation />
      </div>
    </>
  );
};

export default TabsLayout;
