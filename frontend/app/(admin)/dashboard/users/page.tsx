"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { User } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import styles from "./AdminUsers.module.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const { success, error } = useToast();

  useEffect(() => {
    adminApi.getAllUsers().then(setUsers).catch(() => []).finally(() => setLoading(false));
  }, []);

  const toggleAdmin = async (user: User) => {
    setToggling(user.id);
    try {
      const res = await adminApi.updateUserRole(user.id, !user.is_admin);
      setUsers((prev) => prev.map((u) => u.id === user.id ? res.user : u));
      success(`${user.username} is now ${res.user.is_admin ? "admin" : "customer"}`);
    } catch {
      error("Failed to update role");
    } finally {
      setToggling(null);
    }
  };

  return (
    <div>
      <h1 className="page-title">Users</h1>
      <div className="table-wrapper" style={{ marginTop: "var(--space-4)" }}>
        <table>
          <thead>
            <tr><th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th></tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan={6}><Skeleton height="36px" /></td></tr>)
              : users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td className={styles.username}>{u.username}</td>
                  <td className={styles.email}>{u.email}</td>
                  <td><Badge variant={u.is_admin ? "warning" : "default"}>{u.is_admin ? "Admin" : "Customer"}</Badge></td>
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                  <td>
                    <button
                      className={[styles.toggleBtn, u.is_admin ? styles.demote : styles.promote].join(" ")}
                      onClick={() => toggleAdmin(u)}
                      disabled={toggling === u.id}
                    >
                      {toggling === u.id ? "…" : u.is_admin ? "Remove Admin" : "Make Admin"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
