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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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

    /* ================= ADD USER ================= */
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
            permissions: [], // handled by backend via role
        });
        setShowModal(true);
    };

    /* ================= EDIT USER ================= */
    const openEditModal = (u) => {
        setIsEdit(true);

        const permissionsFromRoles =
            u.roles?.flatMap(
                (role) => role.permissions?.map((p) => p.name) || []
            ) || [];

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

    /* ================= SAVE ================= */
    const handleSave = async () => {
        try {
            // FRONTEND PASSWORD MATCH VALIDATION
            if (!isEdit && formUser.password !== formUser.confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            let payload;

            if (isEdit) {
                // Update user keeps existing structure
                payload = formUser;
            } else {
                // Add user payload matches backend
                payload = {
                    username: formUser.username,
                    password: formUser.password || "1234",
                    email: formUser.email,
                    roles: [formUser.role],
                };
            }

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
                isEdit
                    ? prev.map((u) => (u.userId === saved.userId ? saved : u))
                    : [...prev, saved]
            );

            setShowModal(false);
        } catch (err) {
            console.error(err);
            alert("Operation failed");
        }
    };

    /* ================= STATES ================= */
    if (loading) return <p className="text-center mt-6">Loading users...</p>;
    if (!hasAccess)
        return (
            <p className="text-red-500 text-center mt-6">Access Denied</p>
        );
    if (error)
        return <p className="text-red-500 text-center mt-6">{error}</p>;

    /* ================= UI ================= */
    return (
        <div className="max-w-4xl mx-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-teal-800">
                    User Management
                </h2>
                <button
                    onClick={openAddModal}
                    className="bg-teal-700 text-white px-4 py-1 rounded hover:bg-teal-800"
                >
                    + Add User
                </button>
            </div>

            {/* USERS LIST */}
            <div className="space-y-4">
                {users.map((u) => (
                    <div
                        key={u.userId}
                        className="bg-white border rounded p-4 flex justify-between items-center hover:shadow"
                    >
                        <div>
                            <p className="font-semibold">{u.username}</p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                            <p className="text-xs text-gray-400">
                                Role: {u.roles?.[0]?.roleName}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                                {u.status || "ACTIVE"}
                            </span>
                            <button
                                onClick={() => openEditModal(u)}
                                className="text-blue-600 hover:text-blue-800"
                                title="Edit user"
                            >
                                ✏️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">
                            {isEdit ? "Edit User" : "Add User"}
                        </h3>

                        <input
                            className="w-full border rounded px-3 py-2 mb-3"
                            placeholder="Username"
                            value={formUser.username}
                            onChange={(e) =>
                                setFormUser({
                                    ...formUser,
                                    username: e.target.value,
                                })
                            }
                        />

                        <input
                            type="email"
                            className="w-full border rounded px-3 py-2 mb-3"
                            placeholder="Email"
                            value={formUser.email}
                            onChange={(e) =>
                                setFormUser({
                                    ...formUser,
                                    email: e.target.value,
                                })
                            }
                        />

                        {/* PASSWORD + CONFIRM PASSWORD ON ADD */}
                        {!isEdit && (
                            <>
                                <input
                                    type="password"
                                    className="w-full border rounded px-3 py-2 mb-3"
                                    placeholder="Password"
                                    value={formUser.password || ""}
                                    onChange={(e) =>
                                        setFormUser({
                                            ...formUser,
                                            password: e.target.value,
                                        })
                                    }
                                />
                                <input
                                    type="password"
                                    className={`w-full border rounded px-3 py-2 mb-3 ${
                                        formUser.confirmPassword &&
                                        formUser.password !==
                                        formUser.confirmPassword
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    placeholder="Confirm Password"
                                    value={formUser.confirmPassword || ""}
                                    onChange={(e) =>
                                        setFormUser({
                                            ...formUser,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                />
                                {formUser.confirmPassword &&
                                    formUser.password !==
                                    formUser.confirmPassword && (
                                        <p className="text-red-500 text-sm mb-3">
                                            Passwords do not match
                                        </p>
                                    )}
                            </>
                        )}

                        <select
                            className="w-full border rounded px-3 py-2 mb-3"
                            value={formUser.role}
                            onChange={(e) =>
                                setFormUser({
                                    ...formUser,
                                    role: e.target.value,
                                })
                            }
                        >
                            <option value="NORMAL_USER">Normal User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="CEO">CEO</option>
                        </select>

                        {/* PERMISSIONS – EDIT ONLY */}
                        {isEdit && (
                            <div className="border rounded p-3 mb-4">
                                <p className="text-sm font-semibold mb-2 text-gray-600">
                                    Permissions
                                </p>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                                    {AVAILABLE_PERMISSIONS.map((perm) => (
                                        <label
                                            key={perm}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formUser.permissions.includes(
                                                    perm
                                                )}
                                                onChange={() =>
                                                    togglePermission(perm)
                                                }
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
                                className="px-3 py-1 bg-teal-700 text-white rounded disabled:opacity-50"
                                disabled={
                                    !isEdit &&
                                    formUser.password !== formUser.confirmPassword
                                }
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
