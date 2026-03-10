import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
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

    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalUsers: 0
    });

    const [loading, setLoading] = useState(true);

    const [usersTasks, setUsersTasks] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    /* ---------------- DASHBOARD STATS ---------------- */

    useEffect(() => {

        const fetchDashboard = async () => {
            try {

                const res = await api.get("/dashboard");

                setStats(res.data);

            } catch (err) {
                console.error("Dashboard error:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchDashboard();

    }, [user]);



    /* ---------------- USERS TASK SUMMARY ---------------- */

    useEffect(() => {

        const fetchUsersTasks = async () => {

            setUsersLoading(true);

            try {

                const res = await api.get("/dashboard/users-tasks");

                setUsersTasks(res.data);

            } catch (err) {

                console.error("Users task error:", err);
                setUsersTasks([]);

            } finally {

                setUsersLoading(false);

            }
        };

        if (user) fetchUsersTasks();

    }, [user]);



    /* ---------------- STATUS BADGE ---------------- */

    const StatusBadge = ({ status, count }) => {

        const colors = {
            TODO: "bg-gray-200 text-gray-800",
            IN_PROGRESS: "bg-yellow-100 text-yellow-800",
            SUBMITTED: "bg-blue-100 text-blue-800",
            APPROVED: "bg-green-100 text-green-800",
            REJECTED: "bg-red-100 text-red-800"
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-800"}`}>
                {count || 0}
            </span>
        );
    };



    /* ---------------- CONTENT SWITCH ---------------- */

    const renderContent = () => {

        switch (active) {

            case "myTasks":
                return <MyTasks />;

            case "allTasks":
                return <AllTasks />;

            case "createTask":
                return <CreateTask onTaskAdded={() => setActive("allTasks")} />;

            case "users":
                return <Users />;

            case "reports":
                return <Reports />;

            case "settings":
                return <Settings />;

            default:

                return loading ? (

                    <p>Loading dashboard...</p>

                ) : (

                    <div className="space-y-6">

                        {/* Welcome */}
                        <div className="bg-white border border-gray-300 p-6 shadow-sm rounded-md">
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



                        {/* KPI */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

                            <StatCard title="Total Tasks" value={stats.totalTasks} />

                            <StatCard title="Completed Tasks" value={stats.completedTasks} />

                            <StatCard title="Pending Tasks" value={stats.pendingTasks} />

                            <StatCard title="Total Users" value={stats.totalUsers} />

                        </div>



                        {/* USERS TABLE */}
                        {(user.roles?.includes("ADMIN") || user.roles?.includes("CEO")) && (

                            <div className="bg-white border border-gray-300 p-4 rounded-md shadow-sm">

                                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                                    Users Task Summary
                                </h2>

                                {usersLoading ? (

                                    <p>Loading users...</p>

                                ) : (

                                    <div className="overflow-x-auto">

                                        <table className="w-full text-sm text-left text-gray-700">

                                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">

                                            <tr>

                                                <th className="px-3 py-2">Username</th>
                                                <th className="px-3 py-2">Roles</th>
                                                <th className="px-3 py-2">TODO</th>
                                                <th className="px-3 py-2">In Progress</th>
                                                <th className="px-3 py-2">Submitted</th>
                                                <th className="px-3 py-2">Approved</th>
                                                <th className="px-3 py-2">Rejected</th>
                                                <th className="px-3 py-2">Total</th>

                                            </tr>

                                            </thead>


                                            <tbody className="divide-y divide-gray-100">

                                            {usersTasks.map((u) => {

                                                const tasks = u.tasks || {};
                                                const total = Object.values(tasks).reduce((a, b) => a + b, 0);

                                                return (

                                                    <tr key={u.userId} className="hover:bg-gray-50">

                                                        <td className="px-3 py-2">{u.username}</td>

                                                        <td className="px-3 py-2">{u.roles?.join(", ")}</td>

                                                        <td className="px-3 py-2">
                                                            <StatusBadge status="TODO" count={tasks.TODO}/>
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            <StatusBadge status="IN_PROGRESS" count={tasks.IN_PROGRESS}/>
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            <StatusBadge status="SUBMITTED" count={tasks.SUBMITTED}/>
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            <StatusBadge status="APPROVED" count={tasks.APPROVED}/>
                                                        </td>

                                                        <td className="px-3 py-2">
                                                            <StatusBadge status="REJECTED" count={tasks.REJECTED}/>
                                                        </td>

                                                        <td className="px-3 py-2 font-semibold">{total}</td>

                                                    </tr>

                                                );
                                            })}

                                            </tbody>

                                        </table>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                );
        }
    };



    return (

        <div className="min-h-screen bg-gray-100">

            <Topbar user={user} onLogout={handleLogout} />

            <div className="flex">

                <Sidebar user={user} active={active} onChange={setActive} />

                <main className="flex-1 p-8 bg-gray-50 min-h-[calc(100vh-64px)]">

                    {renderContent()}

                </main>

            </div>

        </div>

    );
}



/* ---------- Stat Card ---------- */

const StatCard = ({ title, value }) => (

    <div className="bg-white border border-gray-300 shadow-sm p-5 rounded-md">

        <p className="text-sm font-medium text-gray-600">{title}</p>

        <p className="text-2xl font-semibold text-gray-800 mt-3">{value}</p>

    </div>

);