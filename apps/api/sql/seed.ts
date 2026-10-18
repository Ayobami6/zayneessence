import fs from 'node:fs';
import path from 'node:path';
import { SEED_PRODUCTS, DEFAULT_STORE_SETTINGS } from '../../web/src/data/seed-catalogue';

function escapeSql(val: string): string {
  return val.replace(/'/g, "''");
}

function buildSeedSql(): string {
  const lines: string[] = [
    '-- Auto-generated seed script for zayneessence catalogue (12 products, 36 images, variants, and Nigerian delivery zones)',
    'BEGIN;',
    '',
    '-- Delivery zones',
    `INSERT INTO delivery_zones (id, name, states, eta_description, flat_rate_kobo, free_over_kobo) VALUES`,
    `  ('lagos_abuja', 'Lagos and Abuja', ARRAY['Lagos', 'Federal Capital Territory (Abuja)'], '1–2 days', ${DEFAULT_STORE_SETTINGS.lagosAbujaRateKobo}, ${DEFAULT_STORE_SETTINGS.freeDeliveryThresholdKobo}),`,
    `  ('rest_of_nigeria', 'Rest of Nigeria', ARRAY['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'], '2–5 working days', ${DEFAULT_STORE_SETTINGS.restOfNigeriaRateKobo}, NULL),`,
    `  ('store_pickup', 'Store pickup', ARRAY['Lagos', 'Federal Capital Territory (Abuja)'], 'Same-day studio pickup', 0, 0)`,
    'ON CONFLICT (id) DO UPDATE SET flat_rate_kobo = EXCLUDED.flat_rate_kobo, free_over_kobo = EXCLUDED.free_over_kobo;',
    '',
  ];

  for (const product of SEED_PRODUCTS) {
    const notesJson = product.notes
      ? `'${escapeSql(JSON.stringify(product.notes))}'::jsonb`
      : 'NULL';
    const ingredientsJson = product.ingredients
      ? `'${escapeSql(JSON.stringify(product.ingredients))}'::jsonb`
      : 'NULL';

    lines.push(
      `INSERT INTO products (id, slug, name, category, type, description, notes, ingredients, how_to_use, is_published, sort_order) VALUES (` +
        `'${escapeSql(product.id)}', '${escapeSql(product.slug)}', '${escapeSql(product.name)}', '${escapeSql(product.category)}', '${escapeSql(product.type)}', '${escapeSql(product.description)}', ${notesJson}, ${ingredientsJson}, '${escapeSql(product.how_to_use)}', ${product.is_published}, ${product.sort_order}` +
        `) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, notes = EXCLUDED.notes, ingredients = EXCLUDED.ingredients, how_to_use = EXCLUDED.how_to_use;`
    );

    for (const img of product.images) {
      lines.push(
        `INSERT INTO product_images (id, product_id, url, alt, position) VALUES (` +
          `'${escapeSql(img.id)}', '${escapeSql(img.product_id)}', '${escapeSql(img.url)}', '${escapeSql(img.alt)}', ${img.position}` +
          `) ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url, alt = EXCLUDED.alt, position = EXCLUDED.position;`
      );
    }

    for (const variant of product.variants) {
      lines.push(
        `INSERT INTO variants (id, product_id, label, price_kobo, stock, sku) VALUES (` +
          `'${escapeSql(variant.id)}', '${escapeSql(variant.product_id)}', '${escapeSql(variant.label)}', ${variant.price_kobo}, ${variant.stock}, '${escapeSql(variant.sku)}'` +
          `) ON CONFLICT (id) DO UPDATE SET price_kobo = EXCLUDED.price_kobo, stock = EXCLUDED.stock;`
      );
    }

    lines.push('');
  }

  lines.push('COMMIT;');
  return lines.join('\n');
}

const outPath = path.resolve(process.cwd(), 'apps/api/sql/seed.sql');
const sqlContent = buildSeedSql();
fs.writeFileSync(outPath, sqlContent, 'utf8');

console.log(
  `Seeded ${SEED_PRODUCTS.length} luxury products (${SEED_PRODUCTS.reduce(
    (acc, p) => acc + p.variants.length,
    0
  )} variants, ${SEED_PRODUCTS.reduce(
    (acc, p) => acc + p.images.length,
    0
  )} images) to apps/api/sql/seed.sql`
);
