import { useAuth } from "../../auth/AuthContext";

export default function Users() {
    const { user } = useAuth();

    if (!user.permissions.includes("USER_MANAGE")) {
        return <NoAccess />;
    }

    // Replace with API data later
    const users = [
        { id: 1, username: "john", role: "DIRECTOR", status: "ACTIVE" },
        { id: 2, username: "mary", role: "NORMAL_USER", status: "ACTIVE" },
        { id: 3, username: "paul", role: "ADMIN", status: "INACTIVE" },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-center text-xl font-semibold text-teal-800 mb-6">
                User Management
            </h2>

            <div className="space-y-4">
                {users.map((u) => (
                    <div
                        key={u.id}
                        className="bg-white border border-gray-200 rounded p-4 hover:shadow-md hover:bg-gray-50 transition flex justify-between items-center"
                    >
                        <div className="flex-1">
                            <p className="text-sm font-semibold">{u.username}</p>
                            <p className="text-xs text-gray-500">{u.role}</p>
                        </div>

                        <div className="flex items-center gap-6">
              <span
                  className={`px-2 py-1 text-xs rounded font-medium ${
                      u.status === "ACTIVE" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}
              >
                {u.status}
              </span>
                            <button className="text-teal-700 font-semibold hover:underline text-sm">
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const NoAccess = () => (
    <p className="text-red-500 font-semibold text-center mt-4">Access Denied</p>
);
