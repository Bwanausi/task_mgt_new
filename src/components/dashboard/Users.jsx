// Users.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";

const AVAILABLE_PERMISSIONS = [
    "USER_MANAGE",
    "ROLE_MANAGE",
    "REPORT_VIEW",
    "SYSTEM_CONFIG",
    "TASK_CREATE",
    "TASK_ASSIGN",
    "TASK_UPDATE_STATUS",
    "TASK_VIEW_ALL",
    "TASK_SET_DUEDATE",
];

export default function Users() {
    const { user, token } = useAuth();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [formUser, setFormUser] = useState({
        userId: null,
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        role: "NORMAL_USER",
        status: "ACTIVE",
        permissions: [],
    });

    const hasAccess = user?.permissions?.includes("USER_MANAGE");

    /* ================= FETCH USERS ================= */
    useEffect(() => {
        if (!hasAccess) {
            setLoading(false);
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:8181/api/v1/getusers", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Fetch failed");
                setUsers(await res.json());
            } catch (err) {
                console.error(err);
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [hasAccess, token]);

    /* ================= PERMISSIONS ================= */
    const togglePermission = (perm) => {
        setFormUser((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(perm)
                ? prev.permissions.filter((p) => p !== perm)
                : [...prev.permissions, perm],
        }));
    };

    /* ================= ADD / EDIT ================= */
    const openAddModal = () => {
        setIsEdit(false);
        setFormUser({
            userId: null,
            username: "",
            password: "",
            confirmPassword: "",
            email: "",
            role: "NORMAL_USER",
            status: "ACTIVE",
            permissions: [],
        });
        setShowModal(true);
    };

    const openEditModal = (u) => {
        setIsEdit(true);

        const permissionsFromRoles =
            u.roles?.flatMap((role) => role.permissions?.map((p) => p.name) || []) || [];

        setFormUser({
            userId: u.userId,
            username: u.username,
            password: "",
            confirmPassword: "",
            email: u.email,
            role: u.roles?.[0]?.roleName || "NORMAL_USER",
            status: u.status || "ACTIVE",
            permissions: permissionsFromRoles,
        });

        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (!isEdit && formUser.password !== formUser.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            const payload = isEdit
                ? formUser
                : {
                    username: formUser.username,
                    password: formUser.password || "1234",
                    email: formUser.email,
                    roles: [formUser.role],
                };

            const url = isEdit
                ? `http://localhost:8181/api/v1/updateuser/${formUser.userId}`
                : "http://localhost:8181/api/v1/adduser";

            const res = await fetch(url, {
                method: isEdit ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Save failed");

            const saved = await res.json();

            setUsers((prev) =>
                isEdit ? prev.map((u) => (u.userId === saved.userId ? saved : u)) : [...prev, saved]
            );

            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert("Operation failed");
        }
    };

    /* ================= REMOVE USER ================= */
    const handleRemove = async (userId) => {
        if (!confirm("Are you sure you want to remove this user?")) return;

        try {
            const res = await fetch(`http://localhost:8181/api/v1/deleteuser/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Delete failed");

            setUsers((prev) => prev.filter((u) => u.userId !== userId));
        } catch (err) {
            console.error(err);
            alert("Failed to remove user");
        }
    };

    if (loading) return <p className="text-center mt-6">Loading users...</p>;
    if (!hasAccess) return <p className="text-red-500 text-center mt-6">Access Denied</p>;
    if (error) return <p className="text-red-500 text-center mt-6">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-800">User Management</h2>
                <button
                    onClick={openAddModal}
                    className="bg-[#00A662] text-white px-5 py-2 rounded font-semibold text-sm hover:bg-[#00804d] transition-colors"
                >
                    Add New User
                </button>
            </div>

            {/* USERS TABLE */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => {
                        const isActive = String(u.status || "ACTIVE").trim().toUpperCase() === "ACTIVE";
                        return (
                            <tr key={u.userId} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-2 font-medium">{u.username}</td>
                                <td className="px-4 py-2 text-gray-600 truncate">{u.email}</td>
                                <td className="px-4 py-2 text-gray-500">{u.roles?.[0]?.roleName}</td>
                                <td className="px-4 py-2">
                    <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {isActive ? "ACTIVE" : u.status || "INACTIVE"}
                    </span>
                                </td>
                                <td className="px-4 py-2 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => openEditModal(u)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit user"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleRemove(u.userId)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete user"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 border border-gray-200 shadow-md">
                        <h3 className="text-lg font-semibold mb-4">{isEdit ? "Edit User" : "Add User"}</h3>

                        <input
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                            placeholder="Username"
                            value={formUser.username}
                            onChange={(e) => setFormUser({ ...formUser, username: e.target.value })}
                        />

                        <input
                            type="email"
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                            placeholder="Email"
                            value={formUser.email}
                            onChange={(e) => setFormUser({ ...formUser, email: e.target.value })}
                        />

                        {!isEdit && (
                            <>
                                <input
                                    type="password"
                                    className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                                    placeholder="Password"
                                    value={formUser.password || ""}
                                    onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
                                />
                                <input
                                    type="password"
                                    className={`w-full border border-gray-300 rounded px-3 py-2 mb-3 ${
                                        formUser.confirmPassword && formUser.password !== formUser.confirmPassword
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    placeholder="Confirm Password"
                                    value={formUser.confirmPassword || ""}
                                    onChange={(e) => setFormUser({ ...formUser, confirmPassword: e.target.value })}
                                />
                                {formUser.confirmPassword && formUser.password !== formUser.confirmPassword && (
                                    <p className="text-red-500 text-sm mb-3">Passwords do not match</p>
                                )}
                            </>
                        )}

                        <select
                            className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                            value={formUser.role}
                            onChange={(e) => setFormUser({ ...formUser, role: e.target.value })}
                        >
                            <option value="NORMAL_USER">Normal User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="CEO">CEO</option>
                        </select>

                        {isEdit && (
                            <div className="border border-gray-200 rounded p-3 mb-4 max-h-40 overflow-y-auto">
                                <p className="text-sm font-semibold mb-2 text-gray-600">Permissions</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {AVAILABLE_PERMISSIONS.map((perm) => (
                                        <label key={perm} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={formUser.permissions.includes(perm)}
                                                onChange={() => togglePermission(perm)}
                                            />
                                            {perm.replaceAll("_", " ")}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1 bg-gray-300 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-[#00A662] text-white rounded disabled:opacity-50"
                                disabled={!isEdit && formUser.password !== formUser.confirmPassword}
                            >
                                {isEdit ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
