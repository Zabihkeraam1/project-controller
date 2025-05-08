import { Instance } from "../../types/instance";

interface InstanceListItemProps {
  instance: Instance;
  isSelected: boolean;
  onClick: () => void;
}

export const InstanceListItem = ({ instance, isSelected, onClick }: InstanceListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500";
      case "stopped": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      case "stopping": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-gray-50" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full ${getStatusColor(instance.status)}`}></div>
          <h3 className="ml-2 font-medium text-gray-800">{instance.name}</h3>
        </div>
        <span className="text-xs text-gray-500">{instance.type}</span>
      </div>
      <div className="mt-2 flex items-center text-xs text-gray-500">
        <span className="truncate">{instance.id}</span>
      </div>
    </div>
  );
};