import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Instance from "../pages/Instance";
import MainLayout from "../layout/MainLayout";

const router = createBrowserRouter([
{
    element: <MainLayout/>,
    path: "/",
    children: [
        {
            element: <Dashboard/>,
            path: "/",
        },
        {
            element: <Instance/>,
            path: "/instance",
        }
    ]
},

]);

export default router;
