'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { useCart } from '@/lib/CartContext';
import CheckoutForm from '@/components/CheckoutForm';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [orderDone, setOrderDone] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  if (items.length === 0 && !orderDone) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div className="empty-state" style={{ paddingTop: 80 }}>
            <span className="material-symbols-outlined">shopping_cart</span>
            <p style={{ fontSize: 18, fontWeight: 600, marginTop: 12 }}>السلة فارغة</p>
            <Link href="/store" className="btn-primary" style={{ marginTop: 20, display: 'inline-flex', textDecoration: 'none' }}>تسوق الآن</Link>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  if (orderDone) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div style={{ padding: '60px var(--margin-mobile)', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: 50, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 52, color: '#22c55e', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 style={{ fontFamily: 'Be Vietnam Pro', fontSize: 26, fontWeight: 700, marginBottom: 12 }}>تم الطلب بنجاح! 🎉</h2>
            <p style={{ fontSize: 15, color: 'var(--on-surface-variant)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
              شكراً لتسوقك معنا. سيتم تأكيد طلبك عبر الهاتف وإرساله في أقرب وقت.
            </p>
            <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 20, margin: '24px auto', maxWidth: 320 }}>
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>رقم الطلب</p>
              <p style={{ fontFamily: 'Be Vietnam Pro', fontSize: 22, fontWeight: 700, color: 'var(--primary)', letterSpacing: 2 }}>#{createdOrderId || `KL-${Date.now().toString().slice(-6)}`}</p>
            </div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: 'white', padding: '14px 32px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
              العودة للرئيسية
            </Link>
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="page-wrapper">
        {/* Header */}
        <div style={{ padding: '12px var(--margin-mobile)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <button onClick={() => router.back()} style={{ cursor: 'pointer', color: 'var(--primary)', display: 'flex', alignItems: 'center', background: 'none', border: 'none' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_forward</span>
          </button>
          <span style={{ fontFamily: 'Be Vietnam Pro', fontSize: 20, fontWeight: 700 }}>إتمام الشراء</span>
        </div>

        {/* Main Content */}

        <div className="container animate-slide-up" style={{ direction: 'rtl' }}>
          <div className="max-w-xl mx-auto space-y-6">

            <CheckoutForm
              items={items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                color_name: item.selectedColor || '',
                custom_options: {}
              }))}
              totalAmount={total}
              onSuccess={(id) => {
                setCreatedOrderId(id);
                setOrderDone(true);
                clearCart();
              }}
              source="website"
              customFields={items.length > 0 ? items[0].customFields : undefined}
            />

          </div>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
