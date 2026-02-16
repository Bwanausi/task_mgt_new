import { FaSearch, FaUserCircle, FaCog, FaSignOutAlt, FaBell } from "react-icons/fa";
import profile from "../assets/img/prof.jpg";
import logo from "../assets/img/tfc.png";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Topbar({ user, onLogout }) {
    const { token } = useAuth();

    const [open, setOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loadingIds, setLoadingIds] = useState([]);

    const menuRef = useRef(null);
    const notifRef = useRef(null);

    // Close dropdowns on outside click
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

    // Mark notification as read (PUT)
    const handleNotificationClick = async (notifId) => {
        if (!token) return;

        if (loadingIds.includes(notifId)) return;
        setLoadingIds((prev) => [...prev, notifId]);

        try {
            const res = await fetch(
                `http://localhost:8181/api/v1/notifications/read/${notifId}`,
                {
                    method: "PUT",   // ✅ FIXED
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            // Update UI
            setNotifications((prev) =>
                prev.map((n) =>
                    n.id === notifId ? { ...n, read: true } : n
                )
            );
        } catch (err) {
            console.error("Mark as read error:", err);
            alert("Failed to mark notification as read");
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

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                    {/* NOTIFICATIONS */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setNotifOpen(!notifOpen)}
                            className="relative p-2 text-gray-600 hover:text-[#00A662]"
                        >
                            <FaBell size={18} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {notifOpen && (
                            <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">

                                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between">
                                    <span className="font-semibold">Notifications</span>
                                    <span className="text-xs text-gray-400">{unreadCount} new</span>
                                </div>

                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <p className="p-4 text-sm text-gray-500 text-center">
                                            No new notifications
                                        </p>
                                    ) : (
                                        notifications.map((n) => (
                                            <div
                                                key={n.id}
                                                onClick={() => handleNotificationClick(n.id)}
                                                className={`px-4 py-3 flex gap-3 border-b border-gray-200 cursor-pointer
                                                ${!n.read ? "bg-emerald-50 hover:bg-emerald-100" : "hover:bg-gray-50"}`}
                                            >
                                                {!n.read && (
                                                    <span className="mt-2 h-2 w-2 bg-emerald-500 rounded-full"></span>
                                                )}
                                                <div className="flex-1">
                                                    <p className="text-sm">{n.message}</p>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(n.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                {loadingIds.includes(n.id) && <span>⏳</span>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* USER */}
                    {user && (
                        <div className="relative flex items-center gap-3" ref={menuRef}>
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold">{user.username}</p>
                                <p className="text-xs text-gray-500">{user.role}</p>
                            </div>

                            <img
                                src={user.avatar || profile}
                                alt="profile"
                                onClick={() => setOpen(!open)}
                                className="w-9 h-9 rounded-full border cursor-pointer"
                            />

                            {open && (
                                <div className="absolute right-0 top-12 w-48 bg-white border rounded shadow">
                                    <button className="w-full px-4 py-3 hover:bg-gray-100 text-sm">
                                        <FaUserCircle /> Profile
                                    </button>
                                    <button className="w-full px-4 py-3 hover:bg-gray-100 text-sm">
                                        <FaCog /> Settings
                                    </button>
                                    <button
                                        onClick={onLogout}
                                        className="w-full px-4 py-3 text-red-600 hover:bg-red-50 text-sm"
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
