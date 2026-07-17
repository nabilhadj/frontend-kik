'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { useCart } from '@/lib/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const router = useRouter();

  const shipping = total >= 5000 ? 0 : 600;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="page-wrapper">
          <div style={{ padding: '12px var(--margin-mobile)' }}>
            <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--primary)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
              رجوع
            </button>
          </div>
          <div className="empty-state">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>shopping_cart</span>
            <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--on-surface)', marginTop: 12 }}>سلتك فارغة</p>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 4 }}>أضف بعض المنتجات لتبدأ التسوق</p>
            <Link href="/store" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex', textDecoration: 'none' }}>تصفح المتجر</Link>
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
        <div style={{ padding: '12px var(--margin-mobile)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', cursor: 'pointer', background: 'none', border: 'none' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
            </button>
            <span style={{ fontFamily: 'Be Vietnam Pro', fontSize: 20, fontWeight: 700 }}>سلة التسوق</span>
            <span style={{ background: 'var(--primary-container)', color: 'var(--on-primary-container)', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 99 }}>
              {items.reduce((s, i) => s + i.quantity, 0)} منتج
            </span>
          </div>
          <button onClick={clearCart} style={{ fontSize: 13, color: 'var(--error)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}>
            مسح الكل
          </button>
        </div>

        <div style={{ padding: '0 var(--margin-mobile)' }}>
          <div className="lg:flex lg:gap-8 lg:items-start lg:mt-6">
            <div className="lg:flex-grow">
              {/* Cart Items */}
              {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-img">
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="cart-item-info">
                <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 2 }}>{item.category}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8, lineHeight: 1.4 }}>{item.name}</p>
                {item.selectedColor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <span style={{ width: 14, height: 14, borderRadius: 99, background: item.selectedColor, border: '1px solid rgba(0,0,0,0.1)', display: 'inline-block' }} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)' }}>{item.price * item.quantity} د.ج</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, cursor: 'pointer', fontSize: 16, border: 'none' }}
                    >−</button>
                    <span style={{ fontSize: 15, fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      style={{ width: 28, height: 28, borderRadius: 99, background: 'var(--surface-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, cursor: 'pointer', fontSize: 16, border: 'none' }}
                    >+</button>
                    <button onClick={() => removeItem(item.id)} style={{ width: 28, height: 28, borderRadius: 99, background: 'rgba(186,26,26,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: 'none' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--error)' }}>delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Promo Code */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
            <input
              type="text"
              placeholder="رمز الخصم"
              style={{ flex: 1, height: 44, padding: '0 16px', borderRadius: 12, border: '1.5px solid var(--outline-variant)', background: 'var(--surface-container-low)', fontFamily: 'inherit', fontSize: 14, direction: 'rtl', outline: 'none' }}
            />
            <button style={{ padding: '0 20px', background: 'var(--surface-container-high)', borderRadius: 12, fontFamily: 'inherit', fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none' }}>
              تطبيق
            </button>
          </div>
            </div>

            <div className="lg:w-[400px] lg:flex-shrink-0">
              {/* Order Summary */}
          <div className="cart-summary">
            <p style={{ fontFamily: 'Be Vietnam Pro', fontSize: 16, fontWeight: 700, marginBottom: 12 }}>ملخص الطلب</p>
            <div className="summary-row">
              <span style={{ color: 'var(--on-surface-variant)' }}>المجموع الفرعي</span>
              <span style={{ fontWeight: 600 }}>{total} د.ج</span>
            </div>
            <div className="summary-row">
              <span style={{ color: 'var(--on-surface-variant)' }}>رسوم الشحن</span>
              <span style={{ fontWeight: 600, color: shipping === 0 ? '#22c55e' : 'inherit' }}>
                {shipping === 0 ? 'مجاناً' : `${shipping} د.ج`}
              </span>
            </div>
            {shipping > 0 && (
              <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--primary)' }}>info</span>
                <span style={{ fontSize: 12, color: 'var(--primary)' }}>أضف {5000 - total} د.ج للحصول على شحن مجاني</span>
              </div>
            )}
            <div className="summary-row">
              <span>الإجمالي</span>
              <span>{grandTotal} د.ج</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Link
            href="/checkout"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              width: '100%', height: 56, background: 'var(--primary)', color: 'white',
              borderRadius: 16, fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
              marginTop: 16, marginBottom: 8, textDecoration: 'none', transition: 'all 0.2s'
            }}
          >
              <span className="material-symbols-outlined">payment</span>
              إتمم الشراء — {grandTotal} د.ج
            </Link>
          </div>
        </div>
        </div>

      </main>
      <BottomNav />
    </>
  );
}
