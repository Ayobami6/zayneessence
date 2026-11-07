'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import ButtonBase from '@mui/material/ButtonBase';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';

type NavKey = 'home' | 'consultation' | 'saved' | 'bag' | 'account';

/** GlowSkin-style floating pill navigation for phones and small tablets. */
export function FloatingNav() {
  const pathname = usePathname() || '/';
  const { totalCount, openBag, isBagOpen } = useBag();
  const { savedIds } = useWishlist();

  if (pathname.startsWith('/checkout') || pathname.startsWith('/admin')) {
    return null;
  }

  const current: NavKey = isBagOpen
    ? 'bag'
    : pathname.startsWith('/consultation')
      ? 'consultation'
      : pathname.startsWith('/saved')
        ? 'saved'
        : pathname.startsWith('/account')
          ? 'account'
          : 'home';

  const items: Array<{
    key: NavKey;
    label: string;
    href?: string;
    onClick?: () => void;
    icon: React.ReactNode;
    badge?: number;
    testId: string;
  }> = [
    { key: 'home', label: 'Home', href: '/', icon: <HomeOutlinedIcon />, testId: 'mobile-nav-shop' },
    {
      key: 'consultation',
      label: 'Consultation',
      href: '/consultation',
      icon: <AutoAwesomeOutlinedIcon />,
      testId: 'mobile-nav-consultation',
    },
    {
      key: 'saved',
      label: 'Saved',
      href: '/saved',
      icon: <FavoriteBorderRoundedIcon />,
      badge: savedIds.length,
      testId: 'mobile-nav-saved',
    },
    {
      key: 'bag',
      label: 'Bag',
      onClick: openBag,
      icon: <ShoppingBagOutlinedIcon />,
      badge: totalCount,
      testId: 'mobile-nav-bag',
    },
    { key: 'account', label: 'Account', href: '/account', icon: <PersonOutlineRoundedIcon />, testId: 'mobile-nav-account' },
  ];

  return (
    <Box
      component="nav"
      aria-label="Mobile navigation"
      sx={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))',
        zIndex: (t) => t.zIndex.appBar,
        display: { xs: 'flex', md: 'none' },
        gap: 0.75,
        p: 0.75,
        borderRadius: '999px',
        bgcolor: 'glow.glass',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: (t) => t.palette.glow.shadowStrong,
      }}
    >
      {items.map((item) => {
        const active = current === item.key;
        const linkProps = item.href ? { component: Link, href: item.href } : { onClick: item.onClick };
        return (
          <ButtonBase
            key={item.key}
            {...linkProps}
            aria-label={item.badge ? `${item.label}, ${item.badge}` : item.label}
            aria-current={active ? 'page' : undefined}
            data-testid={item.testId}
            sx={{
              width: 52,
              height: 52,
              borderRadius: '999px',
              bgcolor: active ? 'primary.main' : 'background.default',
              color: active ? 'primary.contrastText' : 'text.primary',
              transition: 'background-color 0.25s ease, transform 0.2s ease',
              '&:active': { transform: 'scale(0.94)' },
              '& .MuiSvgIcon-root': { fontSize: 22 },
            }}
          >
            <Badge badgeContent={item.badge || 0} invisible={!item.badge}>
              {item.icon}
            </Badge>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
