'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputBase from '@mui/material/InputBase';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useAuth } from '@/context/AuthContext';
import { useStoreData } from '@/context/StoreDataContext';
import { PLUM_BLUR_DATA_URL } from '@/data/seed-catalogue';
import {
  OrderStatus,
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
} from '@/types/domain';
import { formatKoboToNgn, koboToNaira, nairaToKobo } from '@/utils/currency';

type AdminTab = 'products' | 'orders' | 'low_stock' | 'settings';

const ORDER_STATUSES: OrderStatus[] = ['paid', 'packed', 'shipped', 'delivered'];

export default function AdminPage() {
  const { session, toggleAdminRole } = useAuth();
  const {
    products,
    upsertProduct,
    orders,
    updateOrderStatus,
    settings,
    updateSettings,
    resetCatalogueToSeed,
  } = useStoreData();

  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Settings form state in Naira
  const [freeThresholdNaira, setFreeThresholdNaira] = useState<number>(
    koboToNaira(settings.freeDeliveryThresholdKobo)
  );
  const [lagosAbujaNaira, setLagosAbujaNaira] = useState<number>(
    koboToNaira(settings.lagosAbujaRateKobo)
  );
  const [restOfNigeriaNaira, setRestOfNigeriaNaira] = useState<number>(
    koboToNaira(settings.restOfNigeriaRateKobo)
  );
  const [giftWrapNaira, setGiftWrapNaira] = useState<number>(
    koboToNaira(settings.giftWrapFeeKobo)
  );
  const [whatsappFlag, setWhatsappFlag] = useState<boolean>(
    settings.whatsappUpdatesEnabled
  );
  const [settingsSavedMsg, setSettingsSavedMsg] = useState<string>('');

  const lowStockEntries = useMemo(() => {
    const list: Array<{ product: Product; variant: ProductVariant }> = [];
    for (const product of products) {
      for (const variant of product.variants) {
        if (variant.stock <= settings.lowStockThreshold) {
          list.push({ product, variant });
        }
      }
    }
    return list.sort((a, b) => a.variant.stock - b.variant.stock);
  }, [products, settings.lowStockThreshold]);

  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === 'all') return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const inputBoxSx = {
    px: 2,
    py: 1,
    borderRadius: 1,
    border: 1,
    borderColor: 'divider',
    bgcolor: 'background.default',
    width: '100%',
    fontSize: '0.9375rem',
  };

  if (session?.role !== 'admin') {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" component="h1" sx={{ mb: 1.5 }}>
            Studio admin
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3.5, mx: 'auto' }}>
            This workspace is restricted to the zayneessence studio team. Activate admin
            access to manage catalogue photography, variants, orders and Nigerian
            delivery zones.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={toggleAdminRole}
            data-testid="unlock-admin-button"
          >
            Enter studio admin
          </Button>
        </Box>
      </Container>
    );
  }

  const handleOpenNewProduct = () => {
    const newId = `prod-${Date.now()}`;
    setEditingProduct({
      id: newId,
      slug: `new-piece-${Date.now().toString().slice(-4)}`,
      name: 'Nouvelle Pièce',
      category: 'Skincare',
      type: 'Botanical treatment',
      description:
        'Formulated in small batches with cold-pressed northern Nigerian shea, baobab and moringa.',
      notes: {
        top: '',
        heart: '',
        base: '',
      },
      ingredients: ['Unrefined northern Nigerian shea butter', 'Cold-pressed baobab oil'],
      how_to_use: 'Apply two to three drops onto damp skin morning and evening.',
      is_published: true,
      sort_order: products.length + 1,
      images: [
        {
          id: `img-${Date.now()}-1`,
          product_id: newId,
          url: '/products/serum-lumiere/1.svg',
          alt: 'Nouvelle Pièce front view on seamless lilac backdrop',
          position: 1,
          blurDataURL: PLUM_BLUR_DATA_URL,
        },
      ],
      variants: [
        {
          id: `var-${Date.now()}-1`,
          product_id: newId,
          label: '30 ml',
          price_kobo: 7500000,
          stock: 10,
          sku: `ZE-NEW-${Date.now().toString().slice(-3)}`,
        },
      ],
    });
  };

  const handleSaveProductModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const isFrag =
      editingProduct.category === 'Perfume' ||
      editingProduct.category === 'Oud' ||
      editingProduct.category === 'Roll-ons';

    const cleaned: Product = {
      ...editingProduct,
      notes: isFrag
        ? editingProduct.notes || { top: '', heart: '', base: '' }
        : editingProduct.notes?.top
          ? editingProduct.notes
          : null,
      images: editingProduct.images.map((img, i) => ({
        ...img,
        position: i + 1,
      })),
    };

    upsertProduct(cleaned);
    setEditingProduct(null);
  };

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    if (!editingProduct) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= editingProduct.images.length) return;
    const copy = [...editingProduct.images];
    const [moved] = copy.splice(index, 1);
    copy.splice(nextIndex, 0, moved);
    setEditingProduct({
      ...editingProduct,
      images: copy.map((img, idx) => ({ ...img, position: idx + 1 })),
    });
  };

  const handleUploadImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      const newImage: ProductImage = {
        id: `img-${Date.now()}`,
        product_id: editingProduct.id,
        url: dataUrl,
        alt: `${editingProduct.name} studio view ${editingProduct.images.length + 1}`,
        position: editingProduct.images.length + 1,
        blurDataURL: PLUM_BLUR_DATA_URL,
      };
      setEditingProduct({
        ...editingProduct,
        images: [...editingProduct.images, newImage],
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDeliverySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      ...settings,
      freeDeliveryThresholdKobo: nairaToKobo(freeThresholdNaira),
      lagosAbujaRateKobo: nairaToKobo(lagosAbujaNaira),
      restOfNigeriaRateKobo: nairaToKobo(restOfNigeriaNaira),
      giftWrapFeeKobo: nairaToKobo(giftWrapNaira),
      whatsappUpdatesEnabled: whatsappFlag,
    });
    setSettingsSavedMsg('Settings saved.');
    setTimeout(() => setSettingsSavedMsg(''), 2500);
  };

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
          <Typography variant="h2" component="h1" sx={{ mb: 0.5 }}>
            Studio admin
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Manage catalogue pieces, photography &amp; alt text, order fulfillment and
            Nigerian delivery rates.
          </Typography>
        </Box>

        <ToggleButtonGroup
          exclusive
          value={activeTab}
          onChange={(_e, next) => {
            if (next !== null) setActiveTab(next);
          }}
          aria-label="Admin sections"
        >
          <ToggleButton value="products" data-testid="admin-tab-products">
            Products ({products.length})
          </ToggleButton>
          <ToggleButton value="orders" data-testid="admin-tab-orders">
            Orders ({orders.length})
          </ToggleButton>
          <ToggleButton value="low_stock" data-testid="admin-tab-low-stock">
            Low stock ({lowStockEntries.length})
          </ToggleButton>
          <ToggleButton value="settings" data-testid="admin-tab-settings">
            Settings
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* TAB 1: PRODUCTS */}
      {activeTab === 'products' && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenNewProduct}
              data-testid="admin-add-product-button"
            >
              Add new product
            </Button>
            <Button variant="outlined" size="small" onClick={resetCatalogueToSeed}>
              Reset to seed catalogue
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {products.map((product) => (
              <Box
                key={product.id}
                sx={{
                  p: 2.5,
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={(t) => ({
                      position: 'relative',
                      width: 56,
                      aspectRatio: '4 / 5',
                      borderRadius: `${t.palette.zayne.tileRadius}px`,
                      bgcolor: t.palette.zayne.productTile,
                      overflow: 'hidden',
                    })}
                  >
                    {product.images[0] && (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        fill
                        sizes="56px"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4">{product.name}</Typography>
                      <Chip
                        size="small"
                        label={product.is_published ? 'Published' : 'Unpublished'}
                        color={product.is_published ? 'primary' : 'default'}
                        sx={{ height: 24, fontSize: '0.75rem' }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {product.category} · {product.type} · {product.images.length} photos ·{' '}
                      {product.variants
                        .map(
                          (v) =>
                            `${v.label}: ${formatKoboToNgn(v.price_kobo)} (${v.stock} in stock)`
                        )
                        .join(' / ')}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      upsertProduct({
                        ...product,
                        is_published: !product.is_published,
                      })
                    }
                  >
                    {product.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => setEditingProduct(product)}
                    data-testid={`admin-edit-${product.slug}`}
                  >
                    Edit piece
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* TAB 2: ORDERS */}
      {activeTab === 'orders' && (
        <Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {(['all', ...ORDER_STATUSES] as const).map((status) => (
              <Chip
                key={status}
                label={status === 'all' ? 'All orders' : status}
                clickable
                color={orderStatusFilter === status ? 'primary' : 'default'}
                onClick={() => setOrderStatusFilter(status)}
                sx={{ textTransform: 'capitalize' }}
              />
            ))}
          </Box>

          {filteredOrders.length === 0 ? (
            <Box
              sx={{
                p: 5,
                textAlign: 'center',
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                No orders match that filter yet.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {filteredOrders.map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    p: 3,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h4">
                        {order.orderNumber} · {order.customerName} (
                        {formatKoboToNgn(order.totalKobo)})
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {order.customerPhone} · {order.customerEmail} ·{' '}
                        {order.address.streetAddress}, {order.address.cityOrLga},{' '}
                        {order.address.state}
                      </Typography>
                    </Box>

                    {/* Status progression buttons (paid -> packed -> shipped -> delivered) */}
                    <ToggleButtonGroup
                      size="small"
                      exclusive
                      value={order.status}
                      onChange={(_e, nextStatus: OrderStatus | null) => {
                        if (nextStatus) {
                          updateOrderStatus(order.id, nextStatus);
                        }
                      }}
                      aria-label={`Update status for order ${order.orderNumber}`}
                    >
                      {ORDER_STATUSES.map((st) => (
                        <ToggleButton
                          key={st}
                          value={st}
                          data-testid={`order-${order.orderNumber}-status-${st}`}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {st}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1.5 }}>
                    Items:{' '}
                    {order.items
                      .map((i) => `${i.productName} (${i.sizeLabel}) × ${i.quantity}`)
                      .join(', ')}
                    {order.giftWrap ? ` · Gift wrap (${order.giftNote || 'No note'})` : ''}
                  </Typography>

                  {/* Dispatched Resend Email & WhatsApp Cloud API logs */}
                  {order.notifications.length > 0 && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        borderRadius: 1,
                        bgcolor: 'background.default',
                        border: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                        Dispatched Resend &amp; WhatsApp updates:
                      </Typography>
                      {order.notifications.map((log) => (
                        <Typography
                          key={log.id}
                          variant="caption"
                          sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}
                        >
                          • {log.message}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* TAB 3: LOW STOCK LIST */}
      {activeTab === 'low_stock' && (
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
            Variants at or below {settings.lowStockThreshold} units in the studio vault:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {lowStockEntries.map(({ product, variant }) => (
              <Box
                key={variant.id}
                sx={{
                  p: 2.5,
                  borderRadius: 1,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h4">
                    {product.name} — {variant.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    SKU: {variant.sku} · Remaining stock: {variant.stock} units
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    upsertProduct({
                      ...product,
                      variants: product.variants.map((v) =>
                        v.id === variant.id ? { ...v, stock: v.stock + 10 } : v
                      ),
                    });
                  }}
                >
                  Restock +10 units
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === 'settings' && (
        <Box
          component="form"
          onSubmit={handleSaveDeliverySettings}
          sx={{
            p: 3.5,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            maxWidth: 640,
          }}
        >
          <Typography variant="h3" sx={{ mb: 2.5, fontSize: '1.45rem' }}>
            Delivery rates and notifications
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: 'text.secondary' }}>
                Free-delivery threshold for Lagos &amp; Abuja (₦)
              </Typography>
              <InputBase
                type="number"
                value={freeThresholdNaira}
                onChange={(e) => setFreeThresholdNaira(Number(e.target.value) || 0)}
                sx={inputBoxSx}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: 'text.secondary' }}>
                Lagos and Abuja standard rate (1–2 days, ₦)
              </Typography>
              <InputBase
                type="number"
                value={lagosAbujaNaira}
                onChange={(e) => setLagosAbujaNaira(Number(e.target.value) || 0)}
                sx={inputBoxSx}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: 'text.secondary' }}>
                Rest of Nigeria flat rate (2–5 working days, ₦)
              </Typography>
              <InputBase
                type="number"
                value={restOfNigeriaNaira}
                onChange={(e) => setRestOfNigeriaNaira(Number(e.target.value) || 0)}
                sx={inputBoxSx}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={{ mb: 0.75, color: 'text.secondary' }}>
                Gift wrap fee (₦, set 0 for complimentary)
              </Typography>
              <InputBase
                type="number"
                value={giftWrapNaira}
                onChange={(e) => setGiftWrapNaira(Number(e.target.value) || 0)}
                sx={inputBoxSx}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 1,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 400 }}>
                  WhatsApp Business Cloud API updates
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Behind a feature flag so the store works with or without WhatsApp
                  credentials.
                </Typography>
              </Box>
              <Chip
                label={whatsappFlag ? 'Enabled' : 'Disabled'}
                clickable
                color={whatsappFlag ? 'primary' : 'default'}
                onClick={() => setWhatsappFlag((prev) => !prev)}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 1 }}>
              <Button type="submit" variant="contained" color="primary">
                Save settings
              </Button>
              {settingsSavedMsg && (
                <Typography variant="body2">{settingsSavedMsg}</Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* PRODUCT CREATE / EDIT DIALOG */}
      <Dialog
        open={Boolean(editingProduct)}
        onClose={() => setEditingProduct(null)}
        maxWidth="md"
        fullWidth
      >
        {editingProduct && (
          <DialogContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Box component="form" onSubmit={handleSaveProductModal}>
              <Typography variant="h3" sx={{ mb: 3 }}>
                Edit {editingProduct.name}
              </Typography>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    Product name
                  </Typography>
                  <InputBase
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                    sx={inputBoxSx}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    Category
                  </Typography>
                  <Box
                    component="select"
                    value={editingProduct.category}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value as ProductCategory,
                      })
                    }
                    sx={(theme) => ({
                      width: '100%',
                      height: 44,
                      px: 1.5,
                      borderRadius: '4px',
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: theme.palette.background.default,
                      color: theme.palette.text.primary,
                    })}
                  >
                    {(['Skincare', 'Perfume', 'Oud', 'Roll-ons', 'Oils'] as const).map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </Box>
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    Product type subtitle
                  </Typography>
                  <InputBase
                    value={editingProduct.type}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, type: e.target.value })
                    }
                    sx={inputBoxSx}
                  />
                </Box>

                <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    Sensory description (2–3 sentences)
                  </Typography>
                  <InputBase
                    multiline
                    rows={3}
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        description: e.target.value,
                      })
                    }
                    sx={inputBoxSx}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Photography upload, reordering & editable alt text */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                  }}
                >
                  <Typography variant="h4">
                    Photography &amp; alt text ({editingProduct.images.length})
                  </Typography>
                  <Button component="label" size="small" variant="outlined">
                    Upload photo
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleUploadImageFile}
                    />
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {editingProduct.images.map((img, idx) => (
                    <Box
                      key={img.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '48px 1fr auto',
                        gap: 1.5,
                        alignItems: 'center',
                        p: 1.5,
                        borderRadius: 1,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          width: 48,
                          aspectRatio: '4 / 5',
                          borderRadius: 1,
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          src={img.url}
                          alt={img.alt}
                          fill
                          sizes="48px"
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>

                      <Box>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.25 }}>
                          Alt text (Position {idx + 1})
                        </Typography>
                        <InputBase
                          value={img.alt}
                          onChange={(e) => {
                            const updatedImages = editingProduct.images.map((item, i) =>
                              i === idx ? { ...item, alt: e.target.value } : item
                            );
                            setEditingProduct({
                              ...editingProduct,
                              images: updatedImages,
                            });
                          }}
                          sx={inputBoxSx}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                          size="small"
                          aria-label="Move image up"
                          disabled={idx === 0}
                          onClick={() => handleMoveImage(idx, -1)}
                        >
                          <ArrowUpwardOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          aria-label="Move image down"
                          disabled={idx === editingProduct.images.length - 1}
                          onClick={() => handleMoveImage(idx, 1)}
                        >
                          <ArrowDownwardOutlinedIcon fontSize="small" />
                        </IconButton>
                        {editingProduct.images.length > 1 && (
                          <IconButton
                            size="small"
                            aria-label="Remove image"
                            onClick={() =>
                              setEditingProduct({
                                ...editingProduct,
                                images: editingProduct.images.filter((_, i) => i !== idx),
                              })
                            }
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Variants (size, price in Naira, stock) */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1.5,
                  }}
                >
                  <Typography variant="h4">Variants (size, price ₦, stock)</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      setEditingProduct({
                        ...editingProduct,
                        variants: [
                          ...editingProduct.variants,
                          {
                            id: `var-${Date.now()}`,
                            product_id: editingProduct.id,
                            label: '100 ml',
                            price_kobo: 12000000,
                            stock: 10,
                            sku: `ZE-VAR-${Date.now().toString().slice(-3)}`,
                          },
                        ],
                      })
                    }
                  >
                    Add size variant
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {editingProduct.variants.map((variant, vIdx) => (
                    <Box
                      key={variant.id}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: 1.5,
                      }}
                    >
                      <InputBase
                        value={variant.label}
                        placeholder="Size (e.g. 50 ml)"
                        onChange={(e) => {
                          const next = editingProduct.variants.map((v, i) =>
                            i === vIdx ? { ...v, label: e.target.value } : v
                          );
                          setEditingProduct({ ...editingProduct, variants: next });
                        }}
                        sx={inputBoxSx}
                      />
                      <InputBase
                        type="number"
                        value={koboToNaira(variant.price_kobo)}
                        placeholder="Price (₦)"
                        onChange={(e) => {
                          const next = editingProduct.variants.map((v, i) =>
                            i === vIdx
                              ? {
                                  ...v,
                                  price_kobo: nairaToKobo(Number(e.target.value) || 0),
                                }
                              : v
                          );
                          setEditingProduct({ ...editingProduct, variants: next });
                        }}
                        sx={inputBoxSx}
                      />
                      <InputBase
                        type="number"
                        value={variant.stock}
                        placeholder="Stock"
                        onChange={(e) => {
                          const next = editingProduct.variants.map((v, i) =>
                            i === vIdx
                              ? { ...v, stock: Math.max(0, Number(e.target.value) || 0) }
                              : v
                          );
                          setEditingProduct({ ...editingProduct, variants: next });
                        }}
                        sx={inputBoxSx}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                <Button variant="outlined" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  data-testid="save-product-modal-button"
                >
                  Save product
                </Button>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>
    </Container>
  );
}
