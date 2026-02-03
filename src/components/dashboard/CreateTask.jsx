import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";

export default function CreateTask({ onTaskAdded }) {
    const API_BASE = "http://localhost:8181/api/v1/task";
    const USER_API = "http://localhost:8181/api/v1/getusers";
    const { token } = useAuth();

    const CATEGORY_OPTIONS = [
        "Operations", "Logistic", "Finance", "IT",
        "HR", "Sales", "Admin", "Compliance", "Health",
    ];

    const STATUS_OPTIONS = ["TODO", "IN_PROGRESS", "DONE"];
    const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH"];

    const [users, setUsers] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "LOW",
        status: "TODO",
        categories: [],
        assignedTo: null
    });
    const [userSearch, setUserSearch] = useState("");
    const [errors, setErrors] = useState({});
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const priorityColor = {
        LOW: "bg-green-500",
        MEDIUM: "bg-yellow-500",
        HIGH: "bg-red-500",
    };

    /* ================= LOAD USERS ================= */
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(USER_API, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, [token]);

    /* ================= FILTERED USERS ================= */
    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(userSearch.toLowerCase())
    );

    /* ================= CLOSE DROPDOWN ON CLICK OUTSIDE ============ */
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /* ================= HANDLE CATEGORY SELECT ================= */
    const toggleCategory = (cat) => {
        setNewTask(prev => {
            if (prev.categories.includes(cat)) {
                return { ...prev, categories: prev.categories.filter(c => c !== cat) };
            }
            return { ...prev, categories: [...prev.categories, cat] };
        });
    };

    /* ================= ADD TASK ================= */
    const handleAddTask = async (e) => {
        e.preventDefault();

        const validationErrors = {};
        if (!newTask.title.trim()) validationErrors.title = "Title required";
        if (!newTask.categories.length) validationErrors.categories = "Select at least one category";
        if (!newTask.dueDate) validationErrors.dueDate = "Due date required";
        if (!newTask.assignedTo) validationErrors.assignedTo = "Assign user required";

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            // Send dueDate as full ISO string
            const payload = {
                ...newTask,
                dueDate: newTask.dueDate, // e.g., "2026-02-28T17:00"
                assignedTo: newTask.assignedTo, // backend expects user ID
            };

            const res = await fetch(`${API_BASE}/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save task");

            const savedTask = await res.json();
            if (onTaskAdded) onTaskAdded(savedTask);

            // reset form
            setNewTask({
                title: "",
                description: "",
                dueDate: "",
                priority: "LOW",
                status: "TODO",
                categories: [],
                assignedTo: null
            });
            setUserSearch("");
            setShowUserDropdown(false);
        } catch (err) {
            console.error(err);
            alert("Failed to add task");
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 border rounded-lg shadow">
            <h2 className="text-xl font-semibold text-teal-800 mb-4">Create New Task</h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddTask}>
                {/* TITLE */}
                <div>
                    <label className="block mb-1 font-semibold">Title</label>
                    <input
                        type="text"
                        placeholder="Task title"
                        className="w-full p-3 border rounded-lg"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                {/* DUE DATE & TIME */}
                <div>
                    <label className="block mb-1 font-semibold">Due Date & Time</label>
                    <input
                        type="datetime-local"
                        className="w-full p-3 border rounded-lg"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                    {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate}</p>}
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                    <label className="block mb-1 font-semibold">Description</label>
                    <input
                        type="text"
                        placeholder="Task description"
                        className="w-full p-3 border rounded-lg"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                </div>

                {/* PRIORITY */}
                <div>
                    <label className="block mb-1 font-semibold">Priority</label>
                    <select
                        className="w-full p-3 border rounded-lg"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                        {PRIORITY_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* STATUS */}
                <div>
                    <label className="block mb-1 font-semibold">Status</label>
                    <select
                        className="w-full p-3 border rounded-lg"
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    >
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>

                {/* CATEGORIES MULTISELECT */}
                <div className="md:col-span-2 border p-2 rounded-lg">
                    <label className="block mb-1 font-semibold">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORY_OPTIONS.map(cat => (
                            <button
                                type="button"
                                key={cat}
                                className={`px-3 py-1 rounded-full border ${
                                    newTask.categories.includes(cat)
                                        ? "bg-teal-700 text-white"
                                        : "bg-white text-gray-700"
                                }`}
                                onClick={() => toggleCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    {errors.categories && <p className="text-red-500 text-sm mt-1">{errors.categories}</p>}
                </div>

                {/* ASSIGN USER (SEARCHABLE AUTOCOMPLETE) */}
                <div className="md:col-span-2 relative" ref={dropdownRef}>
                    <label className="block mb-1 font-semibold">Assign User</label>
                    <input
                        type="text"
                        placeholder="Type username to assign"
                        className="w-full p-3 border rounded-lg mb-1"
                        value={userSearch}
                        onChange={(e) => {
                            setUserSearch(e.target.value);
                            setShowUserDropdown(!!e.target.value);
                        }}
                    />
                    {showUserDropdown && filteredUsers.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border rounded-lg max-h-40 overflow-y-auto">
                            {filteredUsers.map(u => (
                                <li
                                    key={u.userId}
                                    className="px-3 py-2 hover:bg-teal-100 cursor-pointer"
                                    onClick={() => {
                                        setNewTask({ ...newTask, assignedTo: u.userId });
                                        setUserSearch(u.username);
                                        setShowUserDropdown(false);
                                    }}
                                >
                                    {u.username}
                                </li>
                            ))}
                        </ul>
                    )}
                    {errors.assignedTo && <p className="text-red-500 text-sm">{errors.assignedTo}</p>}
                </div>

                {/* SUBMIT */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        className="bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    );
}
