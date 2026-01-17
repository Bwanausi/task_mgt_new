import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
    ClipboardList,
    CheckCircle,
    Clock,
    AlertTriangle
} from "lucide-react";

/**
 * REPORTS PAGE
 * Permission required: REPORT_VIEW
 */
export default function Reports() {
    const { user } = useAuth();
    const [report, setReport] = useState(null);

    // 🔐 Permission check
    if (!user?.permissions?.includes("REPORT_VIEW")) {
        return <NoAccess />;
    }

    useEffect(() => {
        // 🔁 Replace with real API call
        setTimeout(() => {
            setReport({
                totalTasks: 120,
                completedTasks: 86,
                pendingTasks: 33,
                overdueTasks: 11
            });
        }, 500);
    }, []);

    if (!report) {
        return <Loading />;
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Reports</h1>
                <span className="text-sm text-gray-500">
          Overview of system task statistics
        </span>
            </div>

            {/* Report Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <ReportCard
                    title="Total Tasks"
                    value={report.totalTasks}
                    valueColor="text-blue-600"
                    icon={ClipboardList}
                />

                <ReportCard
                    title="Completed"
                    value={report.completedTasks}
                    valueColor="text-green-600"
                    icon={CheckCircle}
                />

                <ReportCard
                    title="Pending"
                    value={report.pendingTasks}
                    valueColor="text-yellow-600"
                    icon={Clock}
                />

                <ReportCard
                    title="Overdue"
                    value={report.overdueTasks}
                    valueColor="text-red-600"
                    icon={AlertTriangle}
                />
            </div>
        </div>
    );
}

/* ---------------- COMPONENTS ---------------- */

const ReportCard = ({ title, value, valueColor, icon: Icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gray-100">
            <Icon className="text-gray-700" size={24} />
        </div>

        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        </div>
    </div>
);

const Loading = () => (
    <p className="text-gray-500">Loading reports...</p>
);

const NoAccess = () => (
    <p className="text-red-500 font-semibold">
        Access Denied – You don’t have permission to view reports
    </p>
);
