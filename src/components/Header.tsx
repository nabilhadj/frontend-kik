'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      {/* Right: Brand */}
      <Link href="/" className="header-brand">

        <img src="/logo.webp" alt="Logo" width={60} />
      </Link>

      {/* Left: Actions */}
      <div className="header-actions">
        <Link href="/cart" className="icon-btn">
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>shopping_cart</span>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>
        <Link href="/store" className="icon-btn">
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>search</span>
        </Link>

      </div>
    </header>
  );
}
