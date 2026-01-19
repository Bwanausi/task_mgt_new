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

    // Quick stats for demo purposes
    const totalTasks = 12;
    const completedTasks = 5;
    const pendingTasks = totalTasks - completedTasks;
    const totalUsers = 8;

    const renderContent = () => {
        switch (active) {
            case "myTasks":
                return <MyTasks />;
            case "allTasks":
                return <AllTasks />;
            case "createTask":
                return <CreateTask />;
            case "users":
                return <Users />;
            case "reports":
                return <Reports />;
            case "settings":
                return <Settings />;
            default:
                // Dashboard welcome panel with stats
                return (
                    <div className="space-y-6">
                        {/* Welcome Card */}
                        <div className="bg-white p-6 rounded shadow hover:shadow-md transition">
                            <h1 className="text-2xl font-semibold text-teal-800">
                                Welcome back, {user.username} 👋
                            </h1>
                            <p className="text-gray-500 mt-2">
                                Role: {user.roles && user.roles.length > 0 ? user.roles.join(", ") : "N/A"}
                            </p>
                        </div>

                        {/* Quick Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard title="Total Tasks" value={totalTasks} color="bg-blue-500" />
                            <StatCard title="Completed Tasks" value={completedTasks} color="bg-green-500" />
                            <StatCard title="Pending Tasks" value={pendingTasks} color="bg-yellow-500" />
                            <StatCard title="Total Users" value={totalUsers} color="bg-purple-500" />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-topcolor">

            {/* 🔹 FULL WIDTH TOPBAR */}
            <Topbar user={user} onLogout={handleLogout} />

            {/* 🔹 BELOW TOPBAR */}
            <div className="flex">

                {/* SIDEBAR */}
                <Sidebar user={user} active={active} onChange={setActive} />

                {/* MAIN CONTENT */}
                <main className="flex-1 p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

// StatCard component
const StatCard = ({ title, value, color }) => (
    <div
        className={`flex flex-col justify-center items-center p-4 rounded shadow text-white ${color} hover:shadow-md transition`}
    >
        <p className="text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
);
