import type React from "react"
import axios from "axios"
import { useState, useEffect } from "react"
import { SystemStats } from "../types/instance"
import { ArrowDown, ArrowUp, Clock, Cpu, Database, HardDrive, MemoryStickIcon as Memory, Server } from "lucide-react"

const API_BASE_URL = "http://44.203.250.84:8001/api";

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}d ${hours}h ${minutes}m`
}

const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  )
}

const StatCard = ({
  title,
  value,
  icon,
  className = "",
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  className?: string
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-xl font-bold mt-1">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-blue-50 text-blue-600">{icon}</div>
      </div>
    </div>
  )
}

const CPUChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data)
  return (
    <div className="flex items-end h-24 gap-1 mt-4">
      {data.map((value, index) => {
        const height = (value / max) * 100
        return (
          <div
            key={index}
            className="bg-blue-500 rounded-t w-full"
            style={{ height: `${height}%` }}
            title={`Core ${index + 1}: ${value}GHz`}
          ></div>
        )
      })}
    </div>
  )
}

const NetworkTraffic = ({
  iface,
  rx,
  tx,
}: {
  iface: string
  rx: string
  tx: string
}) => {
  return (
    <div className="flex flex-col space-y-2 p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center">
        <span className="font-medium">{iface}</span>
      </div>
      <div className="flex items-center space-x-2">
        <ArrowDown className="h-4 w-4 text-green-500" />
        <span className="text-sm">{rx} MB/s</span>
      </div>
      <div className="flex items-center space-x-2">
        <ArrowUp className="h-4 w-4 text-blue-500" />
        <span className="text-sm">{tx} MB/s</span>
      </div>
    </div>
  )
}

export default function SystemDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get<SystemStats>(`${API_BASE_URL}/project/system-stats`)
        setStats(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching system stats:", err)
        setError("Failed to load system information. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 30000)
    return () => clearInterval(intervalId)
  }, [])

  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading system information...</p>
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const memoryUsagePercent = Math.round(
    (parseFloat(stats.memory.usedMB) / parseFloat(stats.memory.totalMB)) * 100
  )

  const cpuLoadPercent = Math.round((stats.cpu.load[0] * 100)) / stats.cpu.cores

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Server className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold">System Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium">Uptime: {formatUptime(stats.os.uptimeSeconds)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System overview */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Hostname" value={stats.os.hostname} icon={<Server className="h-6 w-6" />} />
            <StatCard
              title="Platform"
              value={`${stats.os.platform} (${stats.os.arch})`}
              icon={<Database className="h-6 w-6" />}
            />
            <StatCard title="CPU Load" value={`${cpuLoadPercent}%`} icon={<Cpu className="h-6 w-6" />} />
            <StatCard title="Memory Usage" value={`${memoryUsagePercent}%`} icon={<Memory className="h-6 w-6" />} />
          </div>
        </section>

        {/* CPU Section */}
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">CPU Usage</h3>
              <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                {stats.cpu.cpuUsagePercent}%
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Current Load</span>
                <span className="text-sm font-medium">{stats.cpu.load[0].toFixed(2)}</span>
              </div>
              <ProgressBar percentage={Math.min((stats.cpu.load[0] / stats.cpu.cores) * 100, 100)} color="bg-blue-600" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-500">Model</span>
                <p className="font-medium">{stats.cpu.brand}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Cores</span>
                <p className="font-medium">
                  {stats.cpu.cores} (Physical: {stats.cpu.physicalCores})
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Base Speed</span>
                <p className="font-medium">{stats.cpu.speed} GHz</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Max Speed</span>
                <p className="font-medium">{stats.cpu.speedMax || 'N/A'} GHz</p>
              </div>
            </div>

            <h4 className="text-sm font-medium mb-2">Core Speeds (GHz)</h4>
            <CPUChart data={stats.cpu.cpuCurrentSpeed.cores} />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Memory</h3>

            <div className="flex items-center justify-center mb-6">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>
                  <circle
                    className="text-blue-600 stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - memoryUsagePercent / 100)}`}
                    transform="rotate(-90 50 50)"
                  ></circle>
                  <text x="50" y="50" dominantBaseline="middle" textAnchor="middle" className="text-xl font-bold">
                    {memoryUsagePercent}%
                  </text>
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Used</span>
                  <span className="text-sm font-medium">{stats.memory.usedMB} MB</span>
                </div>
                <ProgressBar percentage={memoryUsagePercent} color="bg-blue-600" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Total</span>
                  <p className="font-medium">{stats.memory.totalMB} MB</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Free</span>
                  <p className="font-medium">{stats.memory.freeMB} MB</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Disk and Network Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Disk Section */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Storage</h3>

            <div className="space-y-6">
              {stats.disk.map((disk, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">
                        {disk.mount} ({disk.type})
                      </span>
                    </div>
                    <span className="text-sm font-medium">{disk.usePercent}%</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{disk.usedGB} GB used</span>
                    <span>{disk.sizeGB} GB total</span>
                  </div>

                  <ProgressBar
                    percentage={disk.usePercent}
                    color={disk.usePercent > 80 ? "bg-red-500" : "bg-green-500"}
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-3">Disk I/O</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <ArrowDown className="h-4 w-4 text-green-500" />
                    <div>
                      <span className="text-sm text-gray-500">Read</span>
                      <p className="font-medium">{stats.diskIO.readMB} MB/s</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowUp className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="text-sm text-gray-500">Write</span>
                      <p className="font-medium">{stats.diskIO.writeMB} MB/s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Network Section */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Network</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stats.network.map((net, index) => (
                <NetworkTraffic key={index} iface={net.iface} rx={net.rxMBps} tx={net.txMBps} />
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-3">Network Activity</h4>
              <div className="h-40 flex items-end">
                <div className="relative w-full h-32">
                  <div className="absolute inset-0 flex items-end">
                    {[...Array(20)].map((_, i) => {
                      const height1 = 30 + Math.random() * 70
                      const height2Val = 20 + Math.random() * 50
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center space-y-1">
                          <div className="w-full bg-blue-500/70 rounded-sm" style={{ height: `${height1}%` }}></div>
                          <div className="w-full bg-green-500/70 rounded-sm" style={{ height: `${height2Val}%` }}></div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-6 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">Outbound</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Inbound</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* System Information */}
        <section className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">System Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Operating System</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Platform</span>
                  <span className="text-sm font-medium">{stats.os.platform}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Architecture</span>
                  <span className="text-sm font-medium">{stats.os.arch}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Release</span>
                  <span className="text-sm font-medium">{stats.os.release}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Hostname</span>
                  <span className="text-sm font-medium">{stats.os.hostname}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">CPU Details</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Manufacturer</span>
                  <span className="text-sm font-medium">{stats.cpu.manufacturer}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Model</span>
                  <span className="text-sm font-medium">{stats.cpu.model}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Physical Cores</span>
                  <span className="text-sm font-medium">{stats.cpu.physicalCores}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Logical Cores</span>
                  <span className="text-sm font-medium">{stats.cpu.cores}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">File System</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Type</span>
                  <span className="text-sm font-medium">{stats.data.filesystem}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Mount Point</span>
                  <span className="text-sm font-medium">{stats.data.mounted}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Total Size</span>
                  <span className="text-sm font-medium">{stats.data.size}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-500">Used</span>
                  <span className="text-sm font-medium">
                    {stats.data.used} ({stats.data.use})
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-center text-gray-500">
            System Dashboard • Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </footer>
    </div>
  )
}