'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';

interface ArchedWindowProps {
  children: React.ReactNode;
  enableLightSweep?: boolean;
  animateRiseOnLoad?: boolean;
  sx?: SxProps<Theme>;
}

/**
 * The signature zayneessence element: an arched window (border-radius: 999px 999px 6px 6px)
 * with a slightly deeper inner arch behind the product, and optional 7s soft light highlight sweep.
 */
export function ArchedWindow({
  children,
  enableLightSweep = false,
  animateRiseOnLoad = false,
  sx,
}: ArchedWindowProps) {
  return (
    <Box
      sx={[
        (theme) => ({
          position: 'relative',
          aspectRatio: '4 / 5',
          width: '100%',
          borderRadius: theme.palette.zayne.archRadius,
          bgcolor: theme.palette.zayne.productTile,
          border: `1px solid ${theme.palette.divider}`,
          p: { xs: 2, sm: 2.75 },
          overflow: 'hidden',
          transition: theme.palette.zayne.modeTransition,
          animation: animateRiseOnLoad
            ? 'heroArchRise 1.35s cubic-bezier(0.2, 0.7, 0.2, 1) both'
            : 'none',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {/* Deeper inner arch behind the product */}
      <Box
        sx={(theme) => ({
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: theme.palette.zayne.innerArchRadius,
          bgcolor: theme.palette.zayne.tileInnerArch,
          overflow: 'hidden',
          transition: theme.palette.zayne.modeTransition,
        })}
      >
        {children}

        {enableLightSweep && (
          <Box
            aria-hidden="true"
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'linear-gradient(105deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0) 80%)',
              animation: 'heroLightSweep 7s cubic-bezier(0.2, 0.7, 0.2, 1) infinite',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
