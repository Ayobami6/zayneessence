'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Badge from '@mui/material/Badge';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';

export function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalCount, openBag, isBagOpen } = useBag();
  const { savedIds } = useWishlist();

  const currentTab = isBagOpen
    ? 'bag'
    : pathname?.startsWith('/saved')
      ? 'saved'
      : 'shop';

  return (
    <Paper
      component="nav"
      aria-label="Mobile bottom navigation"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        display: { xs: 'block', md: 'none' },
      }}
    >
      <BottomNavigation
        showLabels
        value={currentTab}
        onChange={(_event, newValue) => {
          if (newValue === 'shop') {
            router.push('/');
          } else if (newValue === 'saved') {
            router.push('/saved');
          } else if (newValue === 'bag') {
            openBag();
          }
        }}
      >
        <BottomNavigationAction
          value="shop"
          label="Shop"
          icon={<StorefrontOutlinedIcon fontSize="small" />}
          data-testid="mobile-nav-shop"
        />
        <BottomNavigationAction
          value="saved"
          label="Saved"
          icon={
            <Badge badgeContent={savedIds.length} invisible={savedIds.length === 0}>
              <FavoriteBorderOutlinedIcon fontSize="small" />
            </Badge>
          }
          data-testid="mobile-nav-saved"
        />
        <BottomNavigationAction
          value="bag"
          label="Bag"
          icon={
            <Badge badgeContent={totalCount} invisible={totalCount === 0}>
              <LocalMallOutlinedIcon fontSize="small" />
            </Badge>
          }
          data-testid="mobile-nav-bag"
        />
      </BottomNavigation>
    </Paper>
  );
}
