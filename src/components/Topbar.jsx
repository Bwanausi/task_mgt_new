import { FaSearch, FaUserCircle, FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";
import profile from "../assets/img/prof.jpg";
import logo from "../assets/img/tfc.png";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Topbar({ user, onLogout }) {
    const { token } = useAuth(); // Use Auth context token
    const [open, setOpen] = useState(false); // Profile menu
    const [notifOpen, setNotifOpen] = useState(false); // Notification popup
    const [notifications, setNotifications] = useState([]);
    const [loadingIds, setLoadingIds] = useState([]); // Track notifications being marked as read

    const menuRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch unread notifications
    useEffect(() => {
        if (!user?.userId || !token) return;

        const fetchNotifications = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8181/api/v1/notifications/unread/${user.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setNotifications(data);
            } catch (err) {
                console.error("Notification fetch error:", err);
            }
        };

        fetchNotifications();
    }, [user, token]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // Handle notification click → mark as read
    const handleNotificationClick = async (notifId) => {
        if (!token) {
            console.error("User not authenticated");
            return;
        }

        if (loadingIds.includes(notifId)) return;
        setLoadingIds((prev) => [...prev, notifId]);

        try {
            const res = await fetch(
                `http://localhost:8181/api/v1/notifications/read/${notifId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            setNotifications((prev) =>
                prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
            );
        } catch (err) {
            console.error("Mark as read error:", err);
            alert("Failed to mark notification as read. Please try again.");
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== notifId));
        }
    };

    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-2">

                {/* LOGO */}
                <div className="flex items-center h-12">
                    <img src={logo} alt="TFC Logo" className="h-10 w-auto object-contain -ml-1" />
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

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4">

                    {/* NOTIFICATIONS */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative p-2 text-gray-600 hover:text-[#00A662] transition"
                        >
                            <FaBell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {notifOpen && (
                            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">

                                {/* Header */}
                                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                                    <span className="font-semibold text-slate-700">Notifications</span>
                                    <span className="text-xs text-gray-400">{unreadCount} new</span>
                                </div>

                                {/* Body */}
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-4 text-sm text-gray-500 text-center">No new notifications</p>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                className={`px-4 py-3 flex gap-3 border-b border-gray-200 last:border-b-0 cursor-pointer transition
                                                ${!n.read ? "bg-emerald-50 hover:bg-emerald-100" : "hover:bg-gray-50"}`}
                                                onClick={() => handleNotificationClick(n.id)}
                                            >
                                                {!n.read && (
                                                    <span className="mt-2 h-2 w-2 bg-emerald-500 rounded-full flex-shrink-0"></span>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-800 leading-snug">{n.message}</p>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(n.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                {loadingIds.includes(n.id) && <span className="text-xs text-gray-400">⏳</span>}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-4 py-2 text-center bg-gray-50 border-t border-gray-200">
                                    <button className="text-sm text-[#00A662] hover:underline">
                                        View all notifications
                                    </button>
                                </div>

                            </div>
                        )}
                    </div>

                    {/* USER */}
                    {user && (
                        <div className="relative flex items-center gap-3" ref={menuRef}>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-slate-800">{user.username}</p>
                                <p className="text-xs text-slate-500">{user.role}</p>
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
                                        <FaUserCircle /> Profile
                                    </button>

                                    <button className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-100 text-sm">
                                        <FaCog /> Settings
                                    </button>

                                    <div className="border-t border-gray-200" />

                                    <button
                                        onClick={onLogout}
                                        className="w-full px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-red-50 text-sm font-medium"
                                    >
                                        <FaSignOutAlt /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
}
