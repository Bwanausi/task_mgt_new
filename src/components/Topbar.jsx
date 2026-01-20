// src/components/Topbar.jsx
import { FaSearch, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import profile from "../assets/img/prof.jpg";
import { useState, useRef, useEffect } from "react";

export default function Topbar({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-gradient-to-r from-teal-900 to-teal-900 text-white shadow">
            <div className="flex items-center justify-between px-6 py-3">

                {/* LEFT – LOGO */}
                <h1 className="text-2xl font-bold tracking-wide">
                    TFC<span className="text-red-400">TaskMinder</span>
                </h1>

                {/* CENTER – SEARCH */}
                <div className="hidden md:flex items-center w-1/2 max-w-xl bg-white rounded-md overflow-hidden">
                    <input
                        type="text"
                        placeholder="Search Tasks"
                        className="w-full px-4 py-2 text-gray-700 focus:outline-none"
                    />
                    <button className="px-4 text-teal-700 hover:text-teal-900">
                        <FaSearch />
                    </button>
                </div>

                {/* RIGHT – USER */}
                {user && (
                    <div className="relative flex items-center gap-4" ref={menuRef}>

                        {/* User info */}
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold">{user.username}</p>
                            <p className="text-xs opacity-75">{user.role}</p>
                        </div>

                        {/* Avatar */}
                        <img
                            src={user.avatar || profile}
                            alt="profile"
                            onClick={() => setOpen(!open)}
                            className="w-9 h-9 rounded-full border-2 border-white cursor-pointer"
                        />

                        {/* DROPDOWN MENU */}
                        {open && (
                            <div className="absolute right-0 top-12 w-44 bg-white text-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                                <button
                                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 text-sm"
                                >
                                    <FaUserCircle />
                                    Profile
                                </button>

                                <button
                                    className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 text-sm"
                                >
                                    <FaCog />
                                    Settings
                                </button>

                                <div className="border-t" />

                                <button
                                    onClick={onLogout}
                                    className="w-full px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-red-50 text-sm font-medium"
                                >
                                    <FaSignOutAlt />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
