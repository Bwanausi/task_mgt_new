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

    // Demo Data
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
                return (
                    <div className="space-y-6">

                        {/* Welcome Section */}
                        <div className="bg-white border border-gray-300 p-6 shadow-sm">
                            <h1 className="text-xl font-semibold text-gray-800">
                                Dashboard Overview
                            </h1>
                            <p className="text-sm text-gray-600 mt-2">
                                Welcome, {user.username}
                            </p>
                            <p className="text-sm text-gray-500">
                                Role: {user.roles?.length > 0
                                ? user.roles.join(", ")
                                : "N/A"}
                            </p>
                        </div>

                        {/* KPI Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            <StatCard title="Total Tasks" value={totalTasks} />
                            <StatCard title="Completed Tasks" value={completedTasks} />
                            <StatCard title="Pending Tasks" value={pendingTasks} />
                            <StatCard title="Total Users" value={totalUsers} />
                        </div>

                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Topbar */}
            <Topbar user={user} onLogout={handleLogout} />

            <div className="flex">

                {/* Sidebar */}
                <Sidebar
                    user={user}
                    active={active}
                    onChange={setActive}
                />

                {/* Main Content */}
                <main className="flex-1 p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
                    {renderContent()}
                </main>

            </div>
        </div>
    );
}

/* ---------- Office Style Stat Card ---------- */

const StatCard = ({ title, value }) => (
    <div className="bg-white border border-gray-300 shadow-sm p-5">
        <p className="text-sm font-medium text-gray-600">
            {title}
        </p>

        <p className="text-2xl font-semibold text-gray-800 mt-3">
            {value}
        </p>
    </div>
);
