'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import type { Product } from '@/lib/api';

type Props = {
  product: Product;
  showToast?: (msg: string) => void;
  priority?: boolean;
};

export default function ProductCard({ product, showToast, priority = false }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    showToast?.(`تمت الإضافة: ${product.name}`);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/product/${product.id}`} className="product-card" style={{ textDecoration: 'none' }}>
      <div className="product-card-image" style={{ position: 'relative', overflow: 'hidden' }}>
        {product.badge && <span className="product-badge" style={{ zIndex: 10 }}>{product.badge}</span>}
        {product.image ? (
          <Image 
            src={product.image} 
            alt={product.name} 
            fill 
            sizes="(max-width: 768px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            priority={priority}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-low)', minHeight: 200 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline-variant)' }}>image</span>
          </div>
        )}
      </div>
      <div className="product-card-body">
        <p className="product-category-label">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-footer">
          <div>
            <span className="product-price">{product.price} د.ج</span>
            {product.oldPrice && (
              <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', textDecoration: 'line-through', marginRight: 6 }}>
                {product.oldPrice} د.ج
              </span>
            )}
          </div>
          <button
            className={`add-btn ${added ? 'added' : ''}`}
            onClick={handleAdd}
            title="أضف للسلة"
          >
            <span className="material-symbols-outlined">
              {added ? 'check' : 'add'}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
}
