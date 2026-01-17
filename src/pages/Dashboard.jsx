import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import MyTasks from "../components/dashboard/MyTasks";
import AllTasks from "../components/dashboard/AllTasks";
import CreateTask from "../components/dashboard/CreateTask";
import Users from "../components/dashboard/Users";
import Reports from "../components/dashboard/Reports";
import Settings from "../components/dashboard/Settings";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState("dashboard");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const renderContent = () => {
        switch (active) {
            case "myTasks": return <MyTasks />;
            case "allTasks": return <AllTasks />;
            case "createTask": return <CreateTask />;
            case "users": return <Users />;
            case "reports": return <Reports />;
            case "settings": return <Settings />;
            default: return <div className="p-6 text-lg">Welcome back 👋</div>;
        }
    };

    return (
        <div className="min-h-screen flex bg-topcolor">
            <Sidebar user={user} active={active} onChange={setActive} />
            <div className="flex-1 flex flex-col">
                <Topbar user={user} onLogout={handleLogout} />
                <main className="flex-1 p-6 bg-gray-100">{renderContent()}</main>
            </div>
        </div>
    );
}
