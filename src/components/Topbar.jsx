// src/components/Topbar.jsx
import profile from "../assets/img/profile.png";
import { FaSignOutAlt } from "react-icons/fa";

export default function Topbar({ user, onLogout }) {
    return (
        <header className="flex justify-between items-center bg-main text-white px-6 py-4 shadow">
            <div>
                <h1 className="text-xl font-bold">{user.role} Dashboard</h1>
                <p className="text-sm opacity-80">{user.username}</p>
            </div>

            <div className="flex items-center gap-4">
                <img
                    src={user.avatar || profile}
                    alt="profile"
                    className="w-10 h-10 rounded-full border-2 border-white"
                />
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm font-semibold"
                >
                    <FaSignOutAlt />
                    Logout
                </button>
            </div>
        </header>
    );
}
