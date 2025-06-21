import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Home from '@/pages/home-old';
import HomeTab from '@/pages/home-tab';
import Login from '@/pages/login';
import ProtectedRoute from '@/layouts/protected';
import MainLayout from '@/layouts/main';
import TransactionsTab from '@/pages/transactions-tab';
import AddTransactionTab from '@/pages/add-transaction-tab';
import EditTransactionTab from '@/pages/edit-transaction-tab';
import PeopleTab from '@/pages/people-tab';
import SettingsTab from '@/pages/settings-tab';
import TransactionDetails from '@/pages/transaction-details';
import DetailedPerson from '@/pages/detailed-person';
import Categories from '@/pages/categories';
import Tags from '@/pages/tags';
import GeneralSettings from '@/pages/general-settings';
import NotificationsSettings from '@/pages/notifications-settings';
import SecuritySettings from '@/pages/security-settings';
import ProfileSettings from '@/pages/profile-settings';
import NotFound from '@/pages/404';
import LogoDemo from '@/pages/logo-demo';
import AddCategory from '@/pages/add-category';
import EditCategory from '@/pages/edit-category';
import AddChildCategory from '@/pages/add-child-category';
import EditChildCategory from '@/pages/edit-child-category';
import AddTag from '@/pages/add-tag';
import EditTag from '@/pages/edit-tag';
import AddAccount from '@/pages/add-account';
import EditAccount from '@/pages/edit-account';
import AddPerson from './pages/add-person';
import EditPerson from './pages/edit-person';
import CurrencySettings from '@/pages/currency-settings';
import AccountsSettings from './pages/accounts-settings';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Main Routes */}
        <Route path="/" element={<HomeTab />} />
        <Route path="/old-home" element={<Home />} />
        <Route path="/transactions" element={<TransactionsTab />} />
        <Route path="/transactions/:id" element={<TransactionDetails />} />
        <Route path="/add" element={<AddTransactionTab />} />
        <Route path="/transactions/:id/edit" element={<EditTransactionTab />} />
        <Route path="/people" element={<PeopleTab />} />
        <Route path="/people/:id" element={<DetailedPerson />} />
        <Route path="/people/add" element={<AddPerson />} />
        <Route path="/people/:id/edit" element={<EditPerson />} />

        {/* Settings Routes */}
        <Route path="/settings" element={<SettingsTab />} />
        <Route path="/settings/categories" element={<Categories />} />
        <Route path="/settings/categories/add" element={<AddCategory />} />
        <Route path="/settings/categories/:categoryId/edit" element={<EditCategory />} />
        <Route path="/settings/categories/:parentCategoryId/add" element={<AddChildCategory />} />
        <Route path="/settings/categories/:parentCategoryId/:childCategoryId/edit" element={<EditChildCategory />} />
        <Route path="/settings/tags" element={<Tags />} />
        <Route path="/settings/tags/add" element={<AddTag />} />
        <Route path="/settings/tags/:tagId/edit" element={<EditTag />} />
        <Route path="/settings/accounts" element={<AccountsSettings />} />
        <Route path="/settings/accounts/add" element={<AddAccount />} />
        <Route path="/settings/accounts/:accountId/edit" element={<EditAccount />} />
        <Route path="/settings/general" element={<GeneralSettings />} />
        <Route path="/settings/notifications" element={<NotificationsSettings />} />
        <Route path="/settings/security" element={<SecuritySettings />} />
        <Route path="/settings/profile" element={<ProfileSettings />} />
        <Route path="/settings/currency" element={<CurrencySettings />} />

        {/* Other Routes */}
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/logo-demo" element={<LogoDemo />} />

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </>,
  ),
);

export default router;
