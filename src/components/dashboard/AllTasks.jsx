import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";
import TaskDetails from "./TaskDetails";
import { FaPaperclip } from "react-icons/fa";

export default function AllTask() {
    const { user } = useAuth();

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

    // ---------------- FETCH TASKS ----------------
    const fetchTasks = async () => {
        try {
            const res = await api.get("/task/getall");
            setTasks(res.data);
        } catch (err) {
            console.error("Fetch tasks error:", err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ---------------- FETCH COMMENTS ----------------
    const fetchComments = async (taskId) => {
        setCommentsLoading(true);
        setCommentsError(null);

        try {
            const res = await api.get(`/task/${taskId}/comments`);
            setComments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Failed to load comments", err);
            setComments([]);
            setCommentsError(err.message || "Failed to load comments");
        } finally {
            setCommentsLoading(false);
        }
    };

    // ---------------- DOWNLOAD FILE ----------------
    const downloadFile = async (taskId, filename = "attachment") => {
        try {
            const res = await api.get(`/task/file/${taskId}`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;

            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("File download error", err);
            alert("Download failed");
        }
    };

    // ---------------- SEND DECISION ----------------
    const sendDecision = async (taskId, statusValue) => {
        try {

            const payload = {
                comment: message,
                commentById: user.userId,
                status: statusValue,
            };

            await api.post(`/task/submit/${taskId}`, payload);

            setTasks((prev) =>
                prev.map((t) =>
                    t.id === taskId ? { ...t, status: statusValue } : t
                )
            );

            setSelectedTask(null);
            setMessage("");

        } catch (err) {
            console.error("Action failed", err);
        }
    };

    // ---------------- FILTER ----------------
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

    // ---------------- CLOSE DROPDOWN ----------------
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
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
                    {/* CATEGORY FILTER */}
                    <div className="mb-4 flex justify-end relative w-60" ref={dropdownRef}>
                        <button
                            className="w-full border border-slate-200 rounded-md px-4 py-2 bg-white text-slate-700 font-medium flex justify-between items-center"
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {selectedCategory || "All Categories"}
                        </button>

                        {dropdownOpen && (
                            <ul className="absolute mt-2 w-full bg-white border rounded-md shadow-md z-50">

                                <li
                                    onClick={() => {
                                        setSelectedCategory("");
                                        setDropdownOpen(false);
                                        setCurrentPage(1);
                                    }}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
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
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        {cat}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* TASK TABLE */}
                    <div className="overflow-x-auto border rounded-md bg-white">
                        <table className="w-full text-sm text-left">

                            <thead className="bg-gray-50 text-xs uppercase">
                            <tr>
                                <th className="px-3 py-2">Title</th>
                                <th className="px-3 py-2">Due</th>
                                <th className="px-3 py-2">Assigned</th>
                                <th className="px-3 py-2">Priority</th>
                                <th className="px-3 py-2">Categories</th>
                                <th className="px-3 py-2">Status</th>
                                <th className="px-3 py-2">File</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y">

                            {currentTasks.map((task) => (

                                <tr
                                    key={task.id}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        fetchComments(task.id);
                                    }}
                                    className="cursor-pointer hover:bg-gray-50"
                                >

                                    <td className="px-3 py-2">{task.title}</td>

                                    <td className="px-3 py-2 text-red-600">
                                        {new Date(task.dueDate).toLocaleString()}
                                    </td>

                                    <td className="px-3 py-2">
                                        {task.assignedTo?.username}
                                    </td>

                                    <td className="px-3 py-2">
                                            <span className={`px-2 py-1 rounded text-xs ${priorityColor[task.priority]}`}>
                                                {task.priority}
                                            </span>
                                    </td>

                                    <td className="px-3 py-2 flex flex-wrap gap-1">
                                        {(task.categories || []).map((c) => (
                                            <span
                                                key={c.id}
                                                className="px-2 py-1 bg-gray-100 rounded text-xs"
                                            >
                                                    {c.name}
                                                </span>
                                        ))}
                                    </td>

                                    <td className="px-3 py-2">
                                            <span className={`px-2 py-1 rounded text-xs ${statusColor[task.status]}`}>
                                                {task.status}
                                            </span>
                                    </td>

                                    <td className="px-3 py-2">
                                        {task.filePath && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    downloadFile(task.id, task.fileName || "attachment");
                                                }}
                                                className="text-gray-500 hover:text-gray-700"
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
                        <div className="flex justify-center mt-4 gap-2">

                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={currentPage === 1}
                                className="px-3 py-1 border rounded"
                            >
                                Prev
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded ${
                                        currentPage === page ? "bg-green-600 text-white" : ""
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border rounded"
                            >
                                Next
                            </button>

                        </div>
                    )}
                </>
            ) : (
                <TaskDetails
                    selectedTask={selectedTask}
                    setSelectedTask={setSelectedTask}
                    comments={comments}
                    commentsLoading={commentsLoading}
                    commentsError={commentsError}
                    message={message}
                    setMessage={setMessage}
                    sendDecision={sendDecision}
                />
            )}

        </div>
    );
}