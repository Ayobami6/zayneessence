import type { Product, ProductVariant } from '@/types/domain';

export type RitualGoalId =
  | 'hyperpigmentation'
  | 'barrier_recovery'
  | 'evening_oud_layering'
  | 'daytime_skin_scent';

export type RitualIcon = 'sparkle' | 'drop' | 'moon' | 'sun';

export interface RitualStepDefinition {
  /** Short verb shown on the consultation arc, e.g. "Treat". */
  verb: string;
  slug: string;
  note: string;
}

export interface RitualDefinition {
  id: RitualGoalId;
  label: string;
  icon: RitualIcon;
  headline: string;
  summary: string;
  steps: RitualStepDefinition[];
}

/** The four skin & scent consultation rituals. Prices always come from the live catalogue. */
export const CONSULTATION_RITUALS: RitualDefinition[] = [
  {
    id: 'hyperpigmentation',
    label: 'Even tone & brightening',
    icon: 'sparkle',
    headline: 'Morning radiance for melanin-rich skin',
    summary:
      'Pairs cold-pressed baobab, Kano hibiscus alpha-hydroxy acids and 5% niacinamide to soften dark marks without sensitising melanin-rich skin.',
    steps: [
      { verb: 'Treat', slug: 'serum-lumiere', note: 'Press three drops into damp skin to target uneven tone and post-blemish marks.' },
      { verb: 'Seal', slug: 'huile-visage', note: 'Lock in hydration with two drops of cold-pressed baobab and Zaria moringa oil.' },
      { verb: 'Scent', slug: 'musc-soie', note: 'Finish with a quiet touch of botanical silk musk on the wrists.' },
    ],
  },
  {
    id: 'barrier_recovery',
    label: 'Dry skin & harmattan repair',
    icon: 'drop',
    headline: 'Overnight lipid replenishment with unrefined shea',
    summary:
      'Built around hand-kneaded northern Nigerian shea butter from Kwara and Niger states to restore dry, tight barriers overnight.',
    steps: [
      { verb: 'Nourish', slug: 'huile-visage', note: 'Warm three drops between palms and press across cheeks and neck.' },
      { verb: 'Cocoon', slug: 'creme-velours', note: 'Melt a pea-sized amount of unrefined shea night cream over the face to seal the barrier.' },
      { verb: 'Body', slug: 'huile-precieuse', note: 'Smooth shea olein and desert date dry oil across shoulders and shins after bathing.' },
    ],
  },
  {
    id: 'evening_oud_layering',
    label: 'Evening oud layering',
    icon: 'moon',
    headline: 'How our studio layers pure oud and eau de parfum',
    summary:
      'In warm Nigerian air, layering an oil base beneath eau de parfum anchors the heartwood resin so it unfolds slowly until morning.',
    steps: [
      { verb: 'Prepare', slug: 'oud-et-santal', note: 'Smooth moringa and sandalwood oil over collarbones so fragrance has a lipid base to hold.' },
      { verb: 'Pulse', slug: 'oud-mubakhar', note: 'Touch the glass dipstick of six-year-aged pure oud oil to the inside of each wrist.' },
      { verb: 'Mist', slug: 'nuit-doud', note: 'Mist Nuit d’Oud once from twenty centimetres away to complete the sillage.' },
    ],
  },
  {
    id: 'daytime_skin_scent',
    label: 'Close-to-skin rose & musk',
    icon: 'sun',
    headline: 'Intimate daytime scent and gleamed skin',
    summary:
      'For warm afternoons in Lagos or Abuja when you want skin that looks quietly luminous and smells of dewy rose and clean cotton.',
    steps: [
      { verb: 'Gleam', slug: 'huile-precieuse', note: 'Apply to damp skin after showering for a satin finish that never transfers to linen.' },
      { verb: 'Attar', slug: 'rose-taifi', note: 'Glide Rose Taïfi across the wrists for a bright, un-powdery Damask rose lift.' },
      { verb: 'Veil', slug: 'velours-blanc', note: 'Mist Velours Blanc onto the inside of your collar for a soft ambrette and rice-vapour trail.' },
    ],
  },
];

export interface DailyRitualStepDefinition {
  step: string;
  role: string;
  slug: string;
  description: string;
}

/** The four-step daily ritual shown on the home page. */
export const DAILY_RITUAL: DailyRitualStepDefinition[] = [
  {
    step: '01',
    role: 'Prepare & clarify',
    slug: 'serum-lumiere',
    description: 'Niacinamide and moringa leaf to smooth texture and soften hyperpigmentation.',
  },
  {
    step: '02',
    role: 'Nourish & veil',
    slug: 'huile-visage',
    description: 'Cold-pressed baobab and moringa absorb instantly to seal in moisture.',
  },
  {
    step: '03',
    role: 'Seal & restore',
    slug: 'creme-velours',
    description: 'Unrefined shea with plant ceramides calms and locks in overnight hydration.',
  },
  {
    step: '04',
    role: 'Scent & anchor',
    slug: 'oud-mubakhar',
    description: 'Six-year Assam agarwood on pulse points for a tranquil, intimate sillage.',
  },
];

export interface ResolvedRitualStep {
  product: Product;
  variant: ProductVariant;
}

/** Resolves ritual slugs to published products and their entry (first) variant; missing products are skipped. */
export function resolveRitualSteps<T extends { slug: string }>(
  steps: T[],
  products: Product[]
): Array<T & ResolvedRitualStep> {
  return steps.flatMap((step) => {
    const product = products.find((p) => p.slug === step.slug && p.is_published);
    const variant = product?.variants[0];
    return product && variant ? [{ ...step, product, variant }] : [];
  });
}

/** Total of the entry variants for a ritual, in kobo. */
export function getRitualTotalKobo(steps: Array<{ slug: string }>, products: Product[]): number {
  return resolveRitualSteps(steps, products).reduce((sum, s) => sum + s.variant.price_kobo, 0);
}
