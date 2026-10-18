'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { CATEGORY_ORDER, CategoryFilter } from '@/types/domain';
import { useStoreData } from '@/context/StoreDataContext';

export function CategoryChips() {
  const { activeCategory, setActiveCategory } = useStoreData();

  return (
    <Box
      role="tablist"
      aria-label="Filter products by category"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        overflowX: 'auto',
        py: 1,
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {CATEGORY_ORDER.map((category: CategoryFilter) => {
        const isActive = activeCategory === category;
        return (
          <Chip
            key={category}
            role="tab"
            aria-selected={isActive}
            data-active={isActive ? 'true' : 'false'}
            data-testid={`category-chip-${category.toLowerCase()}`}
            label={category}
            clickable
            color={isActive ? 'primary' : 'default'}
            variant={isActive ? 'filled' : 'outlined'}
            onClick={() => setActiveCategory(category)}
            sx={{
              flexShrink: 0,
              px: 1.5,
            }}
          />
        );
      })}
    </Box>
  );
}
