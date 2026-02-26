import { createBrowserRouter } from "react-router";
// Routes configuration
import Login from "@/app/pages/Login";
import Register from "@/app/pages/Register";
import Dashboard from "@/app/pages/Dashboard";
import Onboarding from "@/app/pages/Onboarding";
import AdminDashboard from "@/app/pages/AdminDashboard";
import NotFound from "@/app/pages/NotFound";
import Transactions from "@/app/pages/Transactions";
import PaymentNew from "@/app/pages/PaymentNew";
import PaymentStatus from "@/app/pages/PaymentStatus";
import Profile from "@/app/pages/Profile";
import Settings from "@/app/pages/Settings";
import AdminVendors from "@/app/pages/AdminVendors";
import AdminVendorDetails from "@/app/pages/AdminVendorDetails";
import AdminKYCApprovals from "@/app/pages/AdminKYCApprovals";
import Landing from "@/app/pages/Landing";
import Marketplace from "@/app/pages/Marketplace";
import VendorShop from "@/app/pages/VendorShop";
import ShopSettings from "@/app/pages/ShopSettings";
import Products from "@/app/pages/Products";
import Cart from "@/app/pages/Cart";
import Checkout from "@/app/pages/Checkout";
import OrderConfirmation from "@/app/pages/OrderConfirmation";
import VendorOrders from "@/app/pages/VendorOrders";
import VendorOrderDetails from "@/app/pages/VendorOrderDetails";
import AdminOrders from "@/app/pages/AdminOrders";
import AdminOrderDetails from "@/app/pages/AdminOrderDetails";
import AdminDrivers from "@/app/pages/AdminDrivers";
import Features from "@/app/pages/Features";
import Pricing from "@/app/pages/Pricing";
import HowItWorks from "@/app/pages/HowItWorks";
import About from "@/app/pages/About";
import Contact from "@/app/pages/Contact";
import Privacy from "@/app/pages/Privacy";
import Terms from "@/app/pages/Terms";
import { Outlet } from "react-router";

function RootLayout() {
  return <Outlet />;
}

import VendorDrivers from "@/app/pages/VendorDrivers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "marketplace",
        element: <Marketplace />,
      },
      {
        path: "shop/:id",
        element: <VendorShop />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Checkout />,
      },
      {
        path: "order/:orderId/confirmation",
        element: <OrderConfirmation />,
      },
      {
        path: "order-confirmation/:orderNumber",
        element: <OrderConfirmation />,
      },
      {
        path: "onboarding",
        element: <Onboarding />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "shop-settings",
        element: <ShopSettings />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "payment/new",
        element: <PaymentNew />,
      },
      {
        path: "payment/:id/status",
        element: <PaymentStatus />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "admin/vendors",
        element: <AdminVendors />,
      },
      {
        path: "admin/vendors/:id",
        element: <AdminVendorDetails />,
      },
      {
        path: "admin/kyc-approvals",
        element: <AdminKYCApprovals />,
      },
      {
        path: "admin/orders",
        element: <AdminOrders />,
      },
      {
        path: "admin/orders/:id",
        element: <AdminOrderDetails />,
      },
      {
        path: "admin/drivers",
        element: <AdminDrivers />,
      },
      {
        path: "vendor/orders",
        element: <VendorOrders />,
      },
      {
        path: "vendor/drivers",
        element: <VendorDrivers />,
      },
      {
        path: "vendor/orders/:id",
        element: <VendorOrderDetails />,
      },
      {
        path: "features",
        element: <Features />,
      },
      {
        path: "how-it-works",
        element: <HowItWorks />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);