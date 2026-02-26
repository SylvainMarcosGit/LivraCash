import { Link, useLocation } from "react-router";
import { useAuth } from "@/app/hooks/useAuth";
import { cn } from "@/app/components/ui/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Store,
  Package,
  ShoppingBag,
  Truck,
  UserCircle
} from "lucide-react";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const merchantNavItems = [
    {
      href: "/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
    },
    {
      href: "/shop-settings",
      label: "Ma Boutique",
      icon: Store,
    },
    {
      href: "/products",
      label: "Produits",
      icon: Package,
    },
    {
      href: "/vendor/orders",
      label: "Commandes",
      icon: ShoppingBag,
    },
    {
      href: "/vendor/drivers",
      label: "Livreurs",
      icon: Truck,
    },
    {
      href: "/profile",
      label: "Profil",
      icon: UserCircle,
    },
    {
      href: "/settings",
      label: "Paramètres",
      icon: Settings,
    },
  ];

  const adminNavItems = [
    {
      href: "/admin/dashboard",
      label: "Tableau de bord",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/vendors",
      label: "Vendeurs",
      icon: Users,
    },
    {
      href: "/admin/kyc-approvals",
      label: "Approbations KYC",
      icon: FileText,
    },
    {
      href: "/admin/orders",
      label: "Commandes",
      icon: ShoppingBag,
    },
    {
      href: "/admin/drivers",
      label: "Livreurs",
      icon: Truck,
    },
    {
      href: "/profile",
      label: "Profil",
      icon: UserCircle,
    },
    {
      href: "/settings",
      label: "Paramètres",
      icon: Settings,
    },
  ];

  const navItems = user?.role === "admin" ? adminNavItems : merchantNavItems;

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}