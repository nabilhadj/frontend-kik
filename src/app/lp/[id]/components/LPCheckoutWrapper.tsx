'use client';

import { useState } from 'react';
import CheckoutForm from '@/components/CheckoutForm';
import LPOrderSuccess from './LPOrderSuccess';

export default function LPCheckoutWrapper({ product, config }: any) {
  const [orderDone, setOrderDone] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  if (orderDone) {
    return <LPOrderSuccess createdOrderId={createdOrderId} />;
  }

  return (
    <div id="checkout-form-section" style={{ background: 'var(--surface)', borderRadius: 24, padding: '24px 20px', boxShadow: '0 12px 32px rgba(0,0,0,0.08)' }}>
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
  );
}
