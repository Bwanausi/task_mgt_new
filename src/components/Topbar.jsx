// src/components/Topbar.jsx
import { FaSearch, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import profile from "../assets/img/prof.jpg";
import logo from "../assets/img/tfc.png"; // Your logo
import { useState, useRef, useEffect } from "react";

export default function Topbar({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="w-full bg-white border-b border-gray-300 shadow-sm">
            <div className="flex items-center justify-between px-6 py-2">

                {/* LOGO */}
                <div className="flex items-center h-12">
                    <img
                        src={logo}
                        alt="TFC Logo"
                        className="h-10 w-auto object-contain -ml-1"
                    />
                </div>

                {/* SEARCH */}
                <div className="hidden md:flex items-center w-1/2 max-w-xl bg-gray-100 rounded-md overflow-hidden">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full px-4 py-2 bg-transparent text-slate-700 focus:outline-none"
                    />
                    <button className="px-4 text-slate-500 hover:text-[#00A662] transition-colors">
                        <FaSearch />
                    </button>
                </div>

                {/* USER */}
                {user && (
                    <div className="relative flex items-center gap-3" ref={menuRef}>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-800">
                                {user.username}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user.role}
                            </p>
                        </div>

                        <img
                            src={user.avatar || profile}
                            alt="profile"
                            onClick={() => setOpen(!open)}
                            className="w-9 h-9 rounded-full border cursor-pointer"
                        />

                        {open && (
                            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                                <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 text-sm">
                                    <FaUserCircle />
                                    Profile
                                </button>

                                <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 text-sm">
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
