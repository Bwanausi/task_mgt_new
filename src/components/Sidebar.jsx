// src/components/Sidebar.jsx
import { SIDEBAR_ITEMS } from "../config/sidebarConfig";
import { FaTachometerAlt, FaTasks, FaUsers, FaChartBar, FaCog, FaPlus } from "react-icons/fa";

const ICONS_MAP = {
    dashboard: <FaTachometerAlt />,
    myTasks: <FaTasks />,
    allTasks: <FaTasks />,
    createTask: <FaPlus />,
    users: <FaUsers />,
    reports: <FaChartBar />,
    settings: <FaCog />
};

export default function Sidebar({ user, active, onChange }) {
    const hasPermission = (required = []) =>
        required.length === 0 || required.some(p => user.permissions.includes(p));

    return (
        <aside className="w-64 bg-brand text-white flex flex-col">
            <div className="p-6 text-2xl font-bold">Executive Task</div>

            <nav className="flex-1 space-y-1 px-3">
                {SIDEBAR_ITEMS.filter(item => hasPermission(item.permissions)).map(item => (
                    <button
                        key={item.key}
                        onClick={() => onChange(item.key)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded transition
              ${active === item.key ? "bg-brand-80" : "hover:bg-brand-80"}
            `}
                    >
                        <span className="text-lg">{ICONS_MAP[item.key]}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}
