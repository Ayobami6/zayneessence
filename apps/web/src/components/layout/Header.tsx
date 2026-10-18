'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useColorMode } from '@/theme/ThemeRegistry';
import { useStoreData } from '@/context/StoreDataContext';
import { useBag } from '@/context/BagContext';
import { useWishlist } from '@/context/WishlistContext';

export function Header() {
  const { mode, toggleColorMode } = useColorMode();
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useStoreData();
  const { totalCount, openBag, badgeBumpKey } = useBag();
  const { savedIds } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <AppBar
      position="sticky"
      component="header"
      sx={{
        bgcolor: 'background.paper',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: 1,
        borderColor: 'divider',
        transition: (theme) => theme.palette.zayne.modeTransition,
      }}
    >
      {/* Top Parade-style studio status ribbon */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          py: 0.75,
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Live studio status pill with pulsating dot (Parade Studio signature) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: '#34D399',
                  animation: 'pulseDot 2s ease-in-out infinite',
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'var(--font-jost), "Jost", sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  color: 'text.primary',
                }}
              >
                Ikoyi &amp; Maitama studios open · Lagos &amp; Abuja 1–2 day delivery
              </Typography>
            </Box>

            <Typography
              sx={{
                display: { xs: 'none', md: 'block' },
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: '0.8125rem',
                color: 'text.secondary',
              }}
            >
              Complimentary delivery nationwide over ₦150,000
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main navigation bar */}
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 66, md: 80 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Left: Wordmark always written in lowercase as "zayneessence" */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 } }}>
            <Typography
              component={Link}
              href="/"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              sx={{
                fontFamily: 'var(--font-italiana), "Italiana", Georgia, serif',
                fontSize: { xs: '1.9rem', md: '2.3rem' },
                fontWeight: 400,
                WebkitTextStroke: '0.25px currentColor',
                letterSpacing: '-0.02em',
                color: 'text.primary',
                textDecoration: 'none',
                textTransform: 'lowercase',
                lineHeight: 1,
              }}
            >
              zayneessence
            </Typography>

            {/* Parade-style centered navigation links */}
            <Box
              component="nav"
              aria-label="Primary navigation"
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.75 }}
            >
              <Button
                component={Link}
                href="/#catalogue"
                color="inherit"
                sx={{ px: 2, py: 0.85, fontSize: '0.96875rem', fontWeight: 500 }}
              >
                Shop
              </Button>
              <Button
                component={Link}
                href="/#rituals"
                color="inherit"
                sx={{ px: 2, py: 0.85, fontSize: '0.96875rem', fontWeight: 500 }}
              >
                Rituals
              </Button>
              <Button
                component={Link}
                href="/#provenance"
                color="inherit"
                sx={{ px: 2, py: 0.85, fontSize: '0.96875rem', fontWeight: 500 }}
              >
                Provenance
              </Button>
              <Button
                component={Link}
                href="/#journal"
                color="inherit"
                sx={{ px: 2, py: 0.85, fontSize: '0.96875rem', fontWeight: 500 }}
              >
                Journal
              </Button>
              <Button
                component={Link}
                href="/admin"
                color="inherit"
                sx={{ px: 2, py: 0.85, fontSize: '0.96875rem', fontWeight: 400, color: 'text.secondary' }}
              >
                Studio admin
              </Button>
            </Box>
          </Box>

          {/* Right Action Icons & Bag Pill Button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1.25 } }}>
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              aria-label={
                mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
              }
              data-testid="theme-toggle-button"
            >
              {mode === 'light' ? (
                <DarkModeOutlinedIcon fontSize="small" />
              ) : (
                <LightModeOutlinedIcon fontSize="small" />
              )}
            </IconButton>

            <IconButton
              onClick={handleToggleSearch}
              color="inherit"
              aria-label={isSearchOpen || searchQuery ? 'Close search' : 'Search catalogue'}
              aria-expanded={isSearchOpen}
              data-testid="search-toggle-button"
            >
              {isSearchOpen ? (
                <CloseOutlinedIcon fontSize="small" />
              ) : (
                <SearchOutlinedIcon fontSize="small" />
              )}
            </IconButton>

            <IconButton
              component={Link}
              href="/saved"
              color="inherit"
              aria-label={`Saved pieces (${savedIds.length})`}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              data-testid="header-saved-link"
            >
              <Badge badgeContent={savedIds.length} invisible={savedIds.length === 0}>
                <FavoriteBorderOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>

            <IconButton
              component={Link}
              href="/account"
              color="inherit"
              aria-label="Account & orders"
              data-testid="header-account-link"
            >
              <PersonOutlineOutlinedIcon fontSize="small" />
            </IconButton>

            {/* Parade-style prominent Bag Pill Button */}
            <Button
              variant="contained"
              color="primary"
              onClick={openBag}
              data-testid="header-bag-button"
              startIcon={<LocalMallOutlinedIcon sx={{ fontSize: 18 }} />}
              sx={{
                px: { xs: 2, sm: 2.75 },
                py: 0.9,
                fontSize: '0.9375rem',
                fontWeight: 500,
                ml: 0.5,
              }}
            >
              Bag{totalCount > 0 ? ` (${totalCount})` : ''}
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
