import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>K</span>
            <span className={styles.logoText}>{SITE_NAME}</span>
          </div>
          <p className={styles.tagline}>
            Premium fashion, delivered with care.
          </p>
        </div>
        <div className={styles.links}>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Shop</h4>
            <Link href="/products" className={styles.link}>All Products</Link>
            <Link href="/products?gender=Men" className={styles.link}>Men</Link>
            <Link href="/products?gender=Women" className={styles.link}>Women</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Account</h4>
            <Link href="/login" className={styles.link}>Sign In</Link>
            <Link href="/register" className={styles.link}>Register</Link>
            <Link href="/orders" className={styles.link}>My Orders</Link>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Support</h4>
            <span className={styles.link}>contact@kritimstore.com</span>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
