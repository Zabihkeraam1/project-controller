import { Play, Square, RefreshCw, Power, HardDrive, Activity, Settings, Trash2 } from "lucide-react";
import { ResourceMeter } from "./ResourceMeter";
import { Instance } from "../../types/instance";
import axios from "axios";

interface InstanceDetailsProps {
  instance: Instance | null;
  onInstanceAction: (action: string, instance: Instance) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const InstanceDetails = ({
  instance,
  onInstanceAction,
  onRefresh,
  isLoading
}: InstanceDetailsProps) => {
  if (!instance) {
    return (
      <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No instance selected</p>
        </div>
      </div>
    );
  }
  const API_BASE_URL = "http://44.203.250.84:8001/api";
  const handleDelete = (name: string) => {
    return () => {
      if (confirm(`Are you sure you want to delete ${name}?`)) {
        const res = axios.delete(`${API_BASE_URL}/project/projects/${name}`)
        console.log(res);
      }
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500";
      case "stopped": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      case "stopping": return "bg-orange-500";
      case "deploying": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800">Instance Details</h2>
        <div className="flex space-x-2">
          {instance.status === "deploying" && (
            <button
              onClick={() => onInstanceAction("start", instance)}
              className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </button>
          )}
          {instance.status === "deploying" && (
            <button
              onClick={() => onInstanceAction("stop", instance)}
              className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              <Square className="h-4 w-4 mr-1" />
              Stop
            </button>
          )}
          {instance.status === "deploying" && (
            <button
              onClick={handleDelete(instance.name)}
              className="flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </button>
          )}
          <button
            onClick={() => onRefresh && onRefresh()}
            className="flex items-center px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Project Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium">{instance.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(instance.status)}`}></div>
                      <p className="ml-2 font-medium text-sm capitalize">{instance.status}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Project ID</p>
                    <p className="font-medium">{instance.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Project link</p>
                    <a href={`https://${instance.name}.craftapp.ai`} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">{instance.name}</a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Uptime</p>
                    <p className="font-medium">{instance.zone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created At</p>
                    <p className="font-medium">{formatDate(instance.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Allocated Resources</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">CPU</p>
                    <p className="font-medium">{instance.cpu / 1000}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Memory</p>
                    <p className="font-medium">{instance.memory / 1000}GB</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Disk Storage</p>
                    <p className="font-medium">{instance.storage}GB</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Network</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Frontend Port</p>
                    <p className="font-medium">{instance.frontend_port}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Backend Port</p>
                    <p className="font-medium">{instance.backend_port}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Resource Utilization</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <ResourceMeter
                  label="CPU"
                  value={parseFloat(instance.storageInfo.resources.cpuUsedPercent || "0")}
                  max={parseFloat(instance.storageInfo.resources.cpuAllocated || "1.0") * 100}
                  color="bg-blue-500"
                />
                <ResourceMeter
                  label="Memory (GB)"
                  value={parseFloat(instance.storageInfo.resources.memoryUsedMB || "0")}
                  max={parseFloat(instance.storageInfo.resources.memoryAllocated || "2.0")}
                  color="bg-purple-500"
                />
                <ResourceMeter
                  label="Storage"
                  value={parseFloat((parseFloat(instance.storageInfo?.usage.used || "0") / 1024).toFixed(2))}
                  max={parseFloat(instance.storageInfo?.usage.total)}
                  color="bg-green-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Power className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-sm font-medium">Reboot</span>
                </button>
                <button className="flex items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <HardDrive className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-sm font-medium">Volumes</span>
                </button>
                <button className="flex items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Activity className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-sm font-medium">Metrics</span>
                </button>
                <button className="flex items-center justify-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Settings className="h-5 w-5 text-gray-700 mr-2" />
                  <span className="text-sm font-medium">Configure</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};