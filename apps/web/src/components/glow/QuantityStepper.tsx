'use client';

import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

interface QuantityStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  /** Used in the accessible names, e.g. "Decrease Sérum Lumière". */
  itemName?: string;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  /** Background of the pill; 'ground' inside white cards, 'surface' on the canvas. */
  tone?: 'ground' | 'surface';
  testIdPrefix?: string;
}

/** Pill quantity stepper: [−] n [+]. */
export function QuantityStepper({
  value,
  onDecrease,
  onIncrease,
  itemName,
  min = 1,
  max = 99,
  size = 'md',
  tone = 'ground',
  testIdPrefix,
}: QuantityStepperProps) {
  const button = size === 'sm' ? 30 : 40;
  const suffix = itemName ? ` ${itemName}` : ' quantity';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.25,
        p: '4px',
        borderRadius: '999px',
        bgcolor: tone === 'ground' ? 'background.default' : 'background.paper',
        flexShrink: 0,
      }}
    >
      <IconButton
        aria-label={`Decrease${suffix}`}
        onClick={onDecrease}
        disabled={value <= min}
        data-testid={testIdPrefix ? `${testIdPrefix}-decrease` : undefined}
        sx={{ width: button, height: button, bgcolor: 'background.paper', '&:hover': { bgcolor: 'glow.petal' } }}
      >
        <RemoveRoundedIcon sx={{ fontSize: size === 'sm' ? 14 : 16 }} />
      </IconButton>
      <Typography
        aria-live="polite"
        sx={{ minWidth: size === 'sm' ? 22 : 28, textAlign: 'center', fontWeight: 700, fontSize: size === 'sm' ? 14 : 15 }}
      >
        {value}
      </Typography>
      <IconButton
        aria-label={`Increase${suffix}`}
        onClick={onIncrease}
        disabled={value >= max}
        data-testid={testIdPrefix ? `${testIdPrefix}-increase` : undefined}
        sx={{
          width: button,
          height: button,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          '&:hover': { bgcolor: 'primary.main', opacity: 0.88 },
          '&.Mui-disabled': { bgcolor: 'glow.mauve', color: 'primary.contrastText' },
        }}
      >
        <AddRoundedIcon sx={{ fontSize: size === 'sm' ? 14 : 16 }} />
      </IconButton>
    </Box>
  );
}
