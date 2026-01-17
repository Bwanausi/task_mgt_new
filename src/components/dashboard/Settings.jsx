import { useAuth } from "../../auth/AuthContext";

export default function Settings() {
    const { user } = useAuth();

    const allowed =
        user.permissions.includes("SYSTEM_CONFIG") ||
        user.permissions.includes("ROLE_MANAGE");

    if (!allowed) {
        return <NoAccess />;
    }

    return (
        <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-xl font-bold">System Settings</h2>

            <div className="space-y-3">
                <SettingItem label="Enable Task Approval" />
                <SettingItem label="Allow Due Date Override" />
                <SettingItem label="Enable Audit Logs" />
            </div>

            <button className="bg-brand text-white px-4 py-2 rounded">
                Save Settings
            </button>
        </div>
    );
}

const SettingItem = ({ label }) => (
    <label className="flex items-center gap-3">
        <input type="checkbox" className="w-4 h-4" />
        <span>{label}</span>
    </label>
);

const NoAccess = () => (
    <p className="text-red-500 font-semibold">Access Denied</p>
);
