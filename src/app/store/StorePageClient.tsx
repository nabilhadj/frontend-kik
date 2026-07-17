'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import type { Product } from '@/lib/api';
import { useSearchParams, useRouter } from 'next/navigation';

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
    <div className="toast">
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

export default function StorePageClient({ initialProducts, initialCategories }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialCat = searchParams.get('cat') || 'all';
  
  const [activeCategorySlug, setActiveCategorySlug] = useState(initialCat);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  // Sync category if URL changes (optional, but good for back/forward navigation)
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setActiveCategorySlug(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (slug: string) => {
    setActiveCategorySlug(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === 'all') {
      params.delete('cat');
    } else {
      params.set('cat', slug);
    }
    // Update URL without a full page reload to maintain client state
    router.replace(`/store?${params.toString()}`, { scroll: false });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const filtered = initialProducts.filter(p => {
    // Category match
    let matchCat = activeCategorySlug === 'all' || p.categorySlug === activeCategorySlug;
    if (!matchCat && activeCategorySlug !== 'all') {
      const mappedKeywords = CATEGORY_MAPPING[activeCategorySlug];
      if (mappedKeywords) {
        const catNameLower = (p.category || '').toLowerCase();
        const catSlugLower = (p.categorySlug || '').toLowerCase();
        matchCat = mappedKeywords.some(keyword => 
          catNameLower.includes(keyword) || catSlugLower.includes(keyword)
        );
      }
    }

    // Search match
    const searchLower = search.toLowerCase();
    const matchSearch = search === '' || 
      p.name.toLowerCase().includes(searchLower) || 
      p.category.toLowerCase().includes(searchLower);

    return matchCat && matchSearch;
  });

  return (
    <>
      {toast && <Toast message={toast} />}
      <main className="page-wrapper">

        {/* Search */}
        <div className="search-bar">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="categories-strip">
          {initialCategories.map(cat => {
            const isActive = activeCategorySlug === cat.slug;
            return (
              <button
                key={cat.slug}
                className={`category-chip ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.slug)}
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

        {/* Results header */}
        <div style={{ padding: '0 var(--margin-mobile)', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>{filtered.length} منتج</span>
          {search && <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600 }}>نتائج: "{search}"</span>}
        </div>

        {/* Products */}
        {filtered.length > 0 ? (
          <div className="products-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} showToast={showToast} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span className="material-symbols-outlined">search_off</span>
            <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--on-surface)', marginTop: 12 }}>لا توجد نتائج</p>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 4 }}>جرب كلمة بحث مختلفة أو فئة أخرى</p>
          </div>
        )}

      </main>
    </>
  );
}
