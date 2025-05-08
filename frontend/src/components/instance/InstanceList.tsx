import { Instance } from "../../types/instance";
import { InstanceListItem } from "./InstanceListItem";

interface InstanceListProps {
  instances: Instance[];
  selectedInstance: Instance;
  onSelectInstance: (instance: Instance) => void;
}

export const InstanceList = ({ instances, selectedInstance, onSelectInstance }: InstanceListProps) => (
  <div className="lg:col-span-1 bg-white rounded-lg shadow">
    <div className="p-4 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-800">Project ({instances.length})</h2>
    </div>
    <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
      {instances.map((instance) => (
        <InstanceListItem
          key={instance.id}
          instance={instance}
          isSelected={selectedInstance.id === instance.id}
          onClick={() => onSelectInstance(instance)}
        />
      ))}
    </div>
  </div>
);