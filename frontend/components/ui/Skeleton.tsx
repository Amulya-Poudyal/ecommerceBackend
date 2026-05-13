import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = "100%", height = "16px", borderRadius, className = "" }: SkeletonProps) {
  return (
    <span
      className={[styles.skeleton, className].filter(Boolean).join(" ")}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton height="240px" borderRadius="var(--radius-lg) var(--radius-lg) 0 0" />
      <div className={styles.body}>
        <Skeleton height="14px" width="60%" />
        <Skeleton height="20px" />
        <Skeleton height="14px" width="40%" />
        <Skeleton height="36px" />
      </div>
    </div>
  );
}
