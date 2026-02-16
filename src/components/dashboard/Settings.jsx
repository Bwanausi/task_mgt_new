import { useAuth } from "../../auth/AuthContext";
import { FaLock, FaSave } from "react-icons/fa";

export default function Settings() {
    const { user } = useAuth();

    const allowed =
        user?.permissions?.includes("SYSTEM_CONFIG") ||
        user?.permissions?.includes("ROLE_MANAGE");

    if (!allowed) {
        return <NoAccess />;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-xl">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
                System Settings
            </h2>

            <div className="space-y-4">
                <SettingItem label="Enable Task Approval" />
                <SettingItem label="Allow Due Date Override" />
                <SettingItem label="Enable Audit Logs" />
            </div>

            <div className="pt-5 border-t border-gray-200 mt-6 flex justify-end">
                <button className="flex items-center gap-2 bg-[#00A662] hover:bg-[#008f55] text-white px-5 py-2.5 rounded-lg transition shadow-sm">
                    <FaSave />
                    Save Settings
                </button>
            </div>
        </div>
    );
}

const SettingItem = ({ label }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
        <span className="text-sm text-slate-700">{label}</span>

        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer
                peer-checked:bg-[#00A662] transition"></div>
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition
                peer-checked:translate-x-5"></div>
        </label>
    </div>
);

const NoAccess = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md text-center">
        <FaLock className="mx-auto text-4xl text-red-500 mb-3" />
        <h2 className="text-lg font-semibold text-slate-800">
            Access Denied
        </h2>
        <p className="text-sm text-gray-500 mt-2">
            You do not have permission to view this page.
        </p>
    </div>
);
