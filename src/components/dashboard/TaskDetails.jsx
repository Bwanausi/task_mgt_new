import React from "react";

export default function TaskDetails({
                                        selectedTask,
                                        setSelectedTask,
                                        onClose,
                                        comments = [],
                                        commentsLoading = false,
                                        commentsError = null,
                                        user,
                                        token,
                                        message,
                                        setMessage,
                                        onRefreshTasks,
                                        refreshComments
                                    }) {
    if (!selectedTask) return null;

    const API = "http://localhost:8181/api/v1/task";

    const statusColor = {
        TODO: "bg-gray-200 text-gray-800",
        IN_PROGRESS: "bg-yellow-200 text-yellow-800",
        SUBMITTED: "bg-blue-200 text-blue-800",
        APPROVED: "bg-green-200 text-green-800",
        REJECTED: "bg-red-200 text-red-800"
    };

    const priorityColor = {
        LOW: "bg-green-100 text-green-800",
        MEDIUM: "bg-yellow-100 text-yellow-800",
        HIGH: "bg-red-100 text-red-800"
    };

    // Download file with original extension
    const downloadFile = async () => {
        if (!selectedTask?.id) return;
        try {
            const res = await fetch(`${API}/file/${selectedTask.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Download failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const filename = selectedTask.fileName || "attachment";

            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
            alert("Download failed: " + err.message);
        }
    };

    // Preview file in new tab
    const previewFile = async () => {
        if (!selectedTask?.id) return;
        try {
            const res = await fetch(`${API}/file/${selectedTask.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Preview failed");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error(err);
            alert("Failed to preview file: " + err.message);
        }
    };

    const handleAccept = async () => {
        try {
            const res = await fetch(`${API}/accept/${selectedTask.id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Accept failed");

            setSelectedTask(prev => ({ ...prev, status: "IN_PROGRESS" }));
            await refreshComments?.(selectedTask.id);
            onRefreshTasks?.();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (!message || message.trim() === "") {
            alert("Please write a submission message");
            return;
        }

        try {
            const payload = {
                taskId: selectedTask.id,
                commentById: user.userId,
                commentByName: user.username,
                comment: message,
                role: "USER",
                status: "SUBMITTED"
            };

            const res = await fetch(`${API}/submit/${selectedTask.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Submit failed");

            setSelectedTask(prev => ({ ...prev, status: "SUBMITTED" }));
            setMessage("");
            await refreshComments?.(selectedTask.id);
            onRefreshTasks?.();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDecision = async (status) => {
        if (!message || message.trim() === "") {
            alert("Please write a message");
            return;
        }

        try {
            const payload = {
                taskId: selectedTask.id,
                commentById: user.userId,
                commentByName: user.username,
                comment: message,
                role: "CEO",
                status
            };

            const res = await fetch(`${API}/submit/${selectedTask.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Decision failed");

            setSelectedTask(prev => ({ ...prev, status }));
            setMessage("");
            await refreshComments?.(selectedTask.id);
            onRefreshTasks?.();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full">
            <div className="w-full mx-auto bg-white p-6 rounded shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-3 items-center">
                        <button
                            onClick={onClose}
                            className="text-[#0F6B3A] bg-[#0F6B3A]/5 hover:bg-[#0F6B3A]/10 px-3 py-1 rounded cursor-pointer"
                        >
                            ← Back
                        </button>
                        <h3 className="text-2xl font-semibold">{selectedTask.title}</h3>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${statusColor[selectedTask.status]}`}>
            {selectedTask.status}
          </span>
                </div>

                {/* Task info */}
                <div className="space-y-3 text-sm text-gray-700">
                    <div><b>Description:</b> {selectedTask.description}</div>
                    <div>
                        <b>Due Date:</b>{" "}
                        <span className="text-red-500">{new Date(selectedTask.dueDate).toLocaleString()}</span>
                    </div>
                    <div><b>Assigned To:</b> {selectedTask.assignedTo?.username}</div>
                    <div><b>Created By:</b> {selectedTask.createdBy?.username}</div>
                    <div>
                        <b>Priority:</b>{" "}
                        <span className={`px-2 py-1 rounded text-xs ${priorityColor[selectedTask.priority]}`}>
              {selectedTask.priority}
            </span>
                    </div>
                    <div><b>Categories:</b> {selectedTask.categories?.map(c => c.name).join(", ")}</div>

                    {/* File attachment */}
                    {selectedTask.filePath && (
                        <div className="mt-2 flex gap-4 items-center">
                            <button
                                onClick={downloadFile}
                                className="text-[#00A662] underline cursor-pointer hover:text-green-700"
                                title="Download File"
                            >
                                Download
                            </button>
                            <button
                                onClick={previewFile}
                                className="text-blue-600 underline cursor-pointer hover:text-blue-800"
                                title="Preview File"
                            >
                                Preview
                            </button>
                            <span className="text-gray-600 text-sm">{selectedTask.fileName}</span>
                        </div>
                    )}
                </div>

                {/* Comments */}
                <div className="border-t mt-6 pt-4">
                    <h4 className="font-semibold mb-3">Task Messages</h4>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {commentsLoading && <p>Loading...</p>}
                        {commentsError && <p className="text-red-500">{commentsError}</p>}
                        {comments.map((c, i) => (
                            <div key={c.id || i} className="border rounded p-3 bg-gray-50">
                                <div>{c.comment}</div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {c.commentByName} ({c.role}) • {new Date(c.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User actions */}
                {selectedTask.assignedTo?.userId === user.userId && (
                    <div className="mt-6">
                        {selectedTask.status === "TODO" && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAccept}
                                    className="bg-[#0F6B3A] hover:bg-[#0e5a32] text-white px-4 py-2 rounded cursor-pointer"
                                >
                                    Accept
                                </button>
                            </div>
                        )}

                        {(selectedTask.status === "IN_PROGRESS" || selectedTask.status === "REJECTED") && (
                            <div className="space-y-3">
                <textarea
                    rows="3"
                    placeholder={selectedTask.status === "REJECTED"
                        ? "Task was rejected. Update and resubmit..."
                        : "Describe what you completed..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border rounded p-2"
                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
                                    >
                                        {selectedTask.status === "REJECTED" ? "Resubmit Task" : "Submit Task"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* CEO actions */}
                {user?.roles?.includes("CEO") && selectedTask.status === "SUBMITTED" && (
                    <div className="border-t mt-6 pt-4 space-y-3">
            <textarea
                rows="3"
                placeholder="Write review message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded p-2"
            />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handleDecision("APPROVED")}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded cursor-pointer"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleDecision("REJECTED")}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded cursor-pointer"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}