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
        <div className="space-y-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
                    <p className="text-sm text-gray-500">
                        Overview of system task statistics
                    </p>
                </div>
            </div>

            {/* REPORT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportCard
                    title="Total Tasks"
                    value={report.totalTasks}
                    valueColor="text-blue-600"
                    icon={ClipboardList}
                    bg="from-blue-50 to-blue-100"
                />

                <ReportCard
                    title="Completed"
                    value={report.completedTasks}
                    valueColor="text-green-600"
                    icon={CheckCircle}
                    bg="from-green-50 to-green-100"
                />

                <ReportCard
                    title="Pending"
                    value={report.pendingTasks}
                    valueColor="text-yellow-600"
                    icon={Clock}
                    bg="from-yellow-50 to-yellow-100"
                />

                <ReportCard
                    title="Overdue"
                    value={report.overdueTasks}
                    valueColor="text-red-600"
                    icon={AlertTriangle}
                    bg="from-red-50 to-red-100"
                />
            </div>
        </div>
    );
}

/* ---------------- COMPONENTS ---------------- */

const ReportCard = ({ title, value, valueColor, icon: Icon, bg }) => (
    <div className="relative bg-gradient-to-br bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">

        {/* ICON */}
        <div className={`absolute top-4 right-4 p-3 rounded-xl bg-gradient-to-br ${bg}`}>
            <Icon className="text-slate-700" size={22} />
        </div>

        {/* CONTENT */}
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
);

const Loading = () => (
    <div className="flex justify-center items-center py-20">
    <span className="text-gray-400 animate-pulse">
      Loading reports...
    </span>
    </div>
);

const NoAccess = () => (
    <div className="flex justify-center items-center py-20">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-3 rounded-xl shadow-sm">
            Access Denied – You don’t have permission to view reports
        </div>
    </div>
);
