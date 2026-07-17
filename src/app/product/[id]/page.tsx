import Link from 'next/link';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import ProductPageClient from './ProductPageClient';
import { fetchProductById, fetchProducts, mapProduct, type Product } from '@/lib/api';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let product: Product | null = null;
  let backendColors: { name: string, hex_code: string, image_url: string | null }[] = [];
  let relatedProducts: Product[] = [];

  try {
    const bp = await fetchProductById(id);
    if (bp) {
      product = mapProduct(bp);
      if (bp.colors && bp.colors.length > 0) {
        backendColors = bp.colors;
      }
      try {
        const allProducts = await fetchProducts(bp.category_slug || undefined);
        relatedProducts = allProducts.filter(p => product && p.id !== product.id).slice(0, 4);
      } catch (e) { }
    }
  } catch (e) {
    console.error("Failed to load product from backend", e);
  }

  if (!product) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div className="empty-state" style={{ paddingTop: 80 }}>
            <span className="material-symbols-outlined">inventory_2</span>
            <p style={{ fontWeight: 600, color: 'var(--on-surface)', fontSize: 18, marginTop: 12 }}>المنتج غير موجود</p>
            <Link href="/store" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>العودة للمتجر</Link>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <ProductPageClient 
        product={product} 
        backendColors={backendColors} 
        relatedProducts={relatedProducts} 
      />
      <BottomNav />
    </>
  );
}
