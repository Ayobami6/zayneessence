'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Badge from '@mui/material/Badge';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { useColorMode } from '@/theme/ThemeRegistry';
import { useStoreData } from '@/context/StoreDataContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { CircleIconButton, Wordmark } from '@/components/glow';

// Between 900px and 1200px the full row (nav, admin link, five actions) doesn't fit, so the
// header tightens there: Journal, the admin link and the theme toggle wait for wide screens
// (Journal is in the footer and on the home page; dark mode is also in Account).
const NAV_LINKS = [
  { label: 'Shop', href: '/', match: (p: string) => p === '/' || p.startsWith('/products') },
  { label: 'Consultation', href: '/consultation', match: (p: string) => p.startsWith('/consultation') },
  { label: 'Bakhoor', href: '/shop/bakhoor', match: (p: string) => p === '/shop/bakhoor' },
  { label: 'Supplements', href: '/shop/supplements', match: (p: string) => p === '/shop/supplements' },
  { label: 'Journal', href: '/#journal', match: () => false, wideOnly: true },
];

export function Header() {
  const { mode, toggleColorMode } = useColorMode();
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useStoreData();
  const { totalCount, openBag, badgeBumpKey } = useBag();
  const { savedIds } = useWishlist();
  const { session } = useAuth();
  const pathname = usePathname() || '/';
  const router = useRouter();
  const isCheckout = pathname.startsWith('/checkout');

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    } else {
      setIsSearchOpen(true);
      if (pathname !== '/') {
        router.push('/');
      }
    }
  };

  const initial = session?.name?.trim()?.charAt(0)?.toUpperCase();

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
        bgcolor: (t) => (t.palette.mode === 'light' ? 'rgba(246, 234, 243, 0.86)' : 'rgba(21, 12, 20, 0.86)'),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: { xs: 68, md: 88 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 2, md: 1.5, lg: 2 },
          }}
        >
          <Box
            component={Link}
            href="/"
            aria-label="zayneessence home"
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
            sx={{ textDecoration: 'none', display: 'inline-flex' }}
          >
            <Wordmark size={{ xs: 26, lg: 30 }} />
          </Box>

          {!isCheckout ? (
            <Box
              component="nav"
              aria-label="Primary navigation"
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                p: '5px',
                borderRadius: '999px',
                bgcolor: 'background.paper',
              }}
            >
              {NAV_LINKS.map((link) => {
                const active = link.match(pathname);
                return (
                  <Box
                    key={link.label}
                    component={Link}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    sx={{
                      height: 40,
                      px: { md: 1.5, lg: 2.25 },
                      borderRadius: '999px',
                      display: 'wideOnly' in link ? { md: 'none', lg: 'flex' } : 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      fontSize: { md: 13.5, lg: 14 },
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: active ? 'primary.contrastText' : 'text.primary',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      transition: 'background-color 0.25s ease',
                      '&:hover': { bgcolor: active ? 'primary.main' : 'background.default' },
                    }}
                  >
                    {link.label}
                  </Box>
                );
              })}
              {session?.role === 'admin' ? (
                <Box
                  component={Link}
                  href="/admin"
                  sx={{ height: 40, px: 2, display: { md: 'none', lg: 'flex' }, alignItems: 'center', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 600, color: 'text.secondary' }}
                >
                  Studio admin
                </Box>
              ) : null}
            </Box>
          ) : null}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1 } }}>
            <CircleIconButton
              label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              onClick={toggleColorMode}
              data-testid="theme-toggle-button"
              sx={{ display: { xs: 'none', lg: 'inline-flex' } }}
            >
              {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </CircleIconButton>

            {!isCheckout ? (
              <CircleIconButton
                label={isSearchOpen || searchQuery ? 'Close search' : 'Search catalogue'}
                aria-expanded={isSearchOpen}
                onClick={handleToggleSearch}
                data-testid="search-toggle-button"
              >
                {isSearchOpen ? <CloseRoundedIcon /> : <SearchRoundedIcon />}
              </CircleIconButton>
            ) : null}

            <CircleIconButton
              label={`Saved pieces (${savedIds.length})`}
              href="/saved"
              data-testid="header-saved-link"
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              <Badge badgeContent={savedIds.length} invisible={savedIds.length === 0}>
                <FavoriteBorderRoundedIcon />
              </Badge>
            </CircleIconButton>

            <CircleIconButton
              label={totalCount > 0 ? `Bag, ${totalCount} pieces` : 'Bag'}
              onClick={openBag}
              data-testid="header-bag-button"
              sx={{ display: { xs: 'none', md: 'inline-flex' } }}
            >
              <Badge
                key={badgeBumpKey}
                badgeContent={totalCount}
                invisible={totalCount === 0}
                sx={{ '& .MuiBadge-badge': { animation: badgeBumpKey > 0 ? 'badgeBump 0.45s ease' : 'none' } }}
              >
                <ShoppingBagOutlinedIcon />
              </Badge>
            </CircleIconButton>

            <CircleIconButton
              label="Account & orders"
              href="/account"
              tone={initial ? 'action' : 'surface'}
              data-testid="header-account-link"
            >
              {initial ? (
                <Box component="span" sx={{ fontSize: 16, fontWeight: 700 }}>
                  {initial}
                </Box>
              ) : (
                <PersonOutlineRoundedIcon />
              )}
            </CircleIconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
