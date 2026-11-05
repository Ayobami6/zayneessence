'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { useWishlist } from '@/context/WishlistContext';
import { useStoreData } from '@/context/StoreDataContext';
import { ProductTile } from '@/components/catalogue/ProductTile';
import { AccentHeading } from '@/components/glow';
import { CATEGORY_META, Product } from '@/types/domain';

type SavedFilter = 'all' | 'skincare' | 'scent' | 'supplements';

const FILTERS: Array<{ id: SavedFilter; label: string; test: (p: Product) => boolean }> = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'skincare', label: 'Skincare', test: (p) => p.category === 'Skincare' },
  { id: 'scent', label: 'Scent', test: (p) => CATEGORY_META[p.category].isScent },
  { id: 'supplements', label: 'Supplements', test: (p) => p.category === 'Supplements' },
];

export default function SavedPage() {
  const { savedIds, isSyncedToAccount } = useWishlist();
  const { products } = useStoreData();
  const [filter, setFilter] = useState<SavedFilter>('all');

  const savedProducts = useMemo(
    () => products.filter((p) => p.is_published && savedIds.includes(p.id)),
    [products, savedIds]
  );
  const visible = savedProducts.filter((FILTERS.find((f) => f.id === filter) ?? FILTERS[0]).test);

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 1, md: 2 }, pb: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: { xs: 2, md: 3 } }}>
        <Box>
          <AccentHeading component="h1" variant="h1" text="Kept" accent="for later." sx={{ fontSize: { xs: 31, md: 'clamp(36px, 4vw, 56px)' } }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {isSyncedToAccount
              ? 'Synced to your zayneessence account across devices.'
              : 'Saved on this device. Sign in to keep your list across devices.'}
          </Typography>
        </Box>
        {!isSyncedToAccount ? (
          <Button component={Link} href="/account" variant="outlined">
            Sign in to sync
          </Button>
        ) : null}
      </Box>

      {savedProducts.length === 0 ? (
        <Box data-testid="saved-empty-state" sx={{ py: { xs: 7, md: 10 }, px: 3, textAlign: 'center', borderRadius: '32px', bgcolor: 'background.paper' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '999px', bgcolor: 'background.default', color: 'glow.accent', display: 'grid', placeItems: 'center' }}>
            <FavoriteBorderRoundedIcon />
          </Box>
          <Typography sx={{ mb: 3, mx: 'auto', fontWeight: 600 }}>Tap the heart on any piece to keep it here.</Typography>
          <Button component={Link} href="/#catalogue" variant="contained" size="large">
            Browse the collection
          </Button>
        </Box>
      ) : (
        <>
          <Box role="tablist" aria-label="Filter saved pieces" sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
            {FILTERS.filter((f) => f.id === 'all' || savedProducts.some(f.test)).map((f) => (
              <Chip
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                data-active={filter === f.id ? 'true' : 'false'}
                clickable
                label={f.id === 'all' ? `All · ${savedProducts.length}` : f.label}
                onClick={() => setFilter(f.id)}
              />
            ))}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
              gap: { xs: 1.5, sm: 2 },
              mt: 2,
            }}
          >
            {visible.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </Box>
        </>
      )}
    </Container>
  );
}
