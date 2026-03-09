import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";
import TaskDetails from "./TaskDetails";
import { FaPaperclip } from "react-icons/fa";

export default function AllTask() {
    const { user, token } = useAuth();
    const API_TASKS = "http://localhost:8181/api/v1/task/getall";

    const [tasks, setTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [message, setMessage] = useState("");
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    const dropdownRef = useRef(null);

    const statusColor = {
        TODO: "bg-gray-200 text-gray-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-800",
        SUBMITTED: "bg-blue-200 text-blue-800",
        APPROVED: "bg-green-200 text-green-800",
        REJECTED: "bg-red-200 text-red-800",
    };

    const priorityColor = {
        LOW: "bg-green-100 text-green-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        HIGH: "bg-red-100 text-red-800",
    };

    // ------------------- FETCH TASKS -------------------
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

    useEffect(() => {
        fetchTasks();
    }, [token]);

    // ------------------- FETCH COMMENTS -------------------
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

    // ------------------- DOWNLOAD FILE -------------------
    const downloadFile = async (taskId, filename = "attachment") => {
        try {
            const res = await fetch(`http://localhost:8181/api/v1/task/file/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                alert("Download failed");
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("File download error", err);
            alert("Download failed: " + err.message);
        }
    };

    // ------------------- SEND DECISION -------------------
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

    // ------------------- FILTER -------------------
    const categories = Array.from(
        new Set(tasks.flatMap((t) => t.categories.map((c) => c.name)))
    );

    const filteredTasks = (selectedCategory
            ? tasks.filter((t) =>
                t.categories.some((c) => c.name === selectedCategory)
            )
            : tasks
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    // ------------------- CLOSE DROPDOWN -------------------
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="w-full mx-auto p-6 font-sans">

            <header className="mb-6">
                <h2 className="text-left text-2xl font-semibold text-slate-800">
                    All Tasks
                </h2>
            </header>

            {!selectedTask ? (
                <>
                    {/* CATEGORY DROPDOWN */}
                    <div className="mb-4 flex justify-end relative w-60" ref={dropdownRef}>
                        <button
                            className="w-full border border-slate-200 rounded-md px-4 py-2 bg-white text-slate-700 font-medium flex justify-between items-center hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#00A662] transition"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {selectedCategory || "All Categories"}
                            <svg
                                className="h-4 w-4 text-slate-400 ml-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <ul className="absolute mt-2 w-full bg-white border border-slate-200 rounded-md shadow-md z-50 max-h-60 overflow-y-auto text-sm">
                                <li
                                    onClick={() => {
                                        setSelectedCategory("");
                                        setDropdownOpen(false);
                                        setCurrentPage(1);
                                    }}
                                    className="px-4 py-2 cursor-pointer hover:bg-[#00A662]/10"
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
                                        className="px-4 py-2 cursor-pointer hover:bg-[#00A662]/10"
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* TASK TABLE */}
                    <div className="overflow-x-auto border border-slate-200 rounded-md bg-white">
                        <table className="w-full text-sm text-left text-slate-700 table-auto min-w-max">
                            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
                            <tr>
                                <th className="px-3 py-1">Title</th>
                                <th className="px-3 py-1">Due</th>
                                <th className="px-3 py-1">Assigned</th>
                                <th className="px-3 py-1">Priority</th>
                                <th className="px-3 py-1">Categories</th>
                                <th className="px-3 py-1">Status</th>
                                <th className="px-3 py-1">File</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                            {currentTasks.map((task) => (
                                <tr
                                    key={task.id}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        fetchComments(task.id);
                                    }}
                                    className="cursor-pointer hover:bg-slate-50 transition"
                                >
                                    <td className="px-3 py-1 max-w-xs truncate">{task.title}</td>
                                    <td className="px-3 py-1 text-red-600">{new Date(task.dueDate).toLocaleString()}</td>
                                    <td className="px-3 py-1 truncate">{task.assignedTo?.username}</td>
                                    <td className="px-3 py-1">
                                            <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${priorityColor[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                    </td>
                                    <td className="px-3 py-1">
                                        <div className="flex flex-wrap gap-2">
                                            {(task.categories || []).map((c) => (
                                                <span key={c.id} className="px-2 py-1 bg-gray-100 rounded-full text-xs truncate">
                                                        {c.name}
                                                    </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-3 py-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColor[task.status]}`}>
                                                {task.status}
                                            </span>
                                    </td>
                                    <td className="px-3 py-1">
                                        {task.filePath && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadFile(task.id, task.fileName || "attachment");
                                                }}
                                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                                                title="Download file"
                                            >
                                                <FaPaperclip />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <nav className="flex items-center justify-center mt-4 gap-2 flex-wrap">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                className="px-3 py-1 bg-white border border-slate-200 rounded-md hover:shadow-sm"
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded-md border ${
                                        currentPage === page
                                            ? "bg-[#00A662] text-white border-[#00A662]"
                                            : "bg-white border-slate-200"
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                className="px-3 py-1 bg-white border border-slate-200 rounded-md hover:shadow-sm"
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </nav>
                    )}
                </>
            ) : (
                <TaskDetails
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    onClose={async () => {
                        setSelectedTask(null);
                        setMessage("");
                        setComments([]);
                        setCurrentPage(1);
                        await fetchTasks();
                    }}
                    comments={comments}
                    commentsLoading={commentsLoading}
                    commentsError={commentsError}
                    user={user}
                    token={token}
                    message={message}
                    setMessage={setMessage}
                    sendDecision={sendDecision}
                />
            )}
        </div>
    );
}