"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Heart, Search, User, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { useToast } from "@/components/ui/Toast";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const { success } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { 
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false); 
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    success("Logged out successfully");
    router.push("/");
  };

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/products?gender=Men", label: "Men" },
    { href: "/products?gender=Women", label: "Women" },
  ];

  return (
    <>
      <header className={[styles.header, scrolled ? styles.scrolled : ""].join(" ")}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>K</span>
            <span className={styles.logoText}>KritimStore</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav}>
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={[styles.navLink, pathname === l.href ? styles.active : ""].join(" ")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.iconBtn} onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={20} />
            </button>

            <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
              <Heart size={20} />
            </Link>

            <button className={styles.iconBtn} onClick={openCart} aria-label="Cart">
              <ShoppingBag size={20} />
              {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
            </button>

            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <button className={styles.iconBtn} aria-label="Account">
                  <User size={20} />
                </button>
                <div className={styles.dropdown}>
                  <p className={styles.dropdownName}>{user?.username}</p>
                  <Link href="/account" className={styles.dropdownItem}>
                    <User size={14} /> My Account
                  </Link>
                  <Link href="/orders" className={styles.dropdownItem}>
                    <ShoppingBag size={14} /> My Orders
                  </Link>
                  {isAdmin && (
                    <Link href="/dashboard" className={styles.dropdownItem}>
                      <LayoutDashboard size={14} /> Admin Panel
                    </Link>
                  )}
                  <hr className={styles.dropdownDivider} />
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className={styles.loginBtn}>Sign In</Link>
            )}

            <button
              className={styles.menuBtn}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search overlay */}
        {searchOpen && (
          <div className={styles.searchOverlay}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <Search size={20} className={styles.searchIcon} />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className={styles.searchInput}
              />
              <button type="button" onClick={() => setSearchOpen(false)} className={styles.searchClose}>
                <X size={20} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
          <nav className={styles.mobileNav}>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className={styles.mobileNavLink}>{l.label}</Link>
            ))}
            <hr className={styles.mobileDivider} />
            {isAuthenticated ? (
              <>
                <Link href="/account" className={styles.mobileNavLink}>My Account</Link>
                <Link href="/orders" className={styles.mobileNavLink}>My Orders</Link>
                {isAdmin && <Link href="/dashboard" className={styles.mobileNavLink}>Admin Panel</Link>}
                <button className={styles.mobileNavLink} onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className={styles.mobileNavLink}>Sign In</Link>
                <Link href="/register" className={styles.mobileNavLink}>Create Account</Link>
              </>
            )}
          </nav>
        </>
      )}
    </>
  );
}
