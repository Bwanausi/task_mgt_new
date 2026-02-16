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

    const STATUS_OPTIONS = ["TODO"];
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
    const [file, setFile] = useState(null);
    const [userSearch, setUserSearch] = useState("");
    const [errors, setErrors] = useState({});
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(USER_API, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) throw new Error("Failed to load users");
                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, [token]);

    const filteredUsers = users.filter(u => u.username.toLowerCase().includes(userSearch.toLowerCase()));

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowUserDropdown(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleCategory = (cat) => {
        setNewTask(prev => ({
            ...prev,
            categories: prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat]
        }));
    };

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
            const formData = new FormData();
            formData.append("title", newTask.title);
            formData.append("description", newTask.description);
            formData.append("dueDate", newTask.dueDate);
            formData.append("priority", newTask.priority);
            formData.append("status", newTask.status);
            formData.append("assignedTo", newTask.assignedTo);
            formData.append("categories", JSON.stringify(newTask.categories));

            if (file) formData.append("file", file);

            const res = await fetch(`${API_BASE}/add`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (!res.ok) throw new Error("Failed to save task");

            const savedTask = await res.json();
            if (onTaskAdded) onTaskAdded(savedTask);

            // Reset form
            setNewTask({ title: "", description: "", dueDate: "", priority: "LOW", status: "TODO", categories: [], assignedTo: null });
            setFile(null);
            setUserSearch("");
            setShowUserDropdown(false);
            alert("Task added successfully");
        } catch (err) {
            console.error(err);
            alert("Failed to add task");
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-white p-5 border border-gray-200 rounded shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Create New Task</h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleAddTask}>

                {/* TITLE */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Title</label>
                    <input
                        type="text"
                        placeholder="Task title"
                        className="border border-gray-300 px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#00A662]"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-0.5">{errors.title}</p>}
                </div>

                {/* DUE DATE */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Due Date & Time</label>
                    <input
                        type="datetime-local"
                        className="border border-gray-300 px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#00A662]"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    />
                    {errors.dueDate && <p className="text-red-500 text-xs mt-0.5">{errors.dueDate}</p>}
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2 flex flex-col">
                    <label className="mb-1 text-sm font-medium">Description</label>
                    <textarea
                        placeholder="Task description"
                        className="border border-gray-300 px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#00A662] resize-none"
                        rows={3}
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                </div>

                {/* ATTACHMENT */}
                <div className="md:col-span-2 flex flex-col">
                    <label className="mb-1 text-sm font-medium">Attachment (optional)</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border border-gray-300 px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#00A662]"
                    />
                </div>

                {/* PRIORITY */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Priority</label>
                    <select
                        className="border border-gray-300 px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#00A662]"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                        {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* STATUS */}
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Status</label>
                    <select
                        className="border border-gray-300 px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#00A662]"
                        value={newTask.status}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    >
                        {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                </div>

                {/* CATEGORIES */}
                <div className="md:col-span-2 flex flex-col border border-gray-300 p-2 rounded">
                    <label className="mb-1 text-sm font-medium">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORY_OPTIONS.map(cat => (
                            <label key={cat} className="flex items-center gap-1 text-sm">
                                <input
                                    type="checkbox"
                                    checked={newTask.categories.includes(cat)}
                                    onChange={() => toggleCategory(cat)}
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                    {errors.categories && <p className="text-red-500 text-xs mt-0.5">{errors.categories}</p>}
                </div>

                {/* ASSIGN USER */}
                <div className="md:col-span-2 relative flex flex-col" ref={dropdownRef}>
                    <label className="mb-1 text-sm font-medium">Assign User</label>
                    <input
                        type="text"
                        placeholder="Type username"
                        className="border border-gray-300 px-2 py-1 text-sm rounded focus:outline-none focus:ring-1 focus:ring-[#00A662]"
                        value={userSearch}
                        onChange={(e) => { setUserSearch(e.target.value); setShowUserDropdown(!!e.target.value); }}
                    />
                    {showUserDropdown && filteredUsers.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded max-h-32 overflow-y-auto text-sm">
                            {filteredUsers.map(u => (
                                <li
                                    key={u.userId}
                                    className="px-2 py-1 hover:bg-[#00A662] hover:text-white cursor-pointer transition"
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
                    {errors.assignedTo && <p className="text-red-500 text-xs mt-0.5">{errors.assignedTo}</p>}
                </div>

                {/* SUBMIT BUTTON */}
                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        className="bg-[#00A662] text-white text-sm px-4 py-1 rounded hover:bg-[#008f4e] transition"
                    >
                        Create Task
                    </button>
                </div>

            </form>
        </div>
    );
}
