import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function AllTasks() {
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
    ]);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Low",
        category: "",
    });

    const [selectedCategory, setSelectedCategory] = useState("");

    const priorityColor = {
        Low: "bg-green-500",
        Medium: "bg-yellow-500",
        High: "bg-red-500",
    };

    const categories = [...new Set(tasks.map((t) => t.category).filter(Boolean))];

    const filteredTasks = selectedCategory
        ? tasks.filter((t) => t.category === selectedCategory)
        : tasks;

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.title || !newTask.category) return;

        const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
        setTasks([...tasks, { ...newTask, id, completed: false }]);
        setNewTask({
            title: "",
            description: "",
            dueDate: "",
            priority: "Low",
            category: "",
        });
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter((t) => t.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
            {/* MAIN TASK LIST */}
            <div className="col-span-2">
                <h2 className="text-center text-xl font-semibold text-teal-800 mb-6">
                    All Tasks
                </h2>

                {/* ADD TASK FORM */}
                <form
                    className="bg-white p-6 border border-gray-200 rounded-lg mb-6 shadow-sm space-y-3"
                    onSubmit={handleAddTask}
                >
                    <h3 className="font-semibold mb-2 text-teal-800">Add New Task</h3>

                    {/* TWO-COLUMN GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            value={newTask.title}
                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            value={newTask.category}
                            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                        <input
                            type="date"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        />
                        <select
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <div className="flex items-center justify-start md:justify-end">
                            <button
                                type="submit"
                                className="bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition w-full md:w-auto"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </form>

                {/* TASK CARDS */}
                <div className="space-y-6">
                    {filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:bg-gray-50 transition"
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

                            {/* PRIORITY BADGE */}
                            <div className="flex items-center gap-2 mb-4">
                <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${priorityColor[task.priority]}`}
                >
                  {task.priority}
                </span>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex gap-4 text-gray-500 items-center">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleComplete(task.id)}
                                    className="mr-2"
                                />
                                <button className="hover:text-teal-700">
                                    <FaEdit />
                                </button>
                                <button
                                    className="hover:text-red-600"
                                    onClick={() => deleteTask(task.id)}
                                >
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
                <div className="p-4 border border-gray-200 rounded-lg mb-6 shadow-sm">
                    <label className="block mb-2 font-semibold">Filter by Category</label>
                    <select
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
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
