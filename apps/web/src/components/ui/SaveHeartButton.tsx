'use client';

import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { SxProps, Theme } from '@mui/material/styles';
import { useWishlist } from '@/context/WishlistContext';

interface SaveHeartButtonProps {
  productId: string;
  productName: string;
  sx?: SxProps<Theme>;
  size?: 'small' | 'medium';
}

export function SaveHeartButton({
  productId,
  productName,
  sx,
  size = 'medium',
}: SaveHeartButtonProps) {
  const { isSaved, toggleSaved } = useWishlist();
  const [popKey, setPopKey] = useState(0);
  const saved = isSaved(productId);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setPopKey((k) => k + 1);
    toggleSaved(productId);
  };

  return (
    <IconButton
      onClick={handleClick}
      size={size}
      aria-label={saved ? `Remove ${productName} from saved` : `Save ${productName}`}
      aria-pressed={saved}
      data-testid={`save-heart-${productId}`}
      sx={[
        (theme) => ({
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            bgcolor: theme.palette.background.default,
          },
          '& svg': {
            animation:
              popKey > 0
                ? 'heartScalePop 0.36s cubic-bezier(0.2, 0.7, 0.2, 1)'
                : 'none',
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {saved ? (
        <FavoriteIcon key={popKey} fontSize="small" />
      ) : (
        <FavoriteBorderOutlinedIcon key={popKey} fontSize="small" />
      )}
    </IconButton>
  );
}
