import fs from 'node:fs';
import path from 'node:path';

const PRODUCTS = [
  { slug: 'serum-lumiere', name: 'Sérum Lumière', subtitle: 'Brightening face serum', category: 'Skincare', vessel: 'dropper', volume: '30 ml' },
  { slug: 'creme-velours', name: 'Crème Velours', subtitle: 'Rich night cream', category: 'Skincare', vessel: 'jar', volume: '50 ml' },
  { slug: 'huile-visage', name: 'Huile Visage', subtitle: 'Nourishing face oil', category: 'Skincare', vessel: 'dropper', volume: '30 ml' },
  { slug: 'oud-mubakhar', name: 'Oud Mubakhar', subtitle: 'Pure oud oil · six years', category: 'Oud', vessel: 'tola', volume: '3 ml · 6 ml · 12 ml' },
  { slug: 'oud-malaki', name: 'Oud Malaki', subtitle: 'Oud and Taif rose oil', category: 'Oud', vessel: 'tola', volume: '3 ml · 6 ml' },
  { slug: 'nuit-doud', name: 'Nuit d’Oud', subtitle: 'Eau de parfum · woody', category: 'Perfume', vessel: 'flacon-dark', volume: '50 ml · 100 ml' },
  { slug: 'velours-blanc', name: 'Velours Blanc', subtitle: 'Eau de parfum · musk', category: 'Perfume', vessel: 'flacon-light', volume: '50 ml · 100 ml' },
  { slug: 'ambre-sacre', name: 'Ambre Sacré', subtitle: 'Attar roll-on · amber', category: 'Roll-ons', vessel: 'rollon', volume: '10 ml' },
  { slug: 'rose-taifi', name: 'Rose Taïfi', subtitle: 'Attar roll-on · rose', category: 'Roll-ons', vessel: 'rollon', volume: '10 ml' },
  { slug: 'musc-soie', name: 'Musc Soie', subtitle: 'Perfume oil roll-on', category: 'Roll-ons', vessel: 'rollon', volume: '10 ml' },
  { slug: 'huile-precieuse', name: 'Huile Précieuse', subtitle: 'Dry body oil', category: 'Oils', vessel: 'tall-oil', volume: '100 ml · 200 ml' },
  { slug: 'oud-et-santal', name: 'Oud & Santal', subtitle: 'Hair and body oil', category: 'Oils', vessel: 'tall-oil', volume: '100 ml' },
];

