import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "../components/layout/AppNavbar";
import Footer from "../components/layout/Footer";
import { Trash2, Mail, ChevronDown, ChevronUp, Pencil, X } from "lucide-react";
import { apiFetch } from "../utils/api";

export default function ContactAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [editingMsg, setEditingMsg] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [editLoading, setEditLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/contact");
      if (!res.ok) throw new Error("Failed to load messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const res = await apiFetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (expandedId === id) setExpandedId(null);
      if (editingMsg?._id === id) setEditingMsg(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const openEdit = (msg) => {
    setEditingMsg(msg);
    setEditForm({
      name: msg.name || "",
      email: msg.email || "",
      subject: msg.subject || "",
      message: msg.message || "",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingMsg) return;
    setEditLoading(true);
    try {
      const res = await apiFetch(`/api/contact/${editingMsg._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      if (data.updated) {
        setMessages((prev) =>
          prev.map((m) => (m._id === editingMsg._id ? { ...m, ...data.updated } : m))
        );
      }
      setEditingMsg(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Messages</h1>
              <p className="text-gray-500 text-sm">View and manage messages from the contact form</p>
            </div>
            <button
              onClick={fetchMessages}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-60"
            >
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-gray-500 shadow-sm border border-gray-100">
              <Mail className="size-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium">No messages yet</p>
              <p className="text-sm mt-1">Messages from the contact form will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(expandedId === msg._id ? null : msg._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{msg.subject}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {msg.name} • {msg.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(msg);
                        }}
                        className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg._id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                      {expandedId === msg._id ? (
                        <ChevronUp className="size-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="size-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  {expandedId === msg._id && (
                    <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                      <div className="pt-4 space-y-2 text-sm">
                        <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <Link
            to="/designer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            ← Back to Designer
          </Link>
        </div>
      </main>

      {editingMsg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Message</h3>
              <button
                onClick={() => setEditingMsg(null)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm((f) => ({ ...f, subject: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={editForm.message}
                  onChange={(e) => setEditForm((f) => ({ ...f, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm resize-none"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingMsg(null)}
                  className="flex-1 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-60"
                >
                  {editLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
