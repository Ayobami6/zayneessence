'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface StatDiscProps {
  value: string;
  label: string;
  size?: number;
}

/** White circular stat ("100% · Pure oud") used on product heroes and studio benchmarks. */
export function StatDisc({ value, label, size = 88 }: StatDiscProps) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '999px',
        bgcolor: 'background.paper',
        boxShadow: (t) => t.palette.glow.shadow,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        px: 1,
      }}
    >
      <Typography sx={{ fontSize: size > 90 ? 18 : 16, fontWeight: 800, lineHeight: 1.1 }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
        {label}
      </Typography>
    </Box>
  );
}
