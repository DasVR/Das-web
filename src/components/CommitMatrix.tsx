"use client";

import { motion, useReducedMotion } from "framer-motion";

type CommitMatrixProps = {
  /** Commits per week, oldest → newest */
  activity: number[];
  rows?: number;
};

const DOT = 4;
const GAP = 2.5;

/**
 * Commit history as a dot matrix — same visual language as the ARRIQ wordmark.
 * Each column is a week; dots light from the bottom up with commit volume.
 */
export function CommitMatrix({ activity, rows = 5 }: CommitMatrixProps) {
  const reduceMotion = useReducedMotion();
  if (activity.length === 0) return null;

  const peak = Math.max(...activity, 1);
  const step = DOT + GAP;
  const width = activity.length * step - GAP;
  const height = rows * step - GAP;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      role="img"
      aria-label={`Commit activity over the last ${activity.length} weeks`}
    >
      {activity.map((count, col) => {
        const filled = Math.round((count / peak) * rows);
        return Array.from({ length: rows }, (_, row) => {
          const fromBottom = rows - 1 - row;
          const on = fromBottom < filled;
          const key = `${col}-${row}`;
          const props = {
            x: col * step,
            y: row * step,
            width: DOT,
            height: DOT,
            rx: 1,
          };

          if (reduceMotion) {
            return (
              <rect
                key={key}
                {...props}
                fill={on ? "#f97316" : "#262626"}
                opacity={on ? 0.85 : 1}
              />
            );
          }

          return (
            <motion.rect
              key={key}
              {...props}
              fill={on ? "#f97316" : "#262626"}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: on ? 0.85 : 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: col * 0.02 + row * 0.01,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          );
        });
      })}
    </svg>
  );
}
