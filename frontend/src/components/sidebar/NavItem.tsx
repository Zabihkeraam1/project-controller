import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  isActive?: boolean;
  isCollapsed: boolean;
}

export const NavItem = ({ icon: Icon, label, to, isActive, isCollapsed }: NavItemProps) => (
  <Link
    to={to}
    className={`flex items-center py-3 px-4 rounded-md ${isActive ? "bg-gray-100 text-gray-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-700"} ${isCollapsed ? "justify-center px-0" : ""}`}
  >
    <Icon className="h-5 w-5" />
    {!isCollapsed && <span className="ml-3">{label}</span>}
  </Link>
);