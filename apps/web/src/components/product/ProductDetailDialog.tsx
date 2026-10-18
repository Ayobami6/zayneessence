'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TransitionProps } from '@mui/material/transitions';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Product } from '@/types/domain';
import { ProductDetailView } from './ProductDetailView';

const SlideUpTransition = React.forwardRef(function SlideUpTransition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
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
          px: { xs: 2.5, md: 4 },
          py: 1.75,
          bgcolor: (t) => t.palette.zayne.headerGlass,
          backdropFilter: 'blur(14px)',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-italiana), "Italiana", Georgia, serif',
            fontSize: '1.35rem',
            textTransform: 'lowercase',
          }}
        >
          zayneessence
        </Typography>
        <IconButton
          onClick={handleClose}
          aria-label="Close product view"
          data-testid="close-product-dialog"
        >
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ px: { xs: 2.5, md: 5 }, pb: 6 }}>
        <ProductDetailView product={product} onCloseModal={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
