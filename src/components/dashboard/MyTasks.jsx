import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";
import TaskDetails from "./TaskDetails";

export default function MyTask() {
    const { user, token } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);

    const [submitMessage, setSubmitMessage] = useState("");
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    // Category filter
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // ===== FETCH TASKS =====
    const fetchMyTasks = async () => {
        if (!user) return;
        setLoading(true);
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

    useEffect(() => {
        fetchMyTasks();
    }, [user, token]);

    // ===== FETCH COMMENTS =====
    const fetchComments = async (taskId) => {
        setCommentsLoading(true);
        setCommentsError(null);
        try {
            const res = await api.get(`/task/${taskId}/comments`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setComments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load comments", err);
            setComments([]);
            setCommentsError(err.message || "Failed to load comments");
        } finally {
            setCommentsLoading(false);
        }
    };

    // ===== SEND DECISION =====
    const sendDecision = async (taskId, statusValue) => {
        try {
            if (statusValue === "SUBMITTED") {
                const payload = {
                    comment: submitMessage,
                    commentById: user.userId,
                    role: "NORMAL_USER",
                    status: tasks.find((t) => t.id === taskId)?.status,
                };

                await api.post(`/task/submit/${taskId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else if (statusValue === "IN_PROGRESS") {
                await api.put(`/task/accept/${taskId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await api.post(`/task/decision/${taskId}`, { status: statusValue }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            await fetchMyTasks();

            if (selectedTask?.id === taskId) {
                setSelectedTask(prev => prev ? { ...prev, status: statusValue } : prev);
            }

            setSubmitMessage("");
        } catch (err) {
            console.error("Decision action failed", err);
            alert("Action failed: " + err.message);
        }
    };

    // ===== STATUS COLORS =====
    const statusColor = {
        TODO: "bg-gray-200 text-gray-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-800",
        SUBMITTED: "bg-blue-200 text-blue-800",
        APPROVED: "bg-green-200 text-green-800",
        REJECTED: "bg-red-200 text-red-800",
    };

    // ===== CATEGORIES =====
    const categories = Array.from(
        new Set(tasks.flatMap(t => t.categories?.map(c => c.name) || []))
    );

    // ===== FILTER + PAGINATION =====
    const filteredTasks = selectedCategory
        ? tasks.filter(t => t.categories?.some(c => c.name === selectedCategory))
        : tasks;

    const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);

    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // ===== CLOSE DROPDOWN =====
    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (loading && !selectedTask)
        return <p className="text-center mt-4">Loading tasks...</p>;

    if (!tasks.length && !selectedTask)
        return <p className="text-center mt-4">No tasks assigned to you.</p>;

    return (
        <div className="w-full mx-auto p-4">

            <h2 className="text-xl font-semibold text-[#00A662] mb-4">
                My Tasks
            </h2>

            {/* CATEGORY FILTER */}
            <div className="mb-4 w-64 relative" ref={dropdownRef}>
                <button
                    className="w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm text-gray-700 font-medium flex justify-between items-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#00A662]"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {selectedCategory || "All Categories"}
                    <svg
                        className="h-4 w-4 text-gray-400 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>

                {dropdownOpen && (
                    <ul className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        <li
                            onClick={() => { setSelectedCategory(""); setDropdownOpen(false); setCurrentPage(1); }}
                            className="px-4 py-2 cursor-pointer hover:bg-[#00A662]/20"
                        >
                            All Categories
                        </li>
                        {categories.map(cat => (
                            <li
                                key={cat}
                                onClick={() => { setSelectedCategory(cat); setDropdownOpen(false); setCurrentPage(1); }}
                                className="px-4 py-2 cursor-pointer hover:bg-[#00A662]/20"
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* TASK TABLE */}
            {!selectedTask && (
                <>
                    <div className="w-full border border-gray-200 rounded-lg shadow-sm">
                        <table className="w-full text-sm text-left text-gray-700 border-collapse">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-2">Title</th>
                                <th className="px-4 py-2">Due Date</th>
                                <th className="px-4 py-2">Priority</th>
                                <th className="px-4 py-2">Categories</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2 text-center">File</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {paginatedTasks.map(task => (
                                <tr
                                    key={task.id}
                                    onClick={() => { setSelectedTask(task); fetchComments(task.id); }}
                                    className="cursor-pointer hover:bg-gray-50 transition"
                                >
                                    <td className="px-4 py-2 font-medium">{task.title}</td>
                                    <td className="px-4 py-2 text-red-500 whitespace-nowrap">{new Date(task.dueDate).toLocaleString()}</td>
                                    <td className="px-4 py-2">{task.priority}</td>
                                    <td className="px-4 py-2">
                                        {task.categories?.map(c => (
                                            <span key={c.id} className="px-2 py-1 bg-gray-100 rounded-full text-xs mr-1 inline-block">{c.name}</span>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${statusColor[task.status] || "bg-gray-100 text-gray-800"}`}>
                        {task.status}
                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {task.fileName || task.filePath ? <span title="File attached" className="text-lg">📎</span> : <span className="text-gray-300">—</span>}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4 space-x-2">
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50">Prev</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded ${currentPage === page ? "bg-[#00A662] text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">Next</button>
                        </div>
                    )}
                </>
            )}

            {/* TASK DETAILS */}
            {selectedTask && (
                <TaskDetails
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    onClose={() => {
                        setSelectedTask(null);
                        setSubmitMessage("");
                        setComments([]);
                        setCurrentPage(1);
                    }}
                    comments={comments}
                    commentsLoading={commentsLoading}
                    commentsError={commentsError}
                    user={user}
                    token={token}
                    message={submitMessage}
                    setMessage={setSubmitMessage}
                    sendDecision={sendDecision}
                    onRefreshTasks={fetchMyTasks}
                />
            )}
        </div>
    );
}