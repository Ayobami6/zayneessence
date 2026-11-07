'use client';

import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { SxProps, Theme } from '@mui/material/styles';
import { useWishlist } from '@/context/WishlistContext';

interface SaveHeartButtonProps {
  productId: string;
  productName: string;
  sx?: SxProps<Theme>;
  size?: 'small' | 'medium';
}

/** Circular save toggle; filled orchid heart when saved. */
export function SaveHeartButton({ productId, productName, sx, size = 'medium' }: SaveHeartButtonProps) {
  const { isSaved, toggleSaved } = useWishlist();
  const [popKey, setPopKey] = useState(0);
  const saved = isSaved(productId);
  const dimension = size === 'small' ? 36 : 42;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setPopKey((k) => k + 1);
    toggleSaved(productId);
  };

  return (
    <IconButton
      onClick={handleClick}
      aria-label={saved ? `Remove ${productName} from saved` : `Save ${productName}`}
      aria-pressed={saved}
      data-testid={`save-heart-${productId}`}
      sx={[
        (theme) => ({
          width: dimension,
          height: dimension,
          bgcolor: theme.palette.background.paper,
          color: saved ? theme.palette.glow.accent : theme.palette.text.primary,
          boxShadow: theme.palette.glow.shadow,
          '&:hover': { bgcolor: theme.palette.background.paper, opacity: 0.92 },
          '& svg': {
            fontSize: size === 'small' ? 17 : 20,
            animation: popKey > 0 ? 'heartScalePop 0.36s cubic-bezier(0.2, 0.7, 0.2, 1)' : 'none',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {saved ? <FavoriteRoundedIcon key={popKey} /> : <FavoriteBorderRoundedIcon key={popKey} />}
    </IconButton>
  );
}
