'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Product } from '@/types/domain';
import { CircleIconButton, Wordmark } from '@/components/glow';
import { ProductDetailView } from './ProductDetailView';

const SlideUpTransition = React.forwardRef(function SlideUpTransition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ProductDetailDialog({ product }: { product: Product }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    router.back();
  };

  return (
    <Dialog
      open
      onClose={handleClose}
      fullScreen={isMobile}
      maxWidth="lg"
      fullWidth
      TransitionComponent={SlideUpTransition}
      aria-label={product.name}
      data-testid="product-detail-dialog"
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          py: 1.5,
          bgcolor: (t) => (t.palette.mode === 'light' ? 'rgba(246, 234, 243, 0.9)' : 'rgba(21, 12, 20, 0.9)'),
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <Wordmark size={24} />
        <CircleIconButton label="Close product view" onClick={handleClose} data-testid="close-product-dialog">
          <CloseRoundedIcon />
        </CircleIconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 1.5, md: 4 }, pt: 0, pb: { xs: 2, md: 5 } }}>
        <ProductDetailView key={product.id} product={product} onCloseModal={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
