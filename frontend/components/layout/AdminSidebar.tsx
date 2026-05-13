"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, X, ChevronRight } from "lucide-react";
import styles from "./AdminSidebar.module.css";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/users", label: "Users", icon: Users },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onClose(); }, [pathname]);

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <aside className={[styles.sidebar, isOpen ? styles.open : ""].join(" ")}>
        <div className={styles.header}>
          <span className={styles.title}>Admin Panel</span>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>
        <nav className={styles.nav}>
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={[styles.link, pathname === href ? styles.active : ""].join(" ")}
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className={styles.arrow} />
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
