import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { AccentHeading } from './AccentHeading';

interface SectionHeaderProps {
  id?: string;
  title: string;
  accent?: string;
  actionLabel?: string;
  actionHref?: string;
  /** 'compact' for mobile rows (19px), 'display' for desktop section titles. */
  size?: 'compact' | 'display';
}

export function SectionHeader({ id, title, accent, actionLabel, actionHref, size = 'compact' }: SectionHeaderProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
      <AccentHeading
        id={id}
        component="h2"
        variant={size === 'display' ? 'h2' : 'h3'}
        text={title}
        accent={accent}
      />
      {actionLabel && actionHref ? (
        <Box
          component={Link}
          href={actionHref}
          sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.secondary', textDecorationColor: 'currentColor', '&:hover': { color: 'glow.accent' } }}
        >
          {actionLabel}
        </Box>
      ) : null}
    </Box>
  );
}
