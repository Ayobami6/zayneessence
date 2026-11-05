'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { CATEGORY_META, CATEGORY_ORDER, CategoryFilter } from '@/types/domain';
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
        gap: 1,
        overflowX: 'auto',
        py: 0.5,
        mx: { xs: -2, md: 0 },
        px: { xs: 2, md: 0 },
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {CATEGORY_ORDER.map((category: CategoryFilter) => {
        const isActive = activeCategory === category;
        const label = category === 'All' ? 'All' : CATEGORY_META[category].shortLabel;
        const slug = category === 'All' ? 'all' : CATEGORY_META[category].slug;
        return (
          <Chip
            key={category}
            role="tab"
            aria-selected={isActive}
            data-active={isActive ? 'true' : 'false'}
            data-testid={`category-chip-${slug}`}
            label={label}
            clickable
            onClick={() => setActiveCategory(category)}
            sx={{ flexShrink: 0, px: 1 }}
          />
        );
      })}
    </Box>
  );
}
