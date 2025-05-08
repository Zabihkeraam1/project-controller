import { useEffect, useState } from "react";
import axios from "axios";
import { Instance, ApiResponse } from "../types/instance";

export const useInstances = () => {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = "http://44.203.250.84:8001/api";

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse<Instance[]>>(`${API_BASE_URL}/project/projects`);
      console.log("Fetching instances from API...", response.data);
      
      setInstances(response.data.data);
      setSelectedInstance(response.data.data[0] || null);
    } catch (err) {
      handleError(err, "Error fetching instances");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: unknown, defaultMessage: string) => {
    let errorMessage = defaultMessage;
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || error.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    setError(errorMessage);
    console.error(error);
  };

const handleInstanceAction = async (action: string, instance: Instance) => {
  try {
    setIsLoading(true);
    setError(null);

    // First update the UI optimistically
    const updatedInstance: Instance = { 
      ...instance, 
      status: action === "start" ? "pending" : "stopping" 
    };
    updateInstance(updatedInstance);

    // Make API call
    const endpoint = action === "start" ? "start" : "stop";
    console.log(`Performing ${action} on instance ${instance.id}`);
    const { data } = await axios.post<ApiResponse<Instance[]>>(
      `${API_BASE_URL}/project/${endpoint}/${instance.id}`
    );

    // Update with actual response
    if (data.data && data.data.length > 0) {
      const updated = data.data.find(i => i.id === instance.id);
      if (updated) {
        updateInstance(updated);
      }
    } else {
      // Fallback to optimistic update
      const finalStatus = action === "start" ? "running" : "stopped";
      updateInstance({ ...updatedInstance, status: finalStatus });
    }

    // Refresh the list
    await fetchInstances();
  } catch (err) {
    handleError(err, `Error ${action}ing instance`);
    // Revert optimistic update on error
    updateInstance(instance);
  } finally {
    setIsLoading(false);
  }
};

  const updateInstance = (updatedInstance: Instance) => {
    setSelectedInstance(updatedInstance);
    setInstances(prev =>
      prev.map(inst => (inst.id === updatedInstance.id ? updatedInstance : inst))
    );
  };

  return {
    instances,
    selectedInstance,
    setSelectedInstance,
    handleInstanceAction,
    isLoading,
    error,
    refreshInstances: fetchInstances,
  };
};