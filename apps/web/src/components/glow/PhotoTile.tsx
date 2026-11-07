'use client';

import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import type { SxProps, Theme } from '@mui/material/styles';
import { GLOW_BLUR_DATA_URL } from '@/data/blur';

interface PhotoTileProps {
  src: string;
  alt: string;
  /** CSS aspect-ratio like '4 / 5' (responsive object allowed). Ignored when `height` is given. */
  aspectRatio?: string | Record<string, string>;
  height?: number | string | Record<string, number | string>;
  radius?: number | string | Record<string, number | string>;
  sizes?: string;
  priority?: boolean;
  objectPosition?: string;
  /** Show the white arrow-in-circle badge in the top-left corner. */
  badge?: boolean;
  blurDataURL?: string;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

/** Rounded photography tile on a petal ground; children are overlaid (badges, info panels). */
export function PhotoTile({
  src,
  alt,
  aspectRatio = '4 / 5',
  height,
  radius = '32px',
  sizes = '(max-width: 600px) 90vw, 400px',
  priority = false,
  objectPosition = '50% 50%',
  badge = false,
  blurDataURL,
  children,
  sx,
}: PhotoTileProps) {
  return (
    <Box
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          borderRadius: radius,
          bgcolor: 'glow.petal',
          width: '100%',
          ...(height ? { height } : { aspectRatio }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurDataURL || GLOW_BLUR_DATA_URL}
        style={{ objectFit: 'cover', objectPosition }}
      />
      {badge ? (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 40,
            height: 40,
            borderRadius: '999px',
            bgcolor: 'glow.scrim',
            color: 'glow.accent',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <NorthEastRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      ) : null}
      {children}
    </Box>
  );
}

/** White panel laid over the bottom of a photo so names and prices stay legible. */
export function InfoPanel({ children, inset = 10, sx }: { children: React.ReactNode; inset?: number; sx?: SxProps<Theme> }) {
  return (
    <Box
      sx={[
        {
          position: 'absolute',
          left: inset,
          right: inset,
          bottom: inset,
          px: 1.75,
          py: 1.25,
          borderRadius: '22px',
          bgcolor: 'glow.scrim',
          color: 'text.primary',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.25,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
}
