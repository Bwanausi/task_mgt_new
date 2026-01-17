import { useAuth } from "../../auth/AuthContext";

/**
 * MyTasks Page
 * - Normal User → own assigned tasks
 * - Director → own + department tasks (backend controlled)
 * - Admin/CEO → optional visibility
 */
export default function MyTasks() {
    const { user } = useAuth();

    const canView =
        user.permissions.includes("TASK_VIEW_ASSIGNED") ||
        user.permissions.includes("TASK_VIEW_DEPARTMENT") ||
        user.permissions.includes("TASK_VIEW_ALL");

    if (!canView) {
        return <NoAccess />;
    }

    // 🔁 Replace with backend API
    const tasks = [
        {
            id: 1,
            title: "Submit weekly report",
            status: "PENDING",
            dueDate: "2026-01-20"
        },
        {
            id: 2,
            title: "Fix login issue",
            status: "COMPLETED",
            dueDate: "2026-01-15"
        }
    ];

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">My Tasks</h2>

            <table className="w-full border">
                <thead className="bg-gray-50">
                <tr>
                    <TH>Task</TH>
                    <TH>Status</TH>
                    <TH>Due Date</TH>
                    <TH>Actions</TH>
                </tr>
                </thead>

                <tbody>
                {tasks.map(task => (
                    <tr key={task.id} className="border-t">
                        <TD>{task.title}</TD>
                        <TD>
                            <StatusBadge status={task.status} />
                        </TD>
                        <TD>{task.dueDate}</TD>
                        <TD>
                            <Actions task={task} user={user} />
                        </TD>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

/* ================= Helpers ================= */

const Actions = ({ task, user }) => (
    <div className="flex gap-3">
        {user.permissions.includes("TASK_UPDATE_STATUS") && (
            <button className="text-blue-600 font-semibold hover:underline">
                Update Status
            </button>
        )}

        {user.permissions.includes("TASK_COMMENT") && (
            <button className="text-green-600 font-semibold hover:underline">
                Comment
            </button>
        )}
    </div>
);

const TH = ({ children }) => (
    <th className="px-4 py-2 text-left text-sm uppercase text-gray-500">
        {children}
    </th>
);

const TD = ({ children }) => (
    <td className="px-4 py-2">{children}</td>
);

const StatusBadge = ({ status }) => {
    const colors = {
        COMPLETED: "text-green-600",
        PENDING: "text-yellow-600",
        REJECTED: "text-red-600"
    };

    return (
        <span className={`font-semibold ${colors[status]}`}>
      {status}
    </span>
    );
};

const NoAccess = () => (
    <p className="text-red-500 font-semibold">Access Denied</p>
);
