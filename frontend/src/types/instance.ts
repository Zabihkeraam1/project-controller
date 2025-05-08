export interface Instance {
    id: string;
    name: string;
    status: "running" | "stopped" | "pending" | "stopping" | "deploying";
    process_id: number;
    type: string;
    zone: string;
    frontend_port: string;
    backend_port: string;
    storage: number;
    storageInfo: {
      paths: {
        application: string;
        volume: string;
        exists: {
          project_path: boolean;
          volume_path: boolean;
        };
      };
      usage: {
        container: string;
        free: string;
        total: string;
        used: string;
        volume: string;
      };
      resources: {
        cpuAllocated: string;
        cpuUsedPercent: string;
        memoryAllocated: string;
        memoryUsedMB: string;
      };
      filesystem: Record<string, any>;
    };
    cpu: number;
    memory: number;
    created_at: string;
    updated_at: string;
    url: string;
    uptime: string;
  }

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface FilesystemInfo {
  avail: string;
  filesystem: string;
  free_percentage: number;
  mounted: string;
  size: string;
  'use%': string;
  used: string;
}

export interface InstanceData {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'pending' | 'stopping' | 'deploying';
  cpu: number;
  memory: number;
  uptime: string;
  storageInfo?: {
    filesystem?: FilesystemInfo;
    usage?: {
      used: string;
      total: string;
      free: string;
    };
  };
}


export interface SystemStats {
  data: {
    avail: string;
    filesystem: string;
    free_percentage: number;
    mounted: string;
    size: string;
    use: string;
    used: string;
  };
  os: {
    arch: string;
    hostname: string;
    platform: string;
    release: string;
    uptimeSeconds: number;
  };
  cpu: {
    brand: string;
    cache: {
      l1d: number;
      l1i: number;
      l2: number;
      l3: number;
    };
    cores: number;
    efficiencyCores: number;
    family: string;
    flags: string;
    governor: string;
    manufacturer: string;
    model: string;
    performanceCores: number;
    physicalCores: number;
    processors: number;
    revision: string;
    socket: string;
    speed: number;
    speedMax: number | null;
    speedMin: number | null;
    stepping: string;
    vendor: string;
    virtualization: boolean;
    voltage: string;
    cpuCache: {
      l1d: number;
      l1i: number;
      l2: number;
      l3: number;
    };
    cpuCurrentSpeed: {
      avg: number;
      cores: number[];
      max: number;
      min: number;
    };
    cpuUsagePercent: string;
    load: [number, number, number];
  };
  memory: {
    freeMB: string;
    totalMB: string;
    usedMB: string;
  };
  disk: Array<{
    fs: string;
    mount: string;
    sizeGB: string;
    type: string;
    usePercent: number;
    usedGB: string;
  }>;
  diskIO: {
    readMB: string;
    writeMB: string;
  };
  network: Array<{
    iface: string;
    rxMBps: string;
    txMBps: string;
  }>;
};