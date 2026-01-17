import { useState, useEffect } from "react";
import { useAuth } from "../../auth/AuthContext";

// Dummy users for now, replace with backend API
const dummyUsers = [
    { id: 1, username: "John Doe" },
    { id: 2, username: "Jane Smith" },
    { id: 3, username: "Fred Bwanausi" }
];

export default function CreateTask() {
    const { user } = useAuth();

    // Only CEO with TASK_CREATE can access
    if (!user.permissions.includes("TASK_CREATE")) {
        return <NoAccess />;
    }

    const [title, setTitle] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("PENDING");

    const handleSubmit = e => {
        e.preventDefault();

        const newTask = {
            title,
            assignedTo,
            dueDate,
            status
        };

        // 🔹 Replace with API call
        console.log("Creating Task:", newTask);

        alert(`Task "${title}" assigned to ${assignedTo}!`);

        // Reset form
        setTitle("");
        setAssignedTo("");
        setDueDate("");
        setStatus("PENDING");
    };

    return (
        <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">Create & Assign Task</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">Task Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Assign To</label>
                    <select
                        value={assignedTo}
                        onChange={e => setAssignedTo(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    >
                        <option value="">Select user</option>
                        {dummyUsers.map(u => (
                            <option key={u.id} value={u.username}>
                                {u.username}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Due Date</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Status</label>
                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="w-full border px-3 py-2 rounded"
                    >
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-brand text-white px-4 py-2 rounded hover:bg-brand-80 transition"
                >
                    Create Task
                </button>
            </form>
        </div>
    );
}

const NoAccess = () => (
    <p className="text-red-500 font-semibold text-center">Access Denied</p>
);
