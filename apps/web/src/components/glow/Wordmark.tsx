import React from 'react';
import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';

interface WordmarkProps {
  /** Font size in px or any CSS length; responsive objects allowed. */
  size?: number | string | Record<string, number | string>;
  component?: React.ElementType;
  sx?: SxProps<Theme>;
}

/** The lowercase Italiana wordmark — the only place the display serif is used. */
export function Wordmark({ size = 28, component = 'span', sx }: WordmarkProps) {
  return (
    <Typography
      variant="wordmark"
      component={component}
      sx={[{ fontSize: size, color: 'text.primary', whiteSpace: 'nowrap' }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      zayneessence
    </Typography>
  );
}
