'use client';

import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useStoreData } from '@/context/StoreDataContext';

const SUGGESTED_TERMS = ['shea', 'rose', 'oud', 'serum', 'baobab', 'moringa', 'bakhoor'];

export function SearchTray() {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, setActiveCategory } = useStoreData();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen && !searchQuery) {
    return null;
  }

  return (
    <Box role="search" aria-label="Search catalogue" sx={{ pb: 2, animation: 'glowRise 0.35s ease' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            pl: 2.25,
            pr: 0.75,
            minHeight: 56,
            borderRadius: '999px',
            bgcolor: 'background.paper',
            boxShadow: (t) => t.palette.glow.shadow,
          }}
        >
          <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 22 }} />
          <InputBase
            inputRef={inputRef}
            fullWidth
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveCategory('All');
            }}
            placeholder="Search shea, baobab, oud, rose, bakhoor…"
            inputProps={{
              'aria-label': 'Search products by name, type and category',
              'data-testid': 'search-input',
            }}
            sx={{ fontSize: 16, fontWeight: 500, color: 'text.primary' }}
          />
          {searchQuery ? (
            <IconButton aria-label="Clear search query" onClick={() => setSearchQuery('')} sx={{ bgcolor: 'background.default' }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
            Try:
          </Typography>
          {SUGGESTED_TERMS.map((term) => (
            <Chip
              key={term}
              label={term}
              size="small"
              clickable
              data-active={searchQuery.toLowerCase() === term ? 'true' : undefined}
              onClick={() => {
                setSearchQuery(term);
                setActiveCategory('All');
              }}
            />
          ))}
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            label="Close search"
            size="small"
            clickable
            onClick={() => {
              setSearchQuery('');
              setIsSearchOpen(false);
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
