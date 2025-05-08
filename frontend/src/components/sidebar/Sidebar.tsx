import { Menu } from "lucide-react";
import { Cloud, Home, HardDrive, Database, Activity, BarChart3, Settings } from "lucide-react";
import { NavItem } from "./NavItem";

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export const Sidebar = ({ isCollapsed, toggleCollapse }: SidebarProps) => {
  const navItems = [
    { icon: Home, label: "Dashboard", to: "/" },
    { icon: HardDrive, label: "Instances", to: "/instance" },
    { icon: Database, label: "Storage", to: "#" },
    { icon: Activity, label: "Monitoring", to: "#" },
    { icon: BarChart3, label: "Analytics", to: "#" },
    { icon: Settings, label: "Settings", to: "#" },
  ];

  return (
    <div
      className={`${isCollapsed ? "w-20" : "w-64"} bg-white h-full transition-all duration-300 border-r border-gray-200`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className={`flex items-center ${isCollapsed && "justify-center w-full"}`}>
          <Cloud className="h-8 w-8 text-gray-700" />
          {!isCollapsed && <span className="ml-2 text-xl font-semibold text-gray-800">EC2 Manager</span>}
        </div>
        {!isCollapsed && (
          <button onClick={toggleCollapse} className="text-gray-500 hover:text-gray-700">
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>
      <nav className="mt-6">
        <div className={`px-4 ${isCollapsed && "px-0 text-center"}`}>
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              to={item.to}
              isActive={index === 0}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </nav>
    </div>
  );
};