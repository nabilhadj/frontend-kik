import { fetchProductById, mapProduct, fetchLandingPage } from '@/lib/api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';

import LPTimer from './components/LPTimer';
import LPFloatingActions from './components/LPFloatingActions';
import LPCheckoutWrapper from './components/LPCheckoutWrapper';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lpConfig = await fetchLandingPage(id);
  if (!lpConfig) {
    return {
      title: 'العرض غير موجود',
    };
  }
  const product = mapProduct(lpConfig.product_details);
  return {
    title: `${product.name} - أفضل عرض`,
    description: product.description,
  };
}

export default async function LandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lpConfig = await fetchLandingPage(id);
  
  if (!lpConfig) {
    notFound();
  }

  const product = mapProduct(lpConfig.product_details);
  const themeColor = lpConfig?.theme_color || '#e11d48';
  
  const WHATSAPP_NUMBER = lpConfig.whatsapp_number || "213500000000";
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن منتج: ${product.name}`)}`;

  const savingsPercent = (lpConfig.old_price || product.oldPrice) && Number(lpConfig.old_price || product.oldPrice) > Number(product.price) 
    ? Math.round(((Number(lpConfig.old_price || product.oldPrice) - Number(product.price)) / Number(lpConfig.old_price || product.oldPrice)) * 100)
    : 0;

  return (
    <main className="lp-container" style={{ minHeight: '100vh', background: '#ffffff', direction: 'rtl', paddingBottom: 100, '--primary': themeColor } as React.CSSProperties}>
      
      {/* Hero Section */}
      <section style={{ width: '100%', maxWidth: 600, margin: '0 auto', position: 'relative' }}>
        <div style={{ width: '100%', backgroundColor: '#f8fafc', overflow: 'hidden' }}>
          {lpConfig.main_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lpConfig.main_image_url}
              alt={product.name}
              fetchPriority="high"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          ) : (
            <div style={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#94a3b8' }}>image</span>
            </div>
          )}

          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, background: 'rgba(255,255,255,0.9)', borderRadius: 22, color: 'var(--on-surface)', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)' }}>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div style={{ padding: '24px 20px', borderBottom: '1px solid #e2e8f0' }}>
          {/* Top row: Stars & Timer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', color: '#f59e0b', fontSize: 18 }}>
                {'★'.repeat(5)}
              </div>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>(4.9/5)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: 10, fontSize: 14, fontWeight: 700, direction: 'ltr' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>timer</span>
              <LPTimer />
            </div>
          </div>

          {/* Bottom row: Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: themeColor, lineHeight: 1 }}>
                {product.price} <span style={{ fontSize: 20, fontWeight: 700 }}>د.ج</span>
              </div>
            </div>

            {(lpConfig.old_price || product.oldPrice) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>السعر السابق</div>
                <div style={{ fontSize: 18, color: '#94a3b8', textDecoration: 'line-through', fontWeight: 700, lineHeight: 1 }}>
                  {lpConfig.old_price || product.oldPrice} د.ج
                </div>
                {savingsPercent > 0 && (
                  <div style={{ background: '#10b981', color: 'white', fontSize: 12, fontWeight: 800, padding: '4px 8px', borderRadius: 6, marginTop: 8 }}>
                    توفير {savingsPercent}%
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        
        {/* Checkout Form Section wrapper */}
        <section style={{ padding: '24px 16px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <LPCheckoutWrapper product={product} config={lpConfig} />
        </section>

        {/* Trust Badges */}
        <section style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '24px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#eab308', marginBottom: 8, fontVariationSettings: "'FILL' 1" }}>verified</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>جودة مضمونة</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#3b82f6', marginBottom: 8, fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>توصيل سريع</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#22c55e', marginBottom: 8, fontVariationSettings: "'FILL' 1" }}>currency_exchange</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>دفع عند الاستلام</div>
          </div>
        </section>

        {/* Benefit Section (Title 1 & Image 2) */}
        <section style={{ padding: '32px 0 0 0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ padding: '0 24px 32px 24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Be Vietnam Pro', fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 16 }}>{lpConfig.title_1 || 'لماذا ستحب هذا المنتج؟'}</h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
              {lpConfig.description_1 || 'تصميم عصري وجودة لا تضاهى، صمم خصيصاً ليناسب احتياجاتك اليومية ويوفر لك الراحة التامة.'}
            </p>
          </div>
          <div style={{ width: '100%', backgroundColor: '#f8fafc' }}>
            {lpConfig.image_2_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lpConfig.image_2_url} alt="Benefit" style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
            )}
          </div>
        </section>

        {/* Details Section (Title 2 & Image 3) */}
        <section style={{ padding: '32px 0 0 0', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ padding: '0 24px 32px 24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Be Vietnam Pro', fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 16 }}>{lpConfig.title_2 || 'تفاصيل تصنع الفارق'}</h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
              {lpConfig.description_2 || 'تم تصميم هذا المنتج بعناية فائقة ليلبي جميع احتياجاتك ويوفر لك أفضل تجربة ممكنة.'}
            </p>
          </div>
          <div style={{ width: '100%', backgroundColor: '#f8fafc' }}>
            {lpConfig.image_3_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={lpConfig.image_3_url} alt="Details" style={{ width: '100%', height: 'auto', display: 'block' }} loading="lazy" />
            )}
          </div>
        </section>

        {/* Section 3 (Extra details) */}
        {(lpConfig.title_3 || lpConfig.description_3) && (
          <section style={{ padding: '32px 24px', textAlign: 'center' }}>
            {lpConfig.title_3 && (
              <h2 style={{ fontFamily: 'Be Vietnam Pro', fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 16 }}>{lpConfig.title_3}</h2>
            )}
            {lpConfig.description_3 && (
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
                {lpConfig.description_3}
              </p>
            )}
          </section>
        )}

      </div>

      <LPFloatingActions themeColor={themeColor} whatsappLink={WHATSAPP_LINK} />
      
    </main>
  );
}
