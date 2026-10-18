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
        mt: 2,
        pt: 2,
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'text.primary',
          fontWeight: 500,
          fontSize: '0.9375rem',
          flexShrink: 0,
          mr: 0.75,
        }}
      >
        By concern or ingredient:
      </Typography>

      {SKIN_CONCERNS_AND_INGREDIENTS.map((item) => {
        const isSelected = searchQuery.toLowerCase() === item.query.toLowerCase();
        return (
          <Chip
            key={item.label}
            label={item.label}
            size="small"
            clickable
            data-active={isSelected ? 'true' : 'false'}
            color={isSelected ? 'primary' : 'default'}
            variant={isSelected ? 'filled' : 'outlined'}
            onClick={() => {
              if (isSelected) {
                setSearchQuery('');
              } else {
                setActiveCategory('All');
                setSearchQuery(item.query);
              }
            }}
            sx={{
              height: 36,
              fontSize: '0.9rem',
              fontWeight: 500,
              flexShrink: 0,
            }}
          />
        );
      })}

      {searchQuery && (
        <Chip
          label="Clear filter"
          size="small"
          clickable
          onClick={() => setSearchQuery('')}
          sx={{
            height: 36,
            fontSize: '0.9rem',
            fontWeight: 500,
            flexShrink: 0,
          }}
        />
      )}
    </Box>
  );
}