function renderVesselFront(p) {
  switch (p.vessel) {
    case 'jar':
      return `
        <!-- Floor shadow -->
        <ellipse cx="835" cy="1475" rx="310" ry="38" fill="#C9B9CE" opacity="0.55" />
        <!-- Heavy matte plum jar body -->
        <rect x="520" y="960" width="560" height="495" rx="44" fill="#3A2440" />
        <!-- Left side daylight highlight -->
        <rect x="536" y="972" width="110" height="470" rx="28" fill="#6E5677" opacity="0.38" />
        <!-- Jar neck & lid -->
        <rect x="555" y="930" width="490" height="36" fill="#2E1C33" />
        <rect x="515" y="810" width="570" height="128" rx="24" fill="#1E1022" />
        <rect x="532" y="822" width="120" height="104" rx="14" fill="#6E5677" opacity="0.28" />
        <!-- Editorial cream label -->
        <rect x="600" y="1065" width="400" height="275" rx="8" fill="#FBF9FC" />
        <text x="800" y="1145" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#1E1022">zayneessence</text>
        <line x1="680" y1="1175" x2="920" y2="1175" stroke="#E2D9E5" stroke-width="2" />
        <text x="800" y="1230" text-anchor="middle" font-family="Georgia, serif" font-size="40" fill="#1E1022">${p.name}</text>
        <text x="800" y="1275" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="22" fill="#6E5677">${p.subtitle}</text>
        <text x="800" y="1315" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="20" fill="#6E5677">${p.volume}</text>
      `;
    case 'tola':
      return `
        <!-- Floor shadow -->
        <ellipse cx="830" cy="1530" rx="235" ry="34" fill="#C9B9CE" opacity="0.55" />
        <!-- Cut-crystal tola base -->
        <polygon points="620,880 980,880 1020,1510 580,1510" fill="#2E1C33" />
        <!-- Inner aged oud resin glow -->
        <polygon points="650,920 950,920 980,1475 620,1475" fill="#3A2440" />
        <!-- Left crystal facet highlight -->
        <polygon points="620,880 715,880 695,1510 580,1510" fill="#B4A3BA" opacity="0.26" />
        <!-- Brass/plum collar & sculpted spire cap -->
        <rect x="720" y="760" width="160" height="120" rx="8" fill="#1E1022" />
        <path d="M745 760 L800 500 L855 760 Z" fill="#3A2440" />
        <circle cx="800" cy="495" r="24" fill="#1E1022" />
        <!-- Minimalist label -->
        <rect x="665" y="1060" width="270" height="310" rx="6" fill="#FBF9FC" />
        <text x="800" y="1140" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#1E1022">zayneessence</text>
        <line x1="705" y1="1170" x2="895" y2="1170" stroke="#E2D9E5" stroke-width="2" />
        <text x="800" y="1225" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="#1E1022">${p.name}</text>
        <text x="800" y="1270" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="20" fill="#6E5677">${p.subtitle}</text>
        <text x="800" y="1325" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="18" fill="#6E5677">${p.volume}</text>
      `;
    case 'flacon-dark':
    case 'flacon-light': {
      const isLight = p.vessel === 'flacon-light';
      const bottleFill = isLight ? '#D8CBE0' : '#241528';
      const archHighlight = isLight ? '#FBF9FC' : '#6E5677';
      return `
        <!-- Floor shadow -->
        <ellipse cx="835" cy="1535" rx="265" ry="36" fill="#C9B9CE" opacity="0.55" />
        <!-- Architectural perfume flacon -->
        <rect x="570" y="740" width="460" height="780" rx="28" fill="${bottleFill}" stroke="#3A2440" stroke-width="3" />
        <!-- Signature inner arch indentation on the glass -->
        <path d="M625 1470 V960 A175 175 0 0 1 975 960 V1470 Z" fill="${archHighlight}" opacity="${isLight ? '0.55' : '0.18'}" />
        <!-- Daylight edge highlight -->
        <rect x="588" y="760" width="64" height="740" rx="16" fill="#FBF9FC" opacity="0.32" />
        <!-- Atomizer neck & heavyweight cap -->
        <rect x="740" y="675" width="120" height="65" fill="#6E5677" />
        <rect x="705" y="510" width="190" height="168" rx="18" fill="#1E1022" />
        <!-- Label -->
        <rect x="650" y="1030" width="300" height="330" rx="6" fill="#FBF9FC" />
        <text x="800" y="1115" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#1E1022">zayneessence</text>
        <line x1="695" y1="1145" x2="905" y2="1145" stroke="#E2D9E5" stroke-width="2" />
        <text x="800" y="1208" text-anchor="middle" font-family="Georgia, serif" font-size="38" fill="#1E1022">${p.name}</text>
        <text x="800" y="1255" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="21" fill="#6E5677">${p.subtitle}</text>
        <text x="800" y="1312" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="19" fill="#6E5677">${p.volume}</text>
      `;
    }
    case 'rollon':
      return `
        <!-- Floor shadow -->
        <ellipse cx="825" cy="1545" rx="170" ry="28" fill="#C9B9CE" opacity="0.52" />
        <!-- Slender attar roll-on glass cylinder -->
        <rect x="680" y="760" width="240" height="770" rx="22" fill="#3A2440" />
        <rect x="694" y="775" width="48" height="740" rx="12" fill="#B4A3BA" opacity="0.28" />
        <!-- Tall cylindrical cap -->
        <rect x="684" y="470" width="232" height="285" rx="18" fill="#1E1022" />
        <line x1="680" y1="758" x2="920" y2="758" stroke="#E2D9E5" stroke-width="3" />
        <!-- Vertical minimalist label -->
        <rect x="708" y="920" width="184" height="440" rx="6" fill="#FBF9FC" />
        <text x="800" y="1020" text-anchor="middle" font-family="Georgia, serif" font-size="24" fill="#1E1022">zayneessence</text>
        <line x1="735" y1="1050" x2="865" y2="1050" stroke="#E2D9E5" stroke-width="1.5" />
        <text x="800" y="1125" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#1E1022">${p.name}</text>
        <text x="800" y="1175" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="18" fill="#6E5677">${p.subtitle}</text>
        <text x="800" y="1295" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="18" fill="#6E5677">${p.volume}</text>
      `;
    case 'tall-oil':
      return `
        <!-- Floor shadow -->
        <ellipse cx="830" cy="1545" rx="240" ry="34" fill="#C9B9CE" opacity="0.55" />
        <!-- Tall apothecary body oil bottle -->
        <path d="M610 830 C610 760 680 720 730 700 L870 700 C920 720 990 760 990 830 L990 1500 C990 1520 974 1535 955 1535 L645 1535 C626 1535 610 1520 610 1500 Z" fill="#3A2440" />
        <rect x="630" y="810" width="70" height="695" rx="22" fill="#B4A3BA" opacity="0.25" />
        <!-- Neck & cap -->
        <rect x="735" y="610" width="130" height="90" fill="#2E1C33" />
        <rect x="720" y="485" width="160" height="130" rx="16" fill="#1E1022" />
        <!-- Label -->
        <rect x="655" y="965" width="290" height="390" rx="8" fill="#FBF9FC" />
        <text x="800" y="1065" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#1E1022">zayneessence</text>
        <line x1="700" y1="1098" x2="900" y2="1098" stroke="#E2D9E5" stroke-width="2" />
        <text x="800" y="1165" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="#1E1022">${p.name}</text>
        <text x="800" y="1215" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="21" fill="#6E5677">${p.subtitle}</text>
        <text x="800" y="1295" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="19" fill="#6E5677">${p.volume}</text>
      `;
    case 'dropper':
    default:
      return `
        <!-- Floor shadow -->
        <ellipse cx="830" cy="1535" rx="235" ry="34" fill="#C9B9CE" opacity="0.55" />
        <!-- Smoked plum glass dropper bottle -->
        <path d="M600 880 C600 800 675 760 725 735 L875 735 C925 760 1000 800 1000 880 L1000 1495 C1000 1518 982 1535 960 1535 L640 1535 C618 1535 600 1518 600 1495 Z" fill="#3A2440" />
        <!-- Left daylight reflection -->
        <rect x="622" y="860" width="76" height="640" rx="24" fill="#B4A3BA" opacity="0.28" />
        <!-- Dropper collar & rubber bulb -->
        <rect x="715" y="645" width="170" height="92" rx="10" fill="#1E1022" />
        <path d="M740 645 L740 500 C740 445 860 445 860 500 L860 645 Z" fill="#2E1C33" />
        <!-- Arch-shaped label -->
        <path d="M655 1425 V1050 A145 145 0 0 1 945 1050 V1425 Z" fill="#FBF9FC" />
        <text x="800" y="1135" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="#1E1022">zayneessence</text>
        <line x1="705" y1="1165" x2="895" y2="1165" stroke="#E2D9E5" stroke-width="2" />
        <text x="800" y="1225" text-anchor="middle" font-family="Georgia, serif" font-size="36" fill="#1E1022">${p.name}</text>
        <text x="800" y="1272" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="20" fill="#6E5677">${p.subtitle}</text>
        <text x="800" y="1340" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="19" fill="#6E5677">${p.volume}</text>
      `;
  }
}

