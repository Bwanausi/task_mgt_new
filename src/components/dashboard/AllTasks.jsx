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
        TODO: "bg-gray-200 text-gray-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-800",
        SUBMITTED: "bg-blue-200 text-blue-800",
        APPROVED: "bg-green-200 text-green-800",
        REJECTED: "bg-red-200 text-red-800",
    };

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

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
        <div className="max-w-6xl mx-auto p-4 font-sans">
            {/* HEADER */}
            <h2 className="text-center text-xl font-semibold text-[#00A662] mb-6">
                All Task List
            </h2>

            {/* CATEGORY DROPDOWN */}
            <div className="mb-4 flex justify-end relative w-60" ref={dropdownRef}>
                <button
                    className="w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm text-gray-700 font-medium flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00A662] transition"
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

            {/* TABLE */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-2 border-b border-gray-200">Title</th>
                        <th className="px-4 py-2 border-b border-gray-200">Due Date</th>
                        <th className="px-4 py-2 border-b border-gray-200">Assigned To</th>
                        <th className="px-4 py-2 border-b border-gray-200">Created By</th>
                        <th className="px-4 py-2 border-b border-gray-200">Categories</th>
                        <th className="px-4 py-2 border-b border-gray-200">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                    {currentTasks.map((task) => (
                        <tr
                            key={task.id}
                            onClick={() => {
                                setSelectedTask(task);
                                fetchComments(task.id);
                            }}
                            className="cursor-pointer hover:bg-gray-50 transition"
                        >
                            <td className="px-4 py-2 font-medium">{task.title}</td>
                            <td className="px-4 py-2 text-red-500">{new Date(task.dueDate).toLocaleString()}</td>
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
                      className={`px-2 py-1 text-xs font-semibold rounded ${statusColor[task.status]}`}
                  >
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
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${
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
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* TASK POPUP MODAL */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white w-full max-w-lg max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col font-sans border border-gray-200">

                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-[#00A662] to-[#007f50] text-white p-5 flex justify-between items-center">
                            <h3 className="text-xl font-bold truncate">{selectedTask.title}</h3>
                            <button
                                onClick={() => {
                                    setSelectedTask(null);
                                    setMessage("");
                                    setComments([]);
                                }}
                                className="text-white text-2xl hover:opacity-80 transition"
                            >
                                ✕
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-5 space-y-5 text-gray-700 overflow-y-auto flex-1 leading-relaxed">
                            <div className="grid grid-cols-3 gap-3 text-sm">
                                <span className="font-semibold text-gray-500">Description:</span>
                                <span className="col-span-2">{selectedTask.description}</span>

                                <span className="font-semibold text-gray-500">Due:</span>
                                <span className="col-span-2">{new Date(selectedTask.dueDate).toLocaleString()}</span>

                                <span className="font-semibold text-gray-500">Assigned To:</span>
                                <span className="col-span-2">{selectedTask.assignedTo?.username}</span>

                                <span className="font-semibold text-gray-500">Created By:</span>
                                <span className="col-span-2">{selectedTask.createdBy?.username}</span>

                                <span className="font-semibold text-gray-500">Categories:</span>
                                <span className="col-span-2">
                  {selectedTask.categories.map(c => c.name).join(", ")}
                </span>
                            </div>

                            <div className="border-t border-gray-200" />

                            <h4 className="font-semibold text-gray-800 text-md">Messages</h4>
                            {comments.length === 0 && (
                                <p className="text-sm text-gray-400 italic">No messages yet</p>
                            )}
                            {comments.map((c) => (
                                <div
                                    key={c.id}
                                    className={`p-3 rounded-lg text-sm ${
                                        c.commentBy?.id === user.userId
                                            ? "bg-green-100"
                                            : c.role === "CEO"
                                                ? "bg-yellow-100"
                                                : "bg-gray-100"
                                    } border border-gray-200`}
                                >
                                    <p className="mb-1">{c.comment}</p>
                                    <p className="text-xs text-gray-500">
                                        {c.commentBy?.id === user.userId ? "ME" : c.role} •{" "}
                                        {new Date(c.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* FOOTER - CEO ACTIONS */}
                        {user.roles?.includes("CEO") && selectedTask.status === "SUBMITTED" && (
                            <div className="bg-gray-50 p-5 border-t flex flex-col gap-3">
                <textarea
                    rows="3"
                    placeholder="Enter message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-[#00A662] focus:outline-none placeholder-gray-400"
                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => sendDecision(selectedTask.id, "APPROVED")}
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => sendDecision(selectedTask.id, "REJECTED")}
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
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
