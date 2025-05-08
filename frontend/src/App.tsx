// import { useEffect, useState } from "react";
// import axios, { AxiosError } from "axios";

import { RouterProvider } from "react-router-dom";
import Router from "./router/Router";

// interface Project {
//   id: number;
//   name: string;
//   status: "active" | "inactive" | "deploying" | "failed";
//   process_id: number;
//   port: number;
//   url: string;
//   nginx_url: string;
//   repo_url: string;
//   cpu: number;
//   memory: number;
//   storage: number;
//   frontend_port: number;
//   backend_port: number;
//   created_at: string;
//   updated_at: string;
// }

// interface ApiResponse {
//   projects?: Project[];
//   message?: string;
//   [key: string]: unknown;
// }

// const statusColors = {
//   active: "bg-green-100 text-green-800",
//   inactive: "bg-gray-100 text-gray-800",
//   deploying: "bg-blue-100 text-blue-800",
//   failed: "bg-red-100 text-red-800"
// };

// const ProjectDashboard = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [message, setMessage] = useState<string>("");
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [activeTab, setActiveTab] = useState<"projects" | "details">("projects");
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const fetchProjects = async () => {
//     try {
//       setIsLoading(true);
//       const { data } = await axios.get<ApiResponse>(
//         "http://44.203.250.84:8001/api/project/projects"
//       );
//       console.log("Fetched projects:", data);
//       setProjects(data || []);
//       setMessage(data.message || `${data.length || 0} projects found`);
//     } catch (error) {
//       handleError(error, "Error fetching projects");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleError = (error: unknown, defaultMessage: string) => {
//     let errorMessage = defaultMessage;
//     if (axios.isAxiosError(error)) {
//       errorMessage = error.response?.data?.message || error.message;
//     } else if (error instanceof Error) {
//       errorMessage = error.message;
//     }
//     setMessage(errorMessage);
//     console.error(error);
//   };

//   const handleProjectAction = async (projectId: number, action: "start" | "stop") => {
//     console.log(`Handling project action: ${action} for project ID: ${projectId}`);
//     try {
//       setIsLoading(true);
//       const { data } = await axios.post<ApiResponse>(
//         `http://44.203.250.84:8001/${action}/${projectId}`
//       );
//       setMessage(data.message || `Project ${action}ed successfully`);
//       await fetchProjects(); // Refresh list
//     } catch (error) {
//       handleError(error, `Error ${action}ing project`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleStorageCheck = async (projectId: number) => {
//     try {
//       setIsLoading(true);
//       const { data } = await axios.get<ApiResponse>(
//         `http://44.203.250.84:8001/api/project/get_storage/${projectId}`
//       );
//       setMessage(JSON.stringify(data, null, 2));
//     } catch (error) {
//       handleError(error, "Error checking storage");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString();
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-6">
//       <div className="max-w-6xl mx-auto">
//         <header className="mb-6 md:mb-8">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Project Management</h1>
//           <p className="text-gray-600">Manage your deployed applications</p>
//         </header>

//         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 className={`py-3 px-4 md:py-4 md:px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === "projects"
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//                 onClick={() => {
//                   setActiveTab("projects");
//                   setSelectedProject(null);
//                 }}
//               >
//                 All Projects
//               </button>
//               <button
//                 className={`py-3 px-4 md:py-4 md:px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === "details"
//                     ? "border-blue-500 text-blue-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//                 onClick={() => activeTab !== "details" && setActiveTab("details")}
//                 disabled={!selectedProject}
//               >
//                 Project Details
//               </button>
//             </nav>
//           </div>

//           <div className="p-4 md:p-6">
//             {isLoading ? (
//               <div className="flex justify-center items-center py-12">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : (
//               <>
//                 {activeTab === "projects" && (
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center mb-4">
//                       <h2 className="text-lg md:text-xl font-semibold text-gray-800">
//                         Active Projects ({projects.length})
//                       </h2>
//                       <button
//                         onClick={fetchProjects}
//                         className="px-3 py-1 md:px-4 md:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
//                       >
//                         Refresh
//                       </button>
//                     </div>

//                     {projects.length === 0 ? (
//                       <div className="text-center py-8 text-gray-500">
//                         No projects found. Create a new project to get started.
//                       </div>
//                     ) : (
//                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {projects.map((project) => (
//                           <div
//                             key={project.id}
//                             className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
//                             onClick={() => {
//                               setSelectedProject(project);
//                               setActiveTab("details");
//                             }}
//                           >
//                             <div className="flex justify-between items-start mb-2">
//                               <h3 className="font-medium text-gray-800 truncate">
//                                 {project.name}
//                               </h3>
//                               <span
//                                 className={`px-2 py-1 text-xs rounded-full ${
//                                   statusColors[project.status] || "bg-gray-100 text-gray-800"
//                                 }`}
//                               >
//                                 {project.status}
//                               </span>
//                             </div>

//                             <div className="text-sm text-gray-600 mb-3">
//                               <div>Frontend: {project.frontend_port}</div>
//                               <div>Backend: {project.backend_port}</div>
//                               <div>Created: {formatDate(project.created_at)}</div>
//                             </div>

//                             <div className="flex flex-wrap gap-2">
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleProjectAction(project.id, "start");
//                                 }}
//                                 className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-xs"
//                                 disabled={project.status === "active"}
//                               >
//                                 Start
//                               </button>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleProjectAction(project.id, "stop");
//                                 }}
//                                 className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs"
//                                 disabled={project.status !== "active"}
//                               >
//                                 Stop
//                               </button>
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleStorageCheck(project.id);
//                                 }}
//                                 className="px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs"
//                               >
//                                 Storage
//                               </button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === "details" && selectedProject && (
//                   <div className="space-y-4">
//                     <button
//                       onClick={() => setActiveTab("projects")}
//                       className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 mr-1"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                       Back to all projects
//                     </button>

//                     <h2 className="text-xl font-semibold text-gray-800">
//                       {selectedProject.name}
//                     </h2>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h3 className="font-medium text-gray-700 mb-2">Connection Details</h3>
//                         <ul className="space-y-2 text-sm">
//                           <li>
//                             <span className="text-gray-500">Status:</span>{" "}
//                             <span className={`px-2 py-1 rounded-full text-xs ${
//                               statusColors[selectedProject.status] || "bg-gray-100 text-gray-800"
//                             }`}>
//                               {selectedProject.status}
//                             </span>
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Main Port:</span> {selectedProject.port}
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Frontend:</span> {selectedProject.frontend_port}
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Backend:</span> {selectedProject.backend_port}
//                           </li>
//                           <li>
//                             <span className="text-gray-500">URL:</span>{" "}
//                             <a
//                               href={selectedProject.url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-500 hover:underline"
//                             >
//                               {selectedProject.url}
//                             </a>
//                           </li>
//                           <li>
//                             <span className="text-gray-500">NGINX URL:</span>{" "}
//                             <a
//                               href={selectedProject.nginx_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-500 hover:underline"
//                             >
//                               {selectedProject.nginx_url}
//                             </a>
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Repo:</span>{" "}
//                             <a
//                               href={selectedProject.repo_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-500 hover:underline"
//                             >
//                               {selectedProject.repo_url.split('/').pop()}
//                             </a>
//                           </li>
//                         </ul>
//                       </div>

//                       <div className="bg-gray-50 p-4 rounded-lg">
//                         <h3 className="font-medium text-gray-700 mb-2">Resource Allocation</h3>
//                         <ul className="space-y-2 text-sm">
//                           <li>
//                             <span className="text-gray-500">CPU:</span> {selectedProject.cpu} units
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Memory:</span> {selectedProject.memory} MB
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Storage:</span> {selectedProject.storage} GB
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Process ID:</span> {selectedProject.process_id}
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Created:</span> {formatDate(selectedProject.created_at)}
//                           </li>
//                           <li>
//                             <span className="text-gray-500">Updated:</span> {formatDate(selectedProject.updated_at)}
//                           </li>
//                         </ul>
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap gap-2 mt-4">
//                       <button
//                         onClick={() => handleProjectAction(selectedProject.id, "start")}
//                         className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
//                         disabled={selectedProject.status === "active"}
//                       >
//                         Start Project
//                       </button>
//                       <button
//                         onClick={() => handleProjectAction(selectedProject.id, "stop")}
//                         className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//                         disabled={selectedProject.status !== "active"}
//                       >
//                         Stop Project
//                       </button>
//                       <button
//                         onClick={() => handleStorageCheck(selectedProject.id)}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
//                       >
//                         Check Storage
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>

//         {message && (
//           <div className="bg-white p-4 rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-2">
//               <h3 className="font-medium text-gray-800">System Message</h3>
//               <button
//                 onClick={() => setMessage("")}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5"
//                   viewBox="0 0 20 20"
//                   fill="currentColor"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </button>
//             </div>
//             <pre className="bg-gray-50 p-3 rounded-md overflow-x-auto text-sm">
//               {message}
//             </pre>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProjectDashboard;

export default function App() {
  return (
    <RouterProvider router={Router} />
  );
}