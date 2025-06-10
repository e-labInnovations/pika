import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Home from "@/pages/home-old";
import HomeTab from "@/pages/home-tab";
import Login from "@/pages/login";
import ProtectedRoute from "@/layouts/protected";
import MainLayout from "@/layouts/main";
import TransactionsTab from "@/pages/transactions-tab";
import AddTransactionTab from "@/pages/add-transaction-tab";
import PeopleTab from "./pages/people-tab";
import SettingsTab from "./pages/settings-tab";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomeTab />} />
        <Route path="/old-home" element={<Home />} />
        <Route path="/transactions" element={<TransactionsTab />} />
        <Route path="/add" element={<AddTransactionTab />} />
        <Route path="/people" element={<PeopleTab />} />
        <Route path="/settings" element={<SettingsTab />} />
        <Route path="/about" element={<div>About Page</div>} />
      </Route>
    </>
  )
);

export default router;
