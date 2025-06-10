import MainHeader from "@/components/main-header";
import { Navigation } from "@/components/navigation";

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
      <main className="pb-20 lg:pb-4">
        <div className="lg:flex lg:max-w-7xl lg:mx-auto">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="sticky top-24 p-4">
              <Navigation isDesktop />
            </div>
          </div>

          {/* Content */}
          <div className="lg:flex-1 lg:min-w-0">
            <div className="px-4 py-6 space-y-6">{children}</div>
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
