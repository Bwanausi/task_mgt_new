import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../../auth/AuthContext";

export default function AllTask() {
    const { token } = useAuth();
    const API_TASKS = "http://localhost:8181/api/v1/task/getall";

    const [tasks, setTasks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const priorityColor = {
        TODO: "bg-gray-500",
        IN_PROGRESS: "bg-yellow-500",
        DONE: "bg-green-500",
    };

    /* ================= LOAD TASKS ================= */
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await fetch(API_TASKS, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to load tasks");
                const data = await res.json();
                setTasks(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTasks();
    }, [token]);

    /* ================= CATEGORIES FOR FILTER ================= */
    const categories = Array.from(
        new Set(tasks.flatMap((t) => t.categories.map((c) => c.name)))
    );

    /* ================= FILTERED TASKS ================= */
    const filteredTasks = selectedCategory
        ? tasks.filter((t) =>
            t.categories.some((c) => c.name === selectedCategory)
        )
        : tasks;

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
            {/* MAIN TASK LIST */}
            <div className="col-span-2">
                <h2 className="text-center text-xl font-semibold text-teal-800 mb-6">
                    All Task List
                </h2>

                <div className="space-y-6">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white border border-gray-200 rounded p-5 hover:shadow-md hover:bg-gray-50 transition"
                        >
                            <p className="text-sm mb-1">
                                <span className="font-semibold">Title:</span> {task.title}
                            </p>

                            <p className="text-sm mb-1">
                                <span className="font-semibold">Description:</span>{" "}
                                {task.description}
                            </p>

                            <p className="text-sm mb-2">
                                <span className="font-semibold">Due Date:</span>{" "}
                                <span className="text-red-500">
                  {new Date(task.dueDate).toLocaleString()}
                </span>
                            </p>

                            {/* PRIORITY BADGE */}
                            <div className="flex items-center gap-2 mb-2">
                <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                        priorityColor[task.priority] || "bg-gray-500"
                    }`}
                >
                  {task.priority}
                </span>
                            </div>

                            {/* CATEGORIES */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {task.categories.map((cat) => (
                                    <span
                                        key={cat.id} // ✅ unique key
                                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                                    >
                    {cat.name}
                  </span>
                                ))}
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-4 text-gray-500">
                                <button className="hover:text-teal-700">
                                    <FaEdit />
                                </button>
                                <button className="hover:text-red-600">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-span-1">
                {/* CATEGORY FILTER */}
                <div className="p-4 border border-gray-200 rounded mb-6">
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

                {/* COMPLETED TASKS */}
                <div className="p-4 border border-gray-200 rounded">
                    <h3 className="font-semibold mb-2">Completed Tasks</h3>
                    <ul className="space-y-1">
                        {tasks
                            .filter((t) => t.status === "DONE")
                            .map((task) => (
                                <li key={task.id} className="flex items-center">
                                    <input type="checkbox" checked readOnly className="mr-2" />
                                    <span className="line-through text-gray-500">{task.title}</span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
