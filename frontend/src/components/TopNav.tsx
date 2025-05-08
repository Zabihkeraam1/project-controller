import { Menu, Search, RefreshCw } from "lucide-react";

interface TopNavProps {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const TopNav = ({
  isSidebarCollapsed,
  toggleSidebar,
  searchQuery,
  setSearchQuery,
}: TopNavProps) => (
  <header className="bg-white border-b border-gray-200">
    <div className="flex items-center justify-between p-4">
      <button
        onClick={toggleSidebar}
        className={`${isSidebarCollapsed && "hidden"} text-gray-500 hover:text-gray-700 mr-4`}
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1 max-w-md">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search instances..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex items-center">
        <button className="ml-4 bg-gray-200 p-2 rounded-full text-gray-700 hover:bg-gray-300">
          <RefreshCw className="h-5 w-5" />
        </button>
        <div className="ml-4 relative">
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="User"
            className="h-10 w-10 rounded-full border-2 border-gray-300"
          />
        </div>
      </div>
    </div>
  </header>
);