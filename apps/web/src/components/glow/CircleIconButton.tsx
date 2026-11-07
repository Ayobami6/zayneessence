'use client';

import React from 'react';
import Link from 'next/link';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';

type Tone = 'surface' | 'ground' | 'action' | 'scrim';

interface CircleIconButtonProps extends Omit<IconButtonProps, 'size'> {
  /** Accessible name — required because these buttons are icon-only. */
  label: string;
  href?: string;
  tone?: Tone;
  size?: number;
}

/** 44px+ circular icon button used for back, save, search, info and nav actions. */
export const CircleIconButton = React.forwardRef<HTMLButtonElement, CircleIconButtonProps>(function CircleIconButton(
  { label, href, tone = 'surface', size = 44, sx, children, ...rest },
  ref
) {
  const linkProps = href ? { component: Link, href } : {};
  return (
    <IconButton
      ref={ref}
      aria-label={label}
      {...linkProps}
      {...rest}
      sx={[
        (theme) => {
          const g = theme.palette.glow;
          const bg = { surface: g.surface, ground: g.ground, action: g.action, scrim: g.scrim }[tone];
          const fg = tone === 'action' ? g.actionText : g.text;
          return {
            width: size,
            height: size,
            flexShrink: 0,
            bgcolor: bg,
            color: fg,
            transition: 'transform 0.2s ease, background-color 0.3s ease',
            '&:hover': { bgcolor: tone === 'action' ? g.action : g.petal, opacity: tone === 'action' ? 0.9 : 1 },
            '&:active': { transform: 'scale(0.95)' },
            '& .MuiSvgIcon-root': { fontSize: Math.round(size * 0.45) },
          };
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </IconButton>
  );
});