function renderDetailView(p) {
  return `
    <!-- Arched architectural studio niche -->
    <path d="M360 1720 V740 A440 440 0 0 1 1240 740 V1720 Z" fill="#E1D5E5" />
    <!-- Macro glass applicator / neck study -->
    <rect x="755" y="280" width="90" height="680" rx="45" fill="#3A2440" opacity="0.88" />
    <rect x="770" y="300" width="24" height="640" rx="12" fill="#FBF9FC" opacity="0.45" />
    <!-- Suspended botanical droplet -->
    <path d="M800 995 C800 995 885 1110 885 1170 A85 85 0 1 1 715 1170 C715 1110 800 995 800 995 Z" fill="#6E5677" />
    <ellipse cx="775" cy="1155" rx="22" ry="36" fill="#FBF9FC" opacity="0.55" />
    <!-- Concentric ripple on stone plinth -->
    <ellipse cx="800" cy="1440" rx="290" ry="52" fill="none" stroke="#6E5677" stroke-width="3" opacity="0.45" />
    <ellipse cx="800" cy="1440" rx="175" ry="30" fill="#3A2440" opacity="0.18" />
    <text x="800" y="1615" text-anchor="middle" font-family="Georgia, serif" font-size="38" fill="#1E1022">${p.name} — Atelier detail</text>
    <text x="800" y="1665" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="22" fill="#6E5677">${p.subtitle}</text>
  `;
}

