import React from 'react';
import Box from '@mui/material/Box';
import Typography, { TypographyProps } from '@mui/material/Typography';

interface AccentHeadingProps extends Omit<TypographyProps, 'children'> {
  /** Plain lead-in text. */
  text: string;
  /** Italic accent word(s) set in the accent colour after the lead-in. */
  accent?: string;
  /** Use the bloom accent (for headings on inverse/dark surfaces). */
  onInverse?: boolean;
  component?: React.ElementType;
}

/**
 * Glow headline pattern: bold sans lead-in with an italic accent word,
 * e.g. "Skin that glows, *quietly.*"
 */
export function AccentHeading({ text, accent, onInverse = false, variant = 'h2', ...rest }: AccentHeadingProps) {
  return (
    <Typography variant={variant} {...rest}>
      {text}
      {accent ? (
        <>
          {' '}
          <Box
            component="em"
            sx={{
              fontStyle: 'italic',
              fontWeight: 600,
              color: onInverse ? 'glow.bloom' : 'glow.accent',
            }}
          >
            {accent}
          </Box>
        </>
      ) : null}
    </Typography>
  );
}
