import React from 'react';
import type { Metadata } from 'next';
import { SkinConsultationSection } from '@/components/catalogue/SkinConsultationSection';

export const metadata: Metadata = {
  title: 'Skin & scent consultation',
  description:
    'Pick a goal and the zayneessence studio builds a three-step ritual for melanin-rich skin, from shea and baobab to pure aged oud.',
};

export default function ConsultationPage() {
  return <SkinConsultationSection />;
}
