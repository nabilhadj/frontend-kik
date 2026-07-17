'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CheckoutForm from '@/components/CheckoutForm';
import { Product, BackendLandingPage } from '@/lib/api';

export default function LandingPageClient({ product, config }: { product: Product, config: BackendLandingPage }) {
  const [orderDone, setOrderDone] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [showFloatingBtn, setShowFloatingBtn] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 40 });
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowFloatingBtn(true);
      } else {
        setShowFloatingBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const WHATSAPP_NUMBER = config.whatsapp_number || "213500000000"; // Fallback to default if not configured
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أريد الاستفسار عن منتج: ${product.name}`)}`;

  if (orderDone) {
    return (
      <main className="lp-container" style={{ minHeight: '100vh', background: 'var(--background)', direction: 'rtl', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', background: 'var(--surface)', padding: 40, borderRadius: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 100, height: 100, borderRadius: 50, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 52, color: '#22c55e', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 style={{ fontFamily: 'Be Vietnam Pro', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>تم الطلب بنجاح! 🎉</h2>
          <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', lineHeight: 1.7, margin: '0 auto 24px' }}>
            شكراً لطلبك. سيقوم فريقنا بالاتصال بك قريباً لتأكيد طلبك.
          </p>
          <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, margin: '24px auto' }}>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>رقم الطلب</p>
            <p style={{ fontFamily: 'Be Vietnam Pro', fontSize: 22, fontWeight: 700, color: 'var(--primary)', letterSpacing: 2 }}>#{createdOrderId}</p>
          </div>
          <Link href="/" style={{ display: 'inline-flex', background: 'var(--primary)', color: 'white', padding: '16px 40px', borderRadius: 16, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 20px rgba(0,74,198,0.2)' }}>
            العودة للمتجر
          </Link>
        </div>
      </main>
    );
  }

  const themeColor = config?.theme_color || '#e11d48';

  return (
    <main className="lp-container" style={{ minHeight: '100vh', background: '#f8fafc', direction: 'rtl', paddingBottom: 100, '--primary': themeColor } as React.CSSProperties}>
      {/* Hero Section */}
      <section style={{ background: 'var(--surface)', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ position: 'relative', width: '100%', height: '50vh', minHeight: 400, backgroundColor: '#e2e8f0', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, overflow: 'hidden' }}>
            {config.main_image_url ? (
              <Image
                src={config.main_image_url}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 600px) 100vw, 600px"
                priority
              />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#94a3b8' }}>image</span>
              </div>
            )}

            <div style={{ position: 'absolute', top: 20, right: 20 }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, background: 'rgba(255,255,255,0.9)', borderRadius: 22, color: 'var(--on-surface)', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)' }}>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px 24px', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>

            {/* Top row: Stars & Timer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px dashed #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', color: '#f59e0b', fontSize: 18 }}>
                  {'★'.repeat(5)}
                </div>
                <span style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>(4.9/5)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fee2e2', color: '#ef4444', padding: '6px 12px', borderRadius: 10, fontSize: 14, fontWeight: 700, direction: 'ltr' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>timer</span>
                <span style={{ letterSpacing: 1 }}>
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Bottom row: Price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: themeColor, lineHeight: 1 }}>
                  {product.price} <span style={{ fontSize: 20, fontWeight: 700 }}>د.ج</span>
                </div>
              </div>

              {(config.old_price || product.oldPrice) && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 13, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>السعر السابق</div>
                  <div style={{ fontSize: 18, color: '#94a3b8', textDecoration: 'line-through', fontWeight: 700, lineHeight: 1 }}>
                    {config.old_price || product.oldPrice} د.ج
                  </div>
                  {Number(config.old_price || product.oldPrice) > Number(product.price) && (
                    <div style={{ background: '#10b981', color: 'white', fontSize: 12, fontWeight: 800, padding: '4px 8px', borderRadius: 6, marginTop: 8 }}>
                      توفير {Math.round(((Number(config.old_price || product.oldPrice) - Number(product.price)) / Number(config.old_price || product.oldPrice)) * 100)}%
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
        {/* Checkout Form Section */}
        <section ref={formRef} style={{ marginTop: -30, position: 'relative', zIndex: 10 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 24, padding: '24px 20px', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface-variant)', marginTop: 4 }}> لإرسال طلبك أدخل معلوماتك أسفله    👇</p>
            </div>

            <CheckoutForm
              items={[{ product_id: product.id, quantity: 1, color_name: '', custom_options: {} }]}
              totalAmount={product.price}
              onSuccess={(id) => {
                setCreatedOrderId(id);
                setOrderDone(true);
              }}
              source="landing_page"
              buttonText="اضغط هنا للطلب الآن"
              customFields={config.product_details?.custom_fields}
            />
          </div>
        </section>

        {/* Trust Badges */}
        <section style={{ display: 'flex', justifyContent: 'space-between', gap: 12, margin: '32px 0' }}>
          <div style={{ flex: 1, background: 'var(--surface)', borderRadius: 16, padding: '16px 8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#eab308', marginBottom: 8, fontVariationSettings: "'FILL' 1" }}>verified</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>جودة مضمونة</div>
          </div>
          <div style={{ flex: 1, background: 'var(--surface)', borderRadius: 16, padding: '16px 8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#3b82f6', marginBottom: 8, fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>توصيل سريع</div>
          </div>
          <div style={{ flex: 1, background: 'var(--surface)', borderRadius: 16, padding: '16px 8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: '#22c55e', marginBottom: 8, fontVariationSettings: "'FILL' 1" }}>currency_exchange</span>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)' }}>دفع عند الاستلام</div>
          </div>
        </section>

        {/* Benefit Section (Title 1 & Image 2) */}
        <section style={{ margin: '40px 0', background: 'var(--surface)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Be Vietnam Pro', fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 16 }}>{config.title_1 || 'لماذا ستحب هذا المنتج؟'}</h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
              {config.description_1 || 'تصميم عصري وجودة لا تضاهى، صمم خصيصاً ليناسب احتياجاتك اليومية ويوفر لك الراحة التامة.'}
            </p>
          </div>
          <div style={{ width: '100%', height: 300, position: 'relative', backgroundColor: '#f1f5f9' }}>
            {config.image_2_url ? (
              <Image src={config.image_2_url} alt="Benefit" fill style={{ objectFit: 'cover' }} sizes="100vw" />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 8 }}>photo_camera</span>
                <span style={{ fontSize: 14 }}>صورة توضيحية 2 (قم بإضافتها من لوحة التحكم)</span>
              </div>
            )}
          </div>
        </section>

        {/* Details Section (Title 2 & Image 3) */}
        <section style={{ margin: '40px 0', background: 'var(--surface)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Be Vietnam Pro', fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 16 }}>{config.title_2 || 'تفاصيل تصنع الفارق'}</h2>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
              {config.description_2 || 'تم تصميم هذا المنتج بعناية فائقة ليلبي جميع احتياجاتك ويوفر لك أفضل تجربة ممكنة.'}
            </p>
          </div>
          <div style={{ width: '100%', height: 300, position: 'relative', backgroundColor: '#f1f5f9' }}>
            {config.image_3_url ? (
              <Image src={config.image_3_url} alt="Details" fill style={{ objectFit: 'cover' }} sizes="100vw" />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 8 }}>photo_camera</span>
                <span style={{ fontSize: 14 }}>صورة توضيحية 3 (قم بإضافتها من لوحة التحكم)</span>
              </div>
            )}
          </div>

        </section>

        {/* Section 3 (Extra details) */}
        {(config.title_3 || config.description_3) && (
          <section style={{ margin: '40px 0', background: 'var(--surface)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              {config.title_3 && (
                <h2 style={{ fontFamily: 'Be Vietnam Pro', fontSize: 24, fontWeight: 800, color: 'var(--on-surface)', marginBottom: 16 }}>{config.title_3}</h2>
              )}
              {config.description_3 && (
                <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.6 }}>
                  {config.description_3}
                </p>
              )}
            </div>
          </section>
        )}

      </div>

      {/* Sticky Bottom CTA */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', zIndex: 40, transform: showFloatingBtn ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
        <button
          onClick={scrollToForm}
          style={{ width: '100%', maxWidth: 600, height: 56, background: themeColor, color: 'white', borderRadius: 16, fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: `0 8px 24px ${themeColor}4d`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <span className="material-symbols-outlined">shopping_cart_checkout</span>
          اطلب المنتج الآن
        </button>
      </div>

      {/* Floating WhatsApp Button */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 90,
          right: 20,
          width: 60,
          height: 60,
          backgroundColor: '#25D366',
          color: 'white',
          borderRadius: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
          zIndex: 50,
          textDecoration: 'none',
          opacity: showFloatingBtn ? 1 : 0,
          transform: showFloatingBtn ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          pointerEvents: showFloatingBtn ? 'auto' : 'none'
        }}
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>
    </main>
  );
}
