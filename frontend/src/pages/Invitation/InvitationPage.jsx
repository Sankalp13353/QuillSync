import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiMail, FiUsers } from "react-icons/fi";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";

export default function InvitationPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/invitations/${token}`)
      .then((res) => setInvitation(res.data))
      .catch((err) => setError(err.response?.data?.error || "Invitation not found."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAction = async (action) => {
    setActionLoading(true);
    setError("");
    try {
      const res = await api.post(`/invitations/${token}/${action}`);
      if (action === "accept") {
        navigate(`/workspace/${res.data.workspaceId}`);
      } else {
        setInvitation((current) => ({ ...current, status: "DECLINED" }));
      }
    } catch (err) {
      setError(err.response?.data?.error || `Failed to ${action} invitation.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || authLoading) return <div style={styles.page}><p>Loading invitation...</p></div>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}><FiUsers size={28} /></div>
        <h1>Workspace invitation</h1>
        {error && <p style={styles.error}>{error}</p>}
        {invitation && (
          <>
            <p><strong>{invitation.inviterEmail}</strong> invited you to join <strong>{invitation.workspaceName}</strong>.</p>
            <p>You will join as a <strong>{invitation.role.toLowerCase()}</strong>.</p>
            <p style={styles.muted}>Invitation for {invitation.email}</p>
            {invitation.status !== "PENDING" ? (
              <p style={styles.muted}>This invitation is {invitation.status.toLowerCase()}.</p>
            ) : user ? (
              <div style={styles.actions}>
                <button onClick={() => handleAction("decline")} disabled={actionLoading} style={styles.decline}>Decline</button>
                <button onClick={() => handleAction("accept")} disabled={actionLoading} style={styles.accept}>Accept invitation</button>
              </div>
            ) : (
              <Link to={`/login?redirect=/invite/${token}`} style={styles.accept}>Log in to accept</Link>
            )}
          </>
        )}
        {!user && !authLoading && <p style={styles.loginNote}><FiMail /> Use the invited email address when logging in.</p>}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", color: "#e2e8f0", padding: 24 },
  card: { width: "100%", maxWidth: 460, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 32, textAlign: "center" },
  icon: { color: "#60a5fa", marginBottom: 12 },
  muted: { color: "#94a3b8", fontSize: 14 },
  error: { color: "#f87171" },
  actions: { display: "flex", justifyContent: "center", gap: 12, marginTop: 24 },
  accept: { display: "inline-block", padding: "11px 18px", borderRadius: 6, border: 0, background: "#2563eb", color: "white", textDecoration: "none", cursor: "pointer" },
  decline: { padding: "11px 18px", borderRadius: 6, border: "1px solid #ef4444", background: "transparent", color: "#f87171", cursor: "pointer" },
  loginNote: { display: "flex", justifyContent: "center", alignItems: "center", gap: 6, color: "#94a3b8", fontSize: 13, marginTop: 24 }
};
