'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/material/styles';
import { formatKoboToNgn } from '@/utils/currency';

interface AnimatedPriceProps {
  kobo: number;
  sx?: SxProps<Theme>;
  component?: React.ElementType;
  'data-testid'?: string;
}

export function AnimatedPrice({
  kobo,
  sx,
  component = 'span',
  'data-testid': testId,
}: AnimatedPriceProps) {
  return (
    <Box
      key={kobo}
      component={component}
      data-testid={testId}
      sx={[
        {
          display: 'inline-block',
          animation: 'priceFadeUp 0.28s cubic-bezier(0.2, 0.7, 0.2, 1)',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {formatKoboToNgn(kobo)}
    </Box>
  );
}
