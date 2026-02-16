import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";

export default function AllTask() {
    const { user, token } = useAuth();
    const API_TASKS = "http://localhost:8181/api/v1/task/getall";

    const [tasks, setTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [message, setMessage] = useState("");
    const [comments, setComments] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 5;

    const dropdownRef = useRef(null);

    const statusColor = {
        TODO: "bg-gray-400 text-gray-900",
        IN_PROGRESS: "bg-yellow-200 text-yellow-800",
        SUBMITTED: "bg-blue-200 text-blue-800",
        APPROVED: "bg-green-200 text-green-800",
        REJECTED: "bg-red-200 text-red-800",
    };

    // Fetch tasks
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch(API_TASKS, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, [token]);

    const categories = Array.from(
        new Set(tasks.flatMap((t) => t.categories.map((c) => c.name)))
    );

    const filteredTasks = (selectedCategory
            ? tasks.filter((t) => t.categories.some((c) => c.name === selectedCategory))
            : tasks
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination calculations
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    // Click outside dropdown to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch comments
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

    // Send decision
    const sendDecision = async (taskId, statusValue) => {
        try {
            const payload = {
                comment: message,
                commentById: user.userId,
                status: statusValue,
            };

            await api.post(`/task/submit/${taskId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? { ...t, status: statusValue } : t))
            );

            setSelectedTask(null);
            setMessage("");
        } catch (err) {
            console.error("Action failed", err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            {/* Header */}
            <h2 className="text-center text-xl font-semibold text-[#00A662] mb-6">
                All Task List
            </h2>

            {/* Filter */}
            <div className="mb-4 flex justify-end relative w-60" ref={dropdownRef}>
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

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Due Date</th>
                        <th className="px-4 py-2">Assigned To</th>
                        <th className="px-4 py-2">Created By</th>
                        <th className="px-4 py-2">Categories</th>
                        <th className="px-4 py-2">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentTasks.map((task) => (
                        <tr
                            key={task.id}
                            onClick={() => {
                                setSelectedTask(task);
                                fetchComments(task.id);
                            }}
                            className={`cursor-pointer hover:bg-gray-50 transition border-b border-gray-200`}
                        >
                            <td className="px-4 py-2 font-medium">{task.title}</td>
                            <td className="px-4 py-2 text-red-500">
                                {new Date(task.dueDate).toLocaleString()}
                            </td>
                            <td className="px-4 py-2">{task.assignedTo?.username}</td>
                            <td className="px-4 py-2">{task.createdBy?.username}</td>
                            <td className="px-4 py-2">
                                {task.categories.map((c) => (
                                    <span
                                        key={c.id}
                                        className="px-2 py-1 bg-gray-100 rounded-full text-xs mr-1"
                                    >
                      {c.name}
                    </span>
                                ))}
                            </td>
                            <td className="px-4 py-2">
                  <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                          statusColor[task.status] || "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {task.status}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-[#00A662] text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold">{selectedTask.title}</h3>
                            <button
                                onClick={() => {
                                    setSelectedTask(null);
                                    setMessage("");
                                    setComments([]);
                                }}
                                className="text-white hover:text-gray-200 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 space-y-3 text-gray-700">
                            <p>
                                <strong>Description:</strong>
                                <br />
                                {selectedTask.description}
                            </p>
                            <p>
                                <strong>Due:</strong> {new Date(selectedTask.dueDate).toLocaleString()}
                            </p>
                            <p>
                                <strong>Assigned To:</strong> {selectedTask.assignedTo?.username}
                            </p>
                            <p>
                                <strong>Created By:</strong> {selectedTask.createdBy?.username}
                            </p>
                            <p>
                                <strong>Categories:</strong> {selectedTask.categories.map((c) => c.name).join(", ")}
                            </p>

                            <hr />

                            <h4 className="font-semibold">Messages</h4>
                            {comments.length === 0 && (
                                <p className="text-sm text-gray-400">No messages yet</p>
                            )}
                            {comments.map((c) => (
                                <div
                                    key={c.id}
                                    className={`p-2 rounded text-sm ${
                                        c.commentBy?.id === user.userId
                                            ? "bg-green-200"
                                            : c.role === "CEO"
                                                ? "bg-yellow-100"
                                                : "bg-gray-100"
                                    }`}
                                >
                                    <p>{c.comment}</p>
                                    <p className="text-xs text-gray-500">
                                        {c.commentBy?.id === user.userId ? "ME" : c.role} •{" "}
                                        {new Date(c.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* CEO DECISION */}
                        {user.roles?.includes("CEO") && selectedTask.status === "SUBMITTED" && (
                            <div className="bg-gray-50 p-4 flex flex-col gap-2">
                <textarea
                    rows="3"
                    placeholder="Enter message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border rounded p-2"
                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => sendDecision(selectedTask.id, "APPROVED")}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => sendDecision(selectedTask.id, "REJECTED")}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
