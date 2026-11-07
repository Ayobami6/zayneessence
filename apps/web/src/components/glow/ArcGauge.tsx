'use client';

import React from 'react';
import { useTheme } from '@mui/material/styles';

interface ArcGaugeProps {
  /** Progress 0–1. Ignored when `segments` is given. */
  progress?: number;
  /** Labels for equal segments around the arc (e.g. ritual step verbs). */
  segments?: string[];
  /** Big centre value, e.g. "₦27,000" or "3 steps". */
  value: string;
  /** Caption under the value. */
  caption?: string;
  /** Labels under the two ends of the arc (progress mode). */
  startLabel?: string;
  endLabel?: string;
  ariaLabel: string;
  /** Render for an inverse (ink) surface. */
  onInverse?: boolean;
  /** Max rendered width in px; the SVG scales down fluidly. */
  maxWidth?: number;
}

const ARC_PATH = 'M30 150a120 120 0 0 1 240 0';
const ARC_LENGTH = Math.PI * 120;

/** GlowSkin-style semicircle gauge: free-delivery progress, consultation steps. */
export function ArcGauge({
  progress = 0,
  segments,
  value,
  caption,
  startLabel,
  endLabel,
  ariaLabel,
  onInverse = false,
  maxWidth = 320,
}: ArcGaugeProps) {
  const theme = useTheme();
  const g = theme.palette.glow;
  const track = onInverse ? 'rgba(255,255,255,0.14)' : g.petal;
  const fill = onInverse ? g.bloom : g.accent;
  const valueColor = onInverse ? g.inverseText : g.text;
  const captionColor = onInverse ? g.inverseMuted : g.textSecondary;

  let dash: string;
  if (segments && segments.length > 0) {
    const gap = 9;
    const n = segments.length;
    const seg = (ARC_LENGTH - gap * (n - 1)) / n;
    dash = Array.from({ length: n }, (_, i) => (i < n - 1 ? `${seg.toFixed(2)} ${gap}` : `${seg.toFixed(2)} 400`)).join(' ');
  } else {
    const clamped = Math.max(0, Math.min(1, progress));
    dash = `${(clamped * ARC_LENGTH).toFixed(2)} ${ARC_LENGTH.toFixed(2)}`;
  }

  const hasEndLabels = Boolean(startLabel || endLabel);

  return (
    <svg
      viewBox={`0 -16 300 ${hasEndLabels ? 196 : 172}`}
      role="img"
      aria-label={ariaLabel}
      style={{ width: '100%', maxWidth, height: 'auto', display: 'block', margin: '0 auto' }}
    >
      <path d={ARC_PATH} fill="none" stroke={track} strokeWidth={16} strokeLinecap="round" />
      <path
        d={ARC_PATH}
        fill="none"
        stroke={fill}
        strokeWidth={16}
        strokeLinecap={segments ? 'butt' : 'round'}
        strokeDasharray={dash}
        style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)' }}
      />
      {segments?.map((label, i) => {
        const n = segments.length;
        const phi = ((180 - (i + 0.5) * (180 / n)) * Math.PI) / 180;
        const x = 150 + 145 * Math.cos(phi);
        const y = 150 - 145 * Math.sin(phi);
        const anchor = x < 120 ? 'start' : x > 180 ? 'end' : 'middle';
        return (
          <text
            key={label + i}
            x={anchor === 'start' ? Math.max(4, x - 8) : anchor === 'end' ? Math.min(296, x + 8) : x}
            y={y - 4}
            textAnchor={anchor}
            fontSize={12}
            fontWeight={700}
            fill={captionColor}
            fontFamily="inherit"
          >
            {label}
          </text>
        );
      })}
      <text x={150} y={118} textAnchor="middle" fontSize={30} fontWeight={800} fill={valueColor} fontFamily="inherit">
        {value}
      </text>
      {caption ? (
        <text x={150} y={142} textAnchor="middle" fontSize={13} fontWeight={600} fill={captionColor} fontFamily="inherit">
          {caption}
        </text>
      ) : null}
      {startLabel ? (
        <text x={22} y={176} textAnchor="start" fontSize={11.5} fontWeight={700} fill={captionColor} fontFamily="inherit">
          {startLabel}
        </text>
      ) : null}
      {endLabel ? (
        <text x={278} y={176} textAnchor="end" fontSize={11.5} fontWeight={700} fill={captionColor} fontFamily="inherit">
          {endLabel}
        </text>
      ) : null}
    </svg>
  );
}
