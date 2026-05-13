import { Star } from "lucide-react";
import styles from "./StarRating.module.css";

interface Props {
  rating: number;
  max?: number;
  size?: number;
  showValue?: boolean;
}

export function StarRating({ rating, max = 5, size = 16, showValue = false }: Props) {
  return (
    <div className={styles.stars} aria-label={`${rating} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? styles.filled : styles.empty}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
        />
      ))}
      {showValue && <span className={styles.value}>{rating.toFixed(1)}</span>}
    </div>
  );
}
