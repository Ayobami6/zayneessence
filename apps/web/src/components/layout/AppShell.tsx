'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { ThemeRegistry } from '@/theme/ThemeRegistry';
import { StoreDataProvider } from '@/context/StoreDataContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { BagProvider } from '@/context/BagContext';
import { Header } from './Header';
import { SearchTray } from './SearchTray';
import { BagDrawer } from '@/components/bag/BagDrawer';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';

export function AppShell({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <ThemeRegistry>
      <StoreDataProvider>
        <AuthProvider>
          <WishlistProvider>
            <BagProvider>
              <Box
                sx={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Header />
                <SearchTray />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  {children}
                </Box>
                {modal}
                <BagDrawer />
                <Footer />
                <MobileBottomNav />
              </Box>
            </BagProvider>
          </WishlistProvider>
        </AuthProvider>
      </StoreDataProvider>
    </ThemeRegistry>
  );
}
