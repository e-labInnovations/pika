import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="bg-background flex h-full w-full flex-1 flex-col">
      <Outlet />
    </div>
  );
};

export default MainLayout;
