
import { useState } from "react";
import { Sidebar } from "../components/sidebar/Sidebar";
import { TopNav } from "../components/TopNav";
import { InstanceList } from "../components/instance/InstanceList";
import { InstanceDetails } from "../components/instance/InstanceDetails";
import { useInstances } from "../hooks/useInstances";
import { AlertCircle, Loader } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    instances,
    selectedInstance,
    setSelectedInstance,
    handleInstanceAction,
    refreshInstances,
    isLoading,
    error,
  } = useInstances();

  const filteredInstances = instances.filter(
    (instance) =>
      instance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.id.toString().includes(searchQuery)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        isCollapsed={!sidebarOpen}
        toggleCollapse={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          isSidebarCollapsed={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <Outlet />
        </main>
      </div>
    </div>
  );
}