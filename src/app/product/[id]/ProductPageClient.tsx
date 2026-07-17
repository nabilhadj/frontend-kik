'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/lib/CartContext';
import { API_BASE_URL } from '@/lib/api';
import type { Product } from '@/lib/api';
import Image from 'next/image';

function Toast({ message }: { message: string }) {
  return (
    <div className="toast">
      <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginLeft: 6 }}>check_circle</span>
      {message}
    </div>
  );
}

type Props = {
  product: Product;
  backendColors: { name: string, hex_code: string, image_url: string | null }[];
  relatedProducts: Product[];
};

export default function ProductPageClient({ product, backendColors, relatedProducts }: Props) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selectedColor, setSelectedColor] = useState(backendColors.length > 0 ? backendColors[0].name : '');
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (backendColors.length > 0 && selectedColor) {
      const col = backendColors.find(c => c.name === selectedColor);
      if (col && col.image_url) {
        let img = col.image_url;
        if (!img.startsWith('http') && !img.startsWith('//')) {
          img = `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
        }
        setActiveImage(img);
        return;
      }
    }
    setActiveImage(product.images && product.images.length > 0 ? product.images[0] : product.image);
  }, [selectedColor, backendColors, product.image, product.images]);

  const currentImage = activeImage || (product.images && product.images.length > 0 ? product.images[0] : product.image);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addItem(product, selectedColor);
    showToast(`تمت الإضافة للسلة (${qty} قطعة)`);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < qty; i++) addItem(product, selectedColor);
    router.push('/cart');
  };

  return (
    <>
      {toast && <Toast message={toast} />}
      <main className="page-wrapper">

        {/* Back Button */}
        <div style={{ padding: '12px var(--margin-mobile)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            رجوع
          </button>
          <span style={{ color: 'var(--outline-variant)', fontSize: 18 }}>|</span>
        </div>

        <div className="lg:flex lg:gap-12 lg:items-start lg:mt-6">
          {/* Product Image */}
          <div className="product-detail-image-container lg:flex-1 lg:max-w-[50%]" style={{ margin: '0 var(--margin-mobile)' }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', minHeight: 300, aspectRatio: '1/1', width: '100%' }}>
              {product.badge && <span className="product-badge" style={{ top: 12, right: 12, fontSize: 12, padding: '4px 12px', zIndex: 10 }}>{product.badge}</span>}
              {currentImage ? (
                <Image 
                  src={currentImage} 
                  alt={product.name} 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }} 
                  priority
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-low)', position: 'absolute', inset: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 64, color: 'var(--outline-variant)' }}>image</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 16, overflowX: 'auto', paddingBottom: 8 }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    style={{
                      width: 70, height: 70, flexShrink: 0, borderRadius: 12, overflow: 'hidden', position: 'relative',
                      border: `2px solid ${activeImage === img ? 'var(--primary)' : 'transparent'}`,
                      background: 'var(--surface-container-low)', cursor: 'pointer', padding: 0
                    }}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill sizes="70px" style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-detail-body lg:flex-1">
            <h1 style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1.35, marginBottom: 12 }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="product-rating">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className="material-symbols-outlined star" style={{ fontSize: 18, color: s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db', fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>{product.rating}</span>
              <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>({product.reviews} تقييم)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--primary)' }}>{product.price} د.ج</span>
              {product.oldPrice && (
                <span style={{ fontSize: 16, color: 'var(--on-surface-variant)', textDecoration: 'line-through' }}>{product.oldPrice} د.ج</span>
              )}
              {product.oldPrice && (
                <span style={{ background: 'var(--error-container)', color: 'var(--error)', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 99 }}>
                  وفر {product.oldPrice - product.price} د.ج
                </span>
              )}
            </div>

            {/* Colors */}
            {((backendColors.length > 0 ? backendColors : product.colors) || []).length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: 8 }}>اللون</p>
                <div className="color-swatches">
                  {backendColors.length > 0 ? (
                    backendColors.map(color => (
                      <button
                        key={color.name}
                        className={`swatch ${selectedColor === color.name ? 'active' : ''}`}
                        style={{ background: color.hex_code || '#777' }}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                      />
                    ))
                  ) : (
                    product.colors?.map(color => (
                      <button
                        key={color}
                        className={`swatch ${selectedColor === color ? 'active' : ''}`}
                        style={{ background: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: 8 }}>الكمية</p>
              <div className="qty-selector">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={{ fontSize: 16, fontWeight: 700, minWidth: 30, textAlign: 'center' }}>{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Description */}
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>وصف المنتج</p>
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>{product.description}</p>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 10 }}>المميزات</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {product.features?.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, position: 'sticky', bottom: 80, background: 'white', padding: '12px 0', borderTop: '1px solid rgba(195,198,215,0.3)', marginTop: 8, zIndex: 10 }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, height: 52, borderRadius: 14, background: 'var(--surface-container)', color: 'var(--on-surface)',
                  fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s'
                }}
              >
                أضف للسلة
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  flex: 1, height: 52, borderRadius: 14, background: 'var(--primary)', color: 'white',
                  fontFamily: 'inherit', fontSize: 15, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s'
                }}
              >
                اشتر الآن
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div className="section-header">
              <div className="section-title">منتجات مشابهة</div>
            </div>
            <div className="products-grid">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} showToast={msg => showToast(msg)} />)}
            </div>
          </div>
        )}

      </main>
    </>
  );
}