function renderTextureView(p) {
  return `
    <!-- Stone plinth surface -->
    <rect x="280" y="360" width="1040" height="1280" rx="24" fill="#E1D5E5" />
    <!-- Sculptural botanical texture swipe -->
    <path d="M470 1120 C560 760 920 680 1090 890 C1210 1040 1020 1310 760 1290 C540 1275 420 1260 470 1120 Z" fill="#3A2440" opacity="0.85" />
    <path d="M540 1085 C620 830 895 770 1015 920 C1100 1030 960 1220 755 1205" fill="none" stroke="#FBF9FC" stroke-width="18" stroke-linecap="round" opacity="0.42" />
    <circle cx="1075" cy="720" r="46" fill="#6E5677" opacity="0.65" />
    <circle cx="1155" cy="805" r="24" fill="#3A2440" opacity="0.55" />
    <text x="800" y="1495" text-anchor="middle" font-family="Georgia, serif" font-size="38" fill="#1E1022">${p.name} — Sensory study</text>
    <text x="800" y="1548" text-anchor="middle" font-family="sans-serif" font-weight="300" font-size="22" fill="#6E5677">Nigerian botanicals &amp; aged resins · zayneessence</text>
  `;
}

function wrapStudioSvg(innerMarkup) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 2000" width="1600" height="2000">
  <defs>
    <!-- Soft daylight from the left side on seamless lilac/grey backdrop -->
    <linearGradient id="studioDaylight" x1="0%" y1="15%" x2="100%" y2="85%">
      <stop offset="0%" stop-color="#F6F3F7" />
      <stop offset="52%" stop-color="#ECE4EF" />
      <stop offset="100%" stop-color="#E1D5E5" />
    </linearGradient>
    <linearGradient id="floorHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E1D5E5" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#D5C6DB" stop-opacity="0.75" />
    </linearGradient>
  </defs>
  <!-- Seamless studio backdrop -->
  <rect width="1600" height="2000" fill="url(#studioDaylight)" />
  <!-- Gentle studio table horizon -->
  <rect x="0" y="1420" width="1600" height="580" fill="url(#floorHorizon)" />
  ${innerMarkup}
</svg>
`;
}

const outRoot = path.resolve(process.cwd(), 'apps/web/public/products');

for (const product of PRODUCTS) {
  const dir = path.join(outRoot, product.slug);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(path.join(dir, '1.svg'), wrapStudioSvg(renderVesselFront(product)), 'utf8');
  fs.writeFileSync(path.join(dir, '2.svg'), wrapStudioSvg(renderDetailView(product)), 'utf8');
  fs.writeFileSync(path.join(dir, '3.svg'), wrapStudioSvg(renderTextureView(product)), 'utf8');
}

console.log(`Generated ${PRODUCTS.length * 3} studio 4:5 (1600x2000) product images.`);
