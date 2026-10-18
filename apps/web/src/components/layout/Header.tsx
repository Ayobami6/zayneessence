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
    <AppBar position="sticky" component="header">
      {/* Subtle studio utility bar */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          py: 0.75,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
              Lagos &amp; Abuja 1–2 day delivery · Free over ₦150,000
            </Typography>

            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 2.5,
              }}
            >
              <Typography
                component={Link}
                href="/#consultation"
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  '&:hover': { color: 'text.primary' },
                }}
              >
                Skin &amp; scent consultation
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                Ikoyi · Maitama · +234 812 486 3945
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 76 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Left: Wordmark always written in lowercase as "zayneessence" */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3.5 } }}>
            <Typography
              component={Link}
              href="/"
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              sx={{
                fontFamily: 'var(--font-italiana), "Italiana", Georgia, serif',
                fontSize: { xs: '1.65rem', md: '1.95rem' },
                fontWeight: 400,
                letterSpacing: '-0.01em',
                color: 'text.primary',
                textDecoration: 'none',
                textTransform: 'lowercase',
                lineHeight: 1,
              }}
            >
              zayneessence
            </Typography>

            <Box
              component="nav"
              aria-label="Primary navigation"
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}
            >
              <Button
                component={Link}
                href="/#catalogue"
                color="inherit"
                sx={{ px: 1.75, py: 0.75, fontSize: '0.9375rem' }}
              >
                Shop
              </Button>
              <Button
                component={Link}
                href="/#consultation"
                color="inherit"
                sx={{ px: 1.75, py: 0.75, fontSize: '0.9375rem' }}
              >
                Skin consultation
              </Button>
              <Button
                component={Link}
                href="/saved"
                color="inherit"
                sx={{ px: 1.75, py: 0.75, fontSize: '0.9375rem' }}
              >
                Saved{savedIds.length > 0 ? ` (${savedIds.length})` : ''}
              </Button>
              <Button
                component={Link}
                href="/account"
                color="inherit"
                sx={{ px: 1.75, py: 0.75, fontSize: '0.9375rem' }}
              >
                Account
              </Button>
              <Button
                component={Link}
                href="/admin"
                color="inherit"
                sx={{ px: 1.75, py: 0.75, fontSize: '0.9375rem', color: 'text.secondary' }}
              >
                Studio admin
              </Button>
            </Box>
          </Box>

          {/* Right: Theme toggle, Search, Saved (desktop), Account (mobile/desktop), Bag with count badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
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
              aria-label={isSearchOpen || searchQuery ? 'Close search' : 'Search pieces'}
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
              aria-label="Account"
              data-testid="header-account-link"
            >
              <PersonOutlineOutlinedIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={openBag}
              color="inherit"
              aria-label={`View bag, ${totalCount} ${totalCount === 1 ? 'item' : 'items'}`}
              data-testid="header-bag-button"
            >
              <Badge
                key={badgeBumpKey}
                badgeContent={totalCount}
                invisible={totalCount === 0}
                sx={{
                  '& .MuiBadge-badge': {
                    animation:
                      badgeBumpKey > 0
                        ? 'badgeBump 0.42s cubic-bezier(0.2, 0.7, 0.2, 1)'
                        : 'none',
                  },
                }}
              >
                <LocalMallOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
