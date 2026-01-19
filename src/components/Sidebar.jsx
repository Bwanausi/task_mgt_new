// src/components/Sidebar.jsx
import { SIDEBAR_ITEMS } from "../config/sidebarConfig";
import {
    FaTachometerAlt,
    FaTasks,
    FaUsers,
    FaChartBar,
    FaCog,
    FaPlus,
} from "react-icons/fa";

const ICONS_MAP = {
    dashboard: <FaTachometerAlt />,
    myTasks: <FaTasks />,
    allTasks: <FaTasks />,
    createTask: <FaPlus />,
    users: <FaUsers />,
    reports: <FaChartBar />,
    settings: <FaCog />,
};

export default function Sidebar({ user, active, onChange }) {
    const hasPermission = (required = []) =>
        required.length === 0 ||
        required.some((p) => user.permissions.includes(p));

    return (
        <aside className="w-64 bg-teal-800 text-white min-h-[calc(100vh-64px)] shadow">
            {/* TITLE */}
            <div className="px-6 py-5 text-xl font-bold tracking-wide border-b border-teal-700">
                Task List
            </div>

            {/* MENU */}
            <nav className="flex-1 py-3">
                {SIDEBAR_ITEMS.filter((item) =>
                    hasPermission(item.permissions)
                ).map((item) => (
                    <button
                        key={item.key}
                        onClick={() => onChange(item.key)}
                        className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition text-left
              ${
                            active === item.key
                                ? "bg-white text-teal-800"
                                : "hover:bg-teal-700"
                        }
            `}
                    >
                        <span className="text-base">{ICONS_MAP[item.key]}</span>
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
}
