import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";

export default function MyTask() {
    const { user, token } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedTask, setSelectedTask] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");
    const [comments, setComments] = useState([]);

    // ===== Pagination =====
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // ===== Category Filter =====
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ================= FETCH TASKS =================
    useEffect(() => {
        if (!user) return;

        const fetchMyTasks = async () => {
            try {
                const res = await api.get(`/task/mytask/${user.userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(res.data);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMyTasks();
    }, [user, token]);

    // ================= FETCH COMMENTS =================
    const fetchComments = async (taskId) => {
        try {
            const res = await api.get(`/task/${taskId}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(res.data);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    // ================= ACCEPT TASK =================
    const handleAccept = async (taskId) => {
        try {
            await api.put(`/task/accept/${taskId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(prev =>
                prev.map(t => (t.id === taskId ? { ...t, status: "IN_PROGRESS" } : t))
            );

            setSelectedTask(null);
        } catch (err) {
            console.error("Accept failed", err);
        }
    };

    // ================= SUBMIT TASK =================
    const handleSubmit = async (task) => {
        if (!submitMessage.trim()) {
            alert("Please enter a message before submitting.");
            return;
        }

        try {
            const payload = {
                comment: submitMessage,
                commentById: user.userId,
                role: "NORMAL_USER",
                status: task.status
            };

            await api.post(`/task/submit/${task.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(prev =>
                prev.map(t => (t.id === task.id ? { ...t, status: "SUBMITTED" } : t))
            );

            setSubmitMessage("");
            setSelectedTask(null);

        } catch (err) {
            console.error("Submit failed", err);
        }
    };

    // ================= STATUS COLOR =================
    const statusColor = {
        TODO: "bg-gray-200 text-gray-800",
        IN_PROGRESS: "bg-blue-200 text-blue-800",
        SUBMITTED: "bg-blue-200 text-blue-800",
        APPROVED: "bg-green-200 text-green-800",
        REJECTED: "bg-red-200 text-red-800",
    };

    // ===== Category options =====
    const categories = Array.from(
        new Set(tasks.flatMap(task => task.categories?.map(c => c.name) || []))
    );

    // ===== Filtered tasks =====
    const filteredTasks = selectedCategory
        ? tasks.filter(task => task.categories?.some(c => c.name === selectedCategory))
        : tasks;

    // ===== Pagination logic =====
    const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // ===== Close dropdown on outside click =====
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading) return <p className="text-center mt-4">Loading tasks...</p>;
    if (!tasks.length) return <p className="text-center mt-4">No tasks assigned to you.</p>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-xl font-semibold text-[#00A662] mb-4">My Tasks</h2>

            {/* CATEGORY FILTER */}
            <div className="mb-4 w-64 relative" ref={dropdownRef}>
                <button
                    className="w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm text-gray-700 font-medium flex justify-between items-center
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00A662] transition"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {selectedCategory || "All Categories"}
                    <svg
                        className="h-4 w-4 text-gray-400 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
                {dropdownOpen && (
                    <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        <li
                            onClick={() => {
                                setSelectedCategory("");
                                setDropdownOpen(false);
                                setCurrentPage(1);
                            }}
                            className={`px-4 py-2 cursor-pointer hover:bg-[#00A662]/20 hover:text-[#007f50] ${
                                selectedCategory === "" ? "bg-[#00A662]/10" : ""
                            }`}
                        >
                            All Categories
                        </li>
                        {categories.map((cat) => (
                            <li
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setDropdownOpen(false);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 cursor-pointer hover:bg-[#00A662]/20 hover:text-[#007f50] ${
                                    selectedCategory === cat ? "bg-[#00A662]/10" : ""
                                }`}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* TASK TABLE */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Due Date</th>
                        <th className="px-4 py-2">Priority</th>
                        <th className="px-4 py-2">Categories</th>
                        <th className="px-4 py-2">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedTasks.map(task => (
                        <tr
                            key={task.id}
                            onClick={() => { setSelectedTask(task); fetchComments(task.id); }}
                            className="cursor-pointer hover:bg-gray-50 transition border-b border-gray-200"
                        >
                            <td className="px-4 py-2 font-medium">{task.title}</td>
                            <td className="px-4 py-2 text-red-500">{new Date(task.dueDate).toLocaleString()}</td>
                            <td className="px-4 py-2">{task.priority}</td>
                            <td className="px-4 py-2">
                                {task.categories?.map(c => (
                                    <span key={c.id} className="px-2 py-1 bg-gray-100 rounded-full text-xs mr-1">{c.name}</span>
                                ))}
                            </td>
                            <td className="px-4 py-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColor[task.status]}`}>
                                        {task.status}
                                    </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded transition ${
                                currentPage === page
                                    ? "bg-[#00A662] text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* MODAL */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

                        {/* HEADER */}
                        <div className="bg-[#00A662] text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold">{selectedTask.title}</h3>
                            <button
                                onClick={() => { setSelectedTask(null); setSubmitMessage(""); setComments([]); }}
                                className="text-white hover:text-gray-200 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-4 space-y-3 text-gray-700">
                            <p><strong>Description:</strong><br />{selectedTask.description}</p>
                            <p><strong>Due:</strong> {new Date(selectedTask.dueDate).toLocaleString()}</p>
                            <p><strong>Priority:</strong> {selectedTask.priority}</p>
                            <p><strong>Categories:</strong> {selectedTask.categories?.map(c => c.name).join(", ")}</p>

                            <hr />

                            <h4 className="font-semibold">Task Messages</h4>
                            {comments.length === 0 && <p className="text-sm text-gray-400">No messages yet</p>}
                            {comments.map(c => (
                                <div
                                    key={c.id}
                                    className={`p-2 rounded text-sm ${
                                        c.commentBy?.id === user.userId
                                            ? "bg-green-200"
                                            : c.role === "ADMIN"
                                                ? "bg-blue-100"
                                                : "bg-gray-100"
                                    }`}
                                >
                                    <p>{c.comment}</p>
                                    <p className="text-xs text-gray-500">{c.commentBy?.id === user.userId ? "ME" : c.role} • {new Date(c.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>

                        {/* FOOTER */}
                        <div className="bg-gray-50 p-4 flex flex-col gap-2">
                            {selectedTask.status === "TODO" && (
                                <button
                                    onClick={() => handleAccept(selectedTask.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg self-end"
                                >
                                    Accept
                                </button>
                            )}

                            {(selectedTask.status === "IN_PROGRESS" || selectedTask.status === "REJECTED") && (
                                <div className="w-full">
                                    <textarea
                                        rows="3"
                                        placeholder="Enter submission message..."
                                        value={submitMessage}
                                        onChange={e => setSubmitMessage(e.target.value)}
                                        className="w-full border rounded p-2 mb-2"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleSubmit(selectedTask)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
