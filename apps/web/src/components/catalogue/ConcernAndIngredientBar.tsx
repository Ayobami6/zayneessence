'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useStoreData } from '@/context/StoreDataContext';

const SKIN_CONCERNS_AND_INGREDIENTS = [
  { label: 'Hyperpigmentation', query: 'hyperpigmentation' },
  { label: 'Unrefined shea', query: 'shea' },
  { label: 'Baobab & moringa', query: 'baobab' },
  { label: 'Niacinamide', query: 'niacinamide' },
  { label: 'Aged oud', query: 'agarwood' },
  { label: 'Taif rose', query: 'rose' },
  { label: 'Skin musk', query: 'musk' },
];

export function ConcernAndIngredientBar() {
  const { searchQuery, setSearchQuery, setActiveCategory } = useStoreData();

  return (
    <Box
      sx={{
        mt: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        overflowX: 'auto',
        mx: { xs: -2, md: 0 },
        px: { xs: 2, md: 0 },
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, mr: 0.5, fontSize: 13 }}>
        By concern:
      </Typography>
      {SKIN_CONCERNS_AND_INGREDIENTS.map((item) => {
        const isSelected = searchQuery.toLowerCase() === item.query.toLowerCase();
        return (
          <Chip
            key={item.label}
            label={item.label}
            clickable
            data-active={isSelected ? 'true' : 'false'}
            onClick={() => {
              if (isSelected) {
                setSearchQuery('');
              } else {
                setActiveCategory('All');
                setSearchQuery(item.query);
              }
            }}
            sx={{
              flexShrink: 0,
              height: 36,
              bgcolor: isSelected ? undefined : 'transparent',
              border: (t) => (isSelected ? 'none' : `1px solid ${t.palette.glow.mauve}`),
            }}
          />
        );
      })}
      {searchQuery ? (
        <Chip label="Clear filter" clickable onClick={() => setSearchQuery('')} sx={{ flexShrink: 0, height: 36 }} />
      ) : null}
    </Box>
  );
}
