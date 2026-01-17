import { useAuth } from "../../auth/AuthContext";

export default function Users() {
    const { user } = useAuth();

    if (!user.permissions.includes("USER_MANAGE")) {
        return <NoAccess />;
    }

    // Replace with API data later
    const users = [
        { id: 1, username: "john", role: "DIRECTOR", status: "ACTIVE" },
        { id: 2, username: "mary", role: "NORMAL_USER", status: "ACTIVE" }
    ];

    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">User Management</h2>

            <table className="w-full border">
                <thead className="bg-gray-50">
                <tr>
                    <TH>Username</TH>
                    <TH>Role</TH>
                    <TH>Status</TH>
                    <TH>Action</TH>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u.id} className="border-t">
                        <TD>{u.username}</TD>
                        <TD>{u.role}</TD>
                        <TD>{u.status}</TD>
                        <TD>
                            <button className="text-brand font-semibold hover:underline">
                                Edit
                            </button>
                        </TD>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const TH = ({ children }) => (
    <th className="px-4 py-2 text-left text-sm uppercase text-gray-500">
        {children}
    </th>
);

const TD = ({ children }) => (
    <td className="px-4 py-2">{children}</td>
);

const NoAccess = () => (
    <p className="text-red-500 font-semibold">Access Denied</p>
);
