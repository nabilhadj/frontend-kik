import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import StorePageClient from './StorePageClient';
import { fetchProducts, fetchCategories, type Product } from '@/lib/api';
import { Suspense } from 'react';

// Wrap the client component in Suspense since it uses useSearchParams
export default async function StorePage() {
  let products: Product[] = [];
  let categories = [
    { name: 'الكل', slug: 'all', icon: 'grid_view' }
  ];

  try {
    const fetchedProducts = await fetchProducts();
    if (fetchedProducts && fetchedProducts.length > 0) {
      products = fetchedProducts;
    }

    const categoriesData = await fetchCategories();
    if (categoriesData && categoriesData.length > 0) {
      categories = [
        { name: 'الكل', slug: 'all', icon: 'grid_view' },
        ...categoriesData.map(c => ({
          name: c.name,
          slug: c.slug,
          icon: c.icon || 'star'
        }))
      ];
    }
  } catch (e) {
    console.error("Failed to load products/categories from backend", e);
  }

  return (
    <>
      <Header />
      <Suspense fallback={<main className="page-wrapper"><div className="empty-state"><span className="material-symbols-outlined" style={{ animation: 'spin 1.5s linear infinite' }}>sync</span></div></main>}>
        <StorePageClient 
          initialProducts={products} 
          initialCategories={categories} 
        />
      </Suspense>
      <BottomNav />
    </>
  );
}
