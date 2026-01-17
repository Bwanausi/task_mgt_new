// src/config/sidebarConfig.js
import { PERMISSIONS } from "../constants/permissions";

export const SIDEBAR_ITEMS = [
    {
        label: "Dashboard",
        key: "dashboard",
        permissions: []
    },
    {
        label: "My Tasks",
        key: "myTasks",
        permissions: [
            PERMISSIONS.TASK_VIEW_ASSIGNED,
            PERMISSIONS.TASK_VIEW_DEPARTMENT,
            PERMISSIONS.TASK_VIEW_ALL
        ]
    },
    {
        label: "All Tasks",
        key: "allTasks",
        permissions: [PERMISSIONS.TASK_VIEW_ALL]
    },
    {
        label: "Users",
        key: "users",
        permissions: [PERMISSIONS.USER_MANAGE]
    },
    {
        label: "Reports",
        key: "reports",
        permissions: [PERMISSIONS.REPORT_VIEW]
    },
    {
        label: "System Settings",
        key: "settings",
        permissions: [PERMISSIONS.SYSTEM_CONFIG]
    },
    {
        label: "Create Task",
        key: "createTask",
        permissions: [PERMISSIONS.TASK_CREATE]
    }
];
