'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/api';

export default function LPOrderSuccess({ createdOrderId }: { createdOrderId: string }) {
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
