import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function MyTasks() {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            title: "DSA",
            description: "Solving 1 DSA question",
            dueDate: "Nov 3, 2023, 5:30 AM",
            priority: "Medium",
            category: "Study",
            completed: false,
        },
        {
            id: 2,
            title: "Walk",
            description: "Go for a jogging",
            dueDate: "Nov 3, 2023, 5:30 AM",
            priority: "High",
            category: "Health",
            completed: true,
        },
        {
            id: 3,
            title: "Grocery Shopping",
            description: "Buy vegetables and fruits",
            dueDate: "Nov 4, 2023, 3:00 PM",
            priority: "Low",
            category: "Personal",
            completed: false,
        },
        {
            id: 4,
            title: "Read a Book",
            description: "Read 50 pages of a novel",
            dueDate: "Nov 5, 2023, 8:00 PM",
            priority: "Medium",
            category: "Leisure",
            completed: false,
        },
    ]);

    const [selectedCategory, setSelectedCategory] = useState("");

    const priorityColor = {
        Low: "bg-green-500",
        Medium: "bg-yellow-500",
        High: "bg-red-500",
    };

    // get unique categories for dropdown
    const categories = [...new Set(tasks.map((t) => t.category))];

    // filter tasks by selected category
    const filteredTasks = selectedCategory
        ? tasks.filter((t) => t.category === selectedCategory)
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
                                <span className="font-semibold">Description:</span> {task.description}
                            </p>

                            <p className="text-sm mb-3">
                                <span className="font-semibold">Due Date:</span>{" "}
                                <span className="text-red-500">{task.dueDate}</span>
                            </p>

                            {/* PRIORITY BADGE (rounded full with color) */}
                            <div className="flex items-center gap-2 mb-4">
                <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-medium ${priorityColor[task.priority]}`}
                >
                  {task.priority}
                </span>
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

            {/* RIGHT-SIDE PANEL */}
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
                            .filter((t) => t.completed)
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
