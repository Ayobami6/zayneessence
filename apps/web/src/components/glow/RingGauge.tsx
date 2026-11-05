'use client';

import React from 'react';
import { useTheme } from '@mui/material/styles';

interface RingGaugeProps {
  /** Progress from 0 to 1. */
  value: number;
  size?: number;
  stroke?: number;
  /** Large centre text, e.g. "82%" or "3/4". */
  label?: string;
  /** Small text under the label. */
  caption?: string;
  /** Accessible description of what the ring measures. */
  ariaLabel: string;
  /** Fill the inside of the ring with the surface colour. */
  filled?: boolean;
}

/** Circular progress ring. Only use it for real progress (delivery threshold, order stage, oud age). */
export function RingGauge({ value, size = 56, stroke = 5, label, caption, ariaLabel, filled = false }: RingGaugeProps) {
  const theme = useTheme();
  const g = theme.palette.glow;
  const clamped = Math.max(0, Math.min(1, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const labelSize = caption ? size * 0.22 : size * 0.22;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={ariaLabel} style={{ flexShrink: 0 }}>
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill={filled ? g.surface : 'none'}
        stroke={g.petal}
        strokeWidth={stroke}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={g.accent}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${(clamped * circumference).toFixed(2)} ${circumference.toFixed(2)}`}
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)' }}
      />
      {label ? (
        <text
          x={center}
          y={caption ? center + labelSize * 0.15 : center + labelSize * 0.36}
          textAnchor="middle"
          fontSize={labelSize}
          fontWeight={800}
          fill={g.text}
          fontFamily="inherit"
        >
          {label}
        </text>
      ) : null}
      {caption ? (
        <text
          x={center}
          y={center + labelSize * 0.15 + size * 0.15}
          textAnchor="middle"
          fontSize={Math.max(10, size * 0.1)}
          fontWeight={600}
          fill={g.textSecondary}
          fontFamily="inherit"
        >
          {caption}
        </text>
      ) : null}
    </svg>
  );
}
