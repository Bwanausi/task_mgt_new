import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";

export default function AllTask() {
    const { user, token } = useAuth();
    const API_TASKS = "http://localhost:8181/api/v1/task/getall";

    const [tasks, setTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTask, setSelectedTask] = useState(null);
    const [message, setMessage] = useState("");

    const statusColor = {
        TODO: "bg-gray-400 text-gray-900",
        IN_PROGRESS: "bg-yellow-200 text-yellow-800",
        SUBMITTED: "bg-blue-200 text-blue-800",
        APPROVED: "bg-green-200 text-green-800",
        REJECTED: "bg-red-200 text-red-800",
    };

    const borderColor = {
        TODO: "border-gray-400",
        IN_PROGRESS: "border-yellow-400",
        SUBMITTED: "border-blue-400",
        APPROVED: "border-green-500",
        REJECTED: "border-red-500",
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

    const filteredTasks = selectedCategory
        ? tasks.filter((t) =>
            t.categories.some((c) => c.name === selectedCategory)
        )
        : tasks;

    // ONE API FOR APPROVE / REJECT
    const sendDecision = async (taskId, statusValue) => {
        try {
            const payload = {
                comment: message,
                commentById: user.userId,
                role: "NORMAL_USER",
                status: statusValue,
            };

            await api.post(`/task/submit/${taskId}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

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

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
            {/* TASK LIST */}
            <div className="col-span-2">
                <h2 className="text-center text-xl font-semibold text-teal-800 mb-6">
                    All Task List
                </h2>

                <div className="space-y-5">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={`cursor-pointer bg-white border-l-4 ${
                                borderColor[task.status] || "border-gray-300"
                            } rounded-lg p-5 shadow-sm hover:shadow-md transition`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {task.title}
                                </h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        statusColor[task.status] || "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    {task.status}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-2">
                                {task.description.length > 50
                                    ? task.description.slice(0, 50) + "..."
                                    : task.description}
                            </p>

                            <p className="text-sm mb-2">
                                <span className="font-semibold">Due:</span>{" "}
                                <span className="text-red-500">
                                    {new Date(task.dueDate).toLocaleString()}
                                </span>
                            </p>

                            <p className="text-sm mb-2">
                                <span className="font-semibold">Assigned To:</span>{" "}
                                {task.assignedTo?.username}
                            </p>

                            <p className="text-sm mb-2">
                                <span className="font-semibold">Created By:</span>{" "}
                                {task.createdBy?.username}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {task.categories.map((cat) => (
                                    <span
                                        key={cat.id}
                                        className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FILTER */}
            <div className="col-span-1">
                <div className="p-4 border border-gray-200 rounded-lg mb-6 bg-white shadow-sm">
                    <label className="block mb-2 font-semibold">Filter by Category</label>
                    <select
                        className="w-full p-2 border rounded"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* MODAL */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold">{selectedTask.title}</h3>
                            <button
                                onClick={() => { setSelectedTask(null); setMessage(""); }}
                                className="text-white hover:text-red-300 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 space-y-3 text-gray-700">
                            <p><strong>Description:</strong><br />{selectedTask.description}</p>
                            <p><strong>Due:</strong> {new Date(selectedTask.dueDate).toLocaleString()}</p>
                            <p><strong>Assigned To:</strong> {selectedTask.assignedTo?.username}</p>
                            <p><strong>Created By:</strong> {selectedTask.createdBy?.username}</p>
                            <p><strong>Categories:</strong> {selectedTask.categories.map(c => c.name).join(", ")}</p>
                        </div>

                        {selectedTask.status === "SUBMITTED" && (
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
