import { useState } from "react";
import axios from "axios";

const projects: string[] = ["protfolio", "new-grouPp"];

function App() {
  const [message, setMessage] = useState<string>("");

  const handleAction = async (project: string, action: string): Promise<void> => {
    try {
      const response = await axios.post(`http://44.203.250.84:8001/${action}/${project}`);
      setMessage(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setMessage(error.toString());
    }
  };

  const handleStorage = async (project: string, action: string): Promise<void> => {
    try {
      const response = await axios.get(`http://44.203.250.84:8001/storage/${project}`);
      setMessage(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setMessage(error.toString());
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Projects</h1>
      {projects.map((project) => (
        <div key={project} className="mb-4">
          <h2 className="text-xl">{project}</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 mr-2"
            onClick={() => handleAction(project, "start")}
          >
            Start
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 mr-2"
            onClick={() => handleStorage(project, "start")}
          >
            Storage
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2"
            onClick={() => handleAction(project, "stop")}
          >
            Stop
          </button>
        </div>
      ))}
      <pre className="mt-6 bg-gray-100 p-4 rounded">{message}</pre>
    </div>
  );
}

export default App;
