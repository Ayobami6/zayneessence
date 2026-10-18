'use client';

import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useStoreData } from '@/context/StoreDataContext';

const SUGGESTED_TERMS = ['shea', 'rose', 'oud', 'serum', 'baobab', 'moringa'];

export function SearchTray() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
  } = useStoreData();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen && !searchQuery) {
    return null;
  }

  return (
    <Box
      role="search"
      aria-label="Search catalogue"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: 2,
        transition: (theme) => theme.palette.zayne.modeTransition,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 1,
            borderRadius: 999,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          <SearchOutlinedIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
          <InputBase
            inputRef={inputRef}
            fullWidth
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveCategory('All');
            }}
            placeholder="Search by name, ingredient or scent note (shea, baobab, oud, rose…)"
            inputProps={{
              'aria-label': 'Search products by name, type and category',
              'data-testid': 'search-input',
            }}
            sx={{
              fontSize: '1rem',
              fontWeight: 300,
              color: 'text.primary',
            }}
          />
          {searchQuery && (
            <IconButton
              size="small"
              aria-label="Clear search query"
              onClick={() => setSearchQuery('')}
            >
              <CloseOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', mr: 0.5 }}>
            Suggested:
          </Typography>
          {SUGGESTED_TERMS.map((term) => (
            <Chip
              key={term}
              label={term}
              size="small"
              clickable
              onClick={() => {
                setSearchQuery(term);
                setActiveCategory('All');
              }}
              sx={{
                height: 30,
                fontSize: '0.8125rem',
                bgcolor:
                  searchQuery.toLowerCase() === term
                    ? 'primary.main'
                    : 'background.default',
                color:
                  searchQuery.toLowerCase() === term
                    ? 'primary.contrastText'
                    : 'text.secondary',
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
            sx={{ height: 30, fontSize: '0.8125rem' }}
          />
        </Box>
      </Container>
    </Box>
  );
}
