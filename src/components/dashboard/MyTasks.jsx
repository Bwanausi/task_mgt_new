import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";

export default function MyTask() {
    const { user, token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedTask, setSelectedTask] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");

    // FETCH MY TASKS
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

    // ACCEPT TASK -> IN_PROGRESS
    const handleAccept = async (taskId) => {
        try {
            await api.put(`/task/accept/${taskId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTasks(prev =>
                prev.map(t =>
                    t.id === taskId ? { ...t, status: "IN_PROGRESS" } : t
                )
            );

            setSelectedTask(null);
        } catch (err) {
            console.error("Accept failed", err);
        }
    };

    // SUBMIT TASK -> SINGLE API: create comment + update status
    const handleSubmit = async (task) => {
        if (!submitMessage.trim()) {
            alert("Please enter a message before submitting.");
            return;
        }

        try {
            const payload = {
                comment: submitMessage,
                commentById: user.userId,
                role: "NORMAL_USER" // ✅ updated to match backend enum
            };

            // Single API call to submit task
            await api.post(`/task/submit/${task.id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update local state
            setTasks(prev =>
                prev.map(t =>
                    t.id === task.id ? { ...t, status: "SUBMITTED" } : t
                )
            );

            setSelectedTask(null);
            setSubmitMessage("");

        } catch (err) {
            console.error("Submit failed", err);
        }
    };

    if (loading) return <p className="text-center mt-4">Loading tasks...</p>;
    if (!tasks.length) return <p className="text-center mt-4">No tasks assigned to you.</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">My Tasks</h2>

            {/* TASK CARDS */}
            {tasks.map(task => (
                <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="cursor-pointer bg-white border-l-4 rounded p-4 mb-4 shadow-md hover:shadow-lg transition"
                    style={{
                        borderColor:
                            task.priority === "HIGH"
                                ? "#ef4444"
                                : task.priority === "MEDIUM"
                                    ? "#f59e0b"
                                    : "#22c55e",
                    }}
                >
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                task.status === "TODO"
                                    ? "bg-gray-200 text-gray-800"
                                    : task.status === "IN_PROGRESS"
                                        ? "bg-blue-200 text-blue-800"
                                        : task.status === "SUBMITTED"
                                            ? "bg-yellow-200 text-yellow-800"
                                            : "bg-green-200 text-green-800"
                            }`}
                        >
                            {task.status}
                        </span>
                    </div>

                    <p className="text-sm text-gray-600">
                        <strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}
                    </p>

                    <p className="text-sm">
                        <strong>Priority:</strong>{" "}
                        <span className={`font-bold ${
                            task.priority === "HIGH"
                                ? "text-red-600"
                                : task.priority === "MEDIUM"
                                    ? "text-yellow-600"
                                    : "text-green-600"
                        }`}>
                            {task.priority}
                        </span>
                    </p>

                    <p className="text-sm text-gray-600">
                        <strong>Categories:</strong>{" "}
                        {task.categories.map(c => c.name).join(", ")}
                    </p>
                </div>
            ))}

            {/* MODAL */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">

                        {/* HEADER */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex justify-between items-center">
                            <h3 className="text-lg font-bold">{selectedTask.title}</h3>
                            <button
                                onClick={() => { setSelectedTask(null); setSubmitMessage(""); }}
                                className="text-white hover:text-red-300 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-4 space-y-3 text-gray-700">
                            <p>
                                <strong>Description:</strong><br />
                                {selectedTask.description}
                            </p>
                        </div>

                        {/* FOOTER */}
                        <div className="bg-gray-50 p-4 flex justify-end gap-2">
                            {selectedTask.status === "TODO" && (
                                <button
                                    onClick={() => handleAccept(selectedTask.id)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                >
                                    Accept
                                </button>
                            )}

                            {selectedTask.status === "IN_PROGRESS" && (
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
