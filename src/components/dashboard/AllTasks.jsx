import { useAuth } from "../../auth/AuthContext";

/**
 * AllTasks Page
 * - CEO / ADMIN → view all tasks
 * - DIRECTOR → view department tasks
 */
export default function AllTasks() {
    const { user } = useAuth();

    const canViewAll =
        user.permissions.includes("TASK_VIEW_ALL") ||
        user.permissions.includes("TASK_VIEW_DEPARTMENT");

    if (!canViewAll) {
        return <NoAccess />;
    }

    // 🔁 Replace with backend API
    const tasks = [
        {
            id: 1,
            title: "Prepare budget report",
            status: "PENDING",
            assignedTo: "john",
            department: "Finance",
            dueDate: "2026-01-22"
        },
        {
            id: 2,
            title: "System security review",
            status: "COMPLETED",
            assignedTo: "mary",
            department: "IT",
            dueDate: "2026-01-10"
        }
    ];

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">
                {user.permissions.includes("TASK_VIEW_ALL")
                    ? "All Tasks"
                    : "Department Tasks"}
            </h2>

            <table className="w-full border">
                <thead className="bg-gray-50">
                <tr>
                    <TH>Task</TH>
                    <TH>Status</TH>
                    <TH>Assigned To</TH>
                    <TH>Department</TH>
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
                        <TD>{task.assignedTo}</TD>
                        <TD>{task.department}</TD>
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

const Actions = ({ task, user }) => {
    return (
        <div className="flex gap-2">
            {user.permissions.includes("TASK_UPDATE_STATUS") && (
                <button className="text-blue-600 font-semibold">
                    Update Status
                </button>
            )}

            {user.permissions.includes("TASK_SET_DUEDATE") && (
                <button className="text-green-600 font-semibold">
                    Set Due Date
                </button>
            )}

            {user.permissions.includes("TASK_APPROVE") &&
                task.status === "PENDING" && (
                    <button className="text-purple-600 font-semibold">
                        Approve
                    </button>
                )}
        </div>
    );
};

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
