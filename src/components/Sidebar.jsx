// src/components/Sidebar.jsx
import { SIDEBAR_ITEMS } from "../config/sidebarConfig";
import {
    FaTachometerAlt,
    FaTasks,
    FaUsers,
    FaChartBar,
    FaCog,
    FaPlus,
    FaClipboardList,
} from "react-icons/fa";

const ICONS_MAP = {
    dashboard: <FaTachometerAlt />,
    myTasks: <FaClipboardList />, // different icon from All Tasks
    allTasks: <FaTasks />,
    createTask: <FaPlus />,
    users: <FaUsers />,
    reports: <FaChartBar />,
    settings: <FaCog />,
};

export default function Sidebar({ user, active, onChange }) {

    // ✅ permissions already flat
    const userPermissions = user?.permissions || [];

    const hasPermission = (required = []) =>
        required.length === 0 ||
        required.some(p => userPermissions.includes(p));

    // ✅ CEO detection (your structure)
    const isCEO = user?.roles?.includes("CEO");

    const filteredItems = SIDEBAR_ITEMS
        .filter(item => hasPermission(item.permissions))
        .filter(item => {
            // ❌ Hide My Tasks for CEO
            if (isCEO && item.key === "myTasks") return false;
            return true;
        });

    return (
        <aside className="w-64 bg-[#F8FAFC] border-r border-gray-200 min-h-[calc(100vh-64px)] flex flex-col">

            {/* HEADER */}
            <div className="px-6 py-6 text-lg font-semibold text-slate-800">
                Workspace
            </div>

            {/* MENU */}
            <nav className="flex-1 px-3 space-y-1">
                {filteredItems.map(item => {
                    const isActive = active === item.key;

                    return (
                        <button
                            key={item.key}
                            onClick={() => onChange(item.key)}
                            className={`group w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all text-left
                                ${
                                isActive
                                    ? "bg-[#00A662] text-white shadow-sm"
                                    : "text-slate-600 hover:bg-white hover:shadow-sm"
                            }
                            `}
                        >
                            <span
                                className={`text-base transition-colors ${
                                    isActive
                                        ? "text-white"
                                        : "text-slate-400 group-hover:text-[#00A662]"
                                }`}
                            >
                                {ICONS_MAP[item.key]}
                            </span>

                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* FOOTER */}
            <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-slate-500">Logged in as</div>
                <div className="text-sm font-medium text-slate-800">
                    {user?.username}
                </div>
            </div>
        </aside>
    );
}
