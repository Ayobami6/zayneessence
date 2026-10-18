'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useWishlist } from '@/context/WishlistContext';
import { useStoreData } from '@/context/StoreDataContext';
import { useBag } from '@/context/BagContext';
import { ProductTile } from '@/components/catalogue/ProductTile';
import { formatKoboToNgn } from '@/utils/currency';

export default function SavedPage() {
  const { savedIds, isSyncedToAccount } = useWishlist();
  const { products } = useStoreData();
  const { addToBag } = useBag();

  const savedProducts = useMemo(
    () => products.filter((p) => savedIds.includes(p.id)),
    [products, savedIds]
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h2" component="h1" sx={{ mb: 1 }}>
            Saved pieces
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {isSyncedToAccount
              ? 'Synced to your zayneessence account across devices.'
              : 'Saved on this device. Sign in to keep your list across devices.'}
          </Typography>
        </Box>

        {!isSyncedToAccount && (
          <Chip
            component={Link}
            href="/account"
            clickable
            label="Sign in to sync"
            sx={{ textDecoration: 'none' }}
          />
        )}
      </Box>

      {savedProducts.length === 0 ? (
        <Box
          data-testid="saved-empty-state"
          sx={{
            py: 10,
            px: 3,
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="body1" sx={{ mb: 3, mx: 'auto' }}>
            Tap the heart on any piece to keep it here.
          </Typography>
          <Button component={Link} href="/#catalogue" variant="contained" color="primary">
            Shop skincare
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(3, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            gap: { xs: 2.5, sm: 3.5 },
          }}
        >
          {savedProducts.map((product) => {
            const firstVariant = product.variants[0];
            return (
              <Box
                key={product.id}
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
              >
                <ProductTile product={product} />
                {firstVariant && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => addToBag(product, firstVariant, 1)}
                    data-testid={`saved-add-to-bag-${product.slug}`}
                    sx={{ py: 1 }}
                  >
                    Add to bag · {formatKoboToNgn(firstVariant.price_kobo)}
                  </Button>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
}
