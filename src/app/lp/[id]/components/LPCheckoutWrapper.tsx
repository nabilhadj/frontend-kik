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
    <div id="checkout-form-section" style={{ width: '100%', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--on-surface-variant)' }}> لإرسال طلبك أدخل معلوماتك أسفله    👇</p>
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
