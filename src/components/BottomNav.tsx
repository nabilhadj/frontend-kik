'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/CartContext';

const navItems = [
  { href: '/', icon: 'home', label: 'الرئيسية' },
  { href: '/store', icon: 'storefront', label: 'المتجر' },
  { href: '/cart', icon: 'shopping_cart', label: 'السلة', badge: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={`nav-item ${isActive ? 'active' : ''}`} style={{ position: 'relative' }}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
            {item.badge && count > 0 && (
              <span style={{
                position: 'absolute',
                top: 2,
                right: 2,
                background: 'var(--error)',
                color: 'white',
                fontSize: 9,
                fontWeight: 700,
                width: 16,
                height: 16,
                borderRadius: 99,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>{count}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
