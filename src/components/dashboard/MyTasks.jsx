import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext"; // must be named import
import api from "../../api/axios"; // your axios instance

export default function MyTask() {
    const { user, token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return; // not logged in

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

    if (loading) return <p>Loading tasks...</p>;
    if (!tasks.length) return <p>No tasks assigned to you.</p>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
            {tasks.map((task) => (
                <div
                    key={task.id} // unique key from backend
                    className="bg-white border rounded p-4 mb-3 shadow-sm"
                >
                    <p>
                        <strong>Title:</strong> {task.title}
                    </p>
                    <p>
                        <strong>Description:</strong> {task.description}
                    </p>
                    <p>
                        <strong>Due:</strong> {new Date(task.dueDate).toLocaleString()}
                    </p>
                    <p>
                        <strong>Priority:</strong> {task.priority}
                    </p>
                    <p>
                        <strong>Categories:</strong>{" "}
                        {task.categories.map((c) => c.name).join(", ")}
                    </p>
                </div>
            ))}
        </div>
    );
}
