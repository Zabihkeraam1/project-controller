
import { useState } from "react";
import { InstanceList } from "../components/instance/InstanceList";
import { InstanceDetails } from "../components/instance/InstanceDetails";
import { useInstances } from "../hooks/useInstances";
import { AlertCircle, Loader } from "lucide-react";

export default function Dashboard() {
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

        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">EC2 Resources</h1>
            <p className="text-gray-600">Manage and monitor your EC2 resources</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-4">
              <Loader height={50} className="animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <AlertCircle />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <InstanceList
                instances={filteredInstances}
                selectedInstance={selectedInstance}
                onSelectInstance={setSelectedInstance}
                onRefresh={refreshInstances}
                isLoading={isLoading}
              />

              {selectedInstance ? (
                <InstanceDetails
                  instance={selectedInstance}
                  onInstanceAction={handleInstanceAction}
                  onRefresh={refreshInstances}
                  isLoading={isLoading}
                />
              ) : (
                <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-500">Select an instance to view details</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
    </div>
  );
}