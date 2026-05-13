"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Menu, LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import styles from "./AdminLayout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();
  const { success } = useToast();

  const handleLogout = async () => {
    await logout();
    success("Logged out");
    router.push("/login");
  };

  return (
    <div className={styles.shell}>
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <span className={styles.adminLabel}>Admin</span>
          <div className={styles.topbarRight}>
            <span className={styles.userName}>{user?.username}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={16} />
            </button>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
