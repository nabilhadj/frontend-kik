'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/api';

const CATEGORY_MAPPING: Record<string, string[]> = {
  "kfrat": ["coque", "etui", "protection", "كفرات"],
  "shohn": ["chargeur", "alimentation", "qi", "magsafe", "powerbank", "batterie", "شواحن"],
  "smaat": ["casque", "ecouteur", "baffle", "enceinte", "tws", "سماعات"],
  "kbl": ["cable", "cordon", "كوابل"],
  "hmy": ["protection", "ecran", "vitre", "حماية"],
  "akssort": ["accessoire", "support", "stand", "tapis", "souris", "clavier", "إكسسوارات"],
};

function Toast({ message }: { message: string }) {
  return (
    <div className="toast" style={{ animation: 'slideUp 0.3s ease' }}>
      <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginLeft: 6 }}>check_circle</span>
      {message}
    </div>
  );
}

type CategoryType = { name: string, slug: string, icon?: string | null };

type Props = {
  initialProducts: Product[];
  initialCategories: CategoryType[];
};

export default function HomePageClient({ initialProducts, initialCategories }: Props) {
  const [activeCategorySlug, setActiveCategorySlug] = useState('all');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const filtered = activeCategorySlug === 'all'
    ? initialProducts
    : initialProducts.filter(p => {
      if (p.categorySlug === activeCategorySlug) return true;
      const mappedKeywords = CATEGORY_MAPPING[activeCategorySlug];
      if (mappedKeywords) {
        const catNameLower = (p.category || '').toLowerCase();
        const catSlugLower = (p.categorySlug || '').toLowerCase();
        return mappedKeywords.some(keyword =>
          catNameLower.includes(keyword) || catSlugLower.includes(keyword)
        );
      }
      return false;
    });

  const bestSellers = initialProducts.slice(0, 4);

  const activeCategoryObj = initialCategories.find(c => c.slug === activeCategorySlug);
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.name : '';

  return (
    <>
      {toast && <Toast message={toast} />}

      <main className="page-wrapper">

        {/* ===== HERO ===== */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_awesome</span>
              أحدث منتجات التقنية
            </div>
            <h1>كل ما تحتاجه لجهازك في مكان واحد</h1>
            <p>سماعات، شواحن، كابلات وإكسسوارات إلكترونية أصلية، بأسعار تنافسية وتوصيل سريع إلى جميع ولايات الجزائر.</p>
            <a href="/store" className="hero-btn">
              تسوق الآن
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            </a>
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        <div className="categories-strip">
          {initialCategories.map(cat => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.slug}
                className={`category-chip ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCategorySlug(cat.slug)}
              >
                {cat.icon && /^[a-z0-9_]+$/i.test(cat.icon) && (
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    {cat.icon}
                  </span>
                )}
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* ===== BEST SELLERS ===== */}
        {activeCategorySlug === 'all' && (
          <section className="section">
            <div className="section-header">
              <div>
                <div className="section-title">الأكثر مبيعاً</div>
              </div>
              <a href="/store" className="view-all-btn">
                عرض الكل
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
              </a>
            </div>
            <div className="products-grid">
              {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} showToast={showToast} priority={i < 2} />)}
            </div>
          </section>
        )}

        {/* ===== FILTERED PRODUCTS ===== */}
        {activeCategorySlug !== 'all' && (
          <section className="section">
            <div className="section-header">
              <div>
                <div className="section-title">{activeCategoryName}</div>
                <div className="section-subtitle">{filtered.length} منتج متوفر</div>
              </div>
            </div>
            {filtered.length > 0 ? (
              <div className="products-grid">
                {filtered.map((p, i) => <ProductCard key={p.id} product={p} showToast={showToast} priority={i < 2} />)}
              </div>
            ) : (
              <div className="empty-state">
                <span className="material-symbols-outlined">inventory_2</span>
                <p style={{ color: 'var(--on-surface-variant)' }}>لا توجد منتجات في هذه الفئة حالياً</p>
              </div>
            )}
          </section>
        )}

        {/* ===== PROMO SECTION ===== */}
        {activeCategorySlug === 'all' && (
          <section className="section">
            <div className="promo-grid">
              <div className="promo-side">
                <div className="promo-side-card" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}>
                  <div>
                    <div style={{ fontSize: 23, fontWeight: 800, color: '#f97316', marginBottom: 4 }}>  هدايا  🎁</div>
                    <div style={{ fontFamily: 'Be Vietnam Pro', fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>كل عملية شراء تزيد رصيدك! وعندما يصل إجمالي مشترياتك إلى <br /> 10,000 دج، يمكنك استلام هديتك المجانية في حسابنا علي <a href="https://instagram.com/klik_dzd/" style={{ color: 'red' }}>Instagram </a>  <a href="https://instagram.com/klik_dzd/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E1306C', color: 'white', textDecoration: 'none' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
                    </a></div>
                  </div>
                </div>
                <div className="promo-side-card" style={{ background: 'rgba(0,74,198,0.1)', border: '1px solid rgba(0,74,198,0.2)' }}>
                  <div>
                    <div style={{ fontSize: 23, fontWeight: 800, color: 'var(--primary)', marginBottom: 4 }}> الضمان 🛡 </div>
                    <div style={{ fontFamily: 'Be Vietnam Pro', fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}> جميع المنتجات التي يتم شراؤها من متجرنا تستفيد من ضمان استبدال لمدة 48 ساعة ابتداءً من تاريخ استلام الطلب.</div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== ALL PRODUCTS ===== */}
        {activeCategorySlug === 'all' && (
          <section className="section">
            <div className="section-header">
              <div>
                <div className="section-title">جميع المنتجات</div>
                <div className="section-subtitle">{initialProducts.length} منتج متوفر</div>
              </div>
            </div>
            <div className="products-grid">
              {initialProducts.map((p, i) => <ProductCard key={p.id} product={p} showToast={showToast} priority={i < 4} />)}
            </div>
          </section>
        )}

        {/* ===== SOCIAL MEDIA ===== */}
        <div className="newsletter" style={{ textAlign: 'center' }}>
          <div className="section-title">تابعنا على منصات التواصل</div>
          <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 6, marginBottom: 16 }}>
            ابق على اطلاع بآخر العروض والمنتجات عبر حساباتنا.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <a href="https://instagram.com/klik_dzd/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#E1306C', color: 'white', textDecoration: 'none' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.181a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
            </a>
            <a href="https://www.tiktok.com/@klik_dzd" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#000000', color: 'white', textDecoration: 'none' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.61.94-5.26 3.01-6.77 1.25-.91 2.82-1.38 4.38-1.33.02 1.36.01 2.73.01 4.09-.76-.08-1.55-.03-2.26.31-1.08.52-1.87 1.53-2.04 2.71-.14.93.07 1.9.62 2.67.75 1.05 2.11 1.55 3.4 1.29 1.25-.25 2.21-1.22 2.5-2.45.14-.6.12-1.22.12-1.83V.02z" /></svg>
            </a>
            <a href="https://www.facebook.com/profile.php?id=61577847343429" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1877F2', color: 'white', textDecoration: 'none' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
          </div>
        </div>

      </main>
    </>
  );
}
