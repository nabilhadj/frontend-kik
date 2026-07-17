'use client';

import { useState, useEffect } from 'react';
import { fetchDeliveryConfig, createOrder, Wilaya, Commune, DeliveryConfig, OrderInputItem } from '@/lib/api';

interface CheckoutFormProps {
  items: OrderInputItem[];
  totalAmount: number;
  onSuccess: (orderId: string) => void;
  source?: string;
  buttonText?: string;
  customFields?: {
    id: number;
    name: string;
    field_type: string;
    is_required: boolean;
    options: { id: number; value: string }[];
  }[];
}

export default function CheckoutForm({ items, totalAmount, onSuccess, source = 'website', buttonText = 'تأكيد الطلب', customFields }: CheckoutFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Delivery Config state
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Form State
  const [form, setForm] = useState({
    name: '',
    phone: '',
  });

  const [selectedWilaya, setSelectedWilaya] = useState<Wilaya | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
  const [deliveryType, setDeliveryType] = useState<'domicile' | 'stopdesk'>('domicile');
  const [shippingFee, setShippingFee] = useState(0);

  // Custom Fields State
  const [customOptions, setCustomOptions] = useState<Record<string, any>>({});

  useEffect(() => {
    async function loadConfig() {
      try {
        const cfg = await fetchDeliveryConfig();
        if (cfg) {
          setDeliveryConfig(cfg);
        }
      } catch (err) {
        console.error('Failed to load delivery config', err);
      } finally {
        setLoadingConfig(false);
      }
    }
    loadConfig();
  }, []);

  useEffect(() => {
    if (deliveryConfig && selectedWilaya) {
      const feeInfo = deliveryConfig.fees[selectedWilaya.id];
      if (feeInfo) {
        setShippingFee(feeInfo[deliveryType] || 0);
      } else {
        setShippingFee(0);
      }
    } else {
      setShippingFee(0);
    }
  }, [selectedWilaya, deliveryType, deliveryConfig]);

  const filteredCommunes = deliveryConfig?.communes.filter(
    c => selectedWilaya && c.wilaya_id === selectedWilaya.id
  ) || [];

  const grandTotal = totalAmount + shippingFee;

  const updateForm = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !selectedWilaya || !selectedCommune) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية في بيانات الشحن.');
      return;
    }

    if (customFields) {
      for (const field of customFields) {
        const val = customOptions[field.name];
        if (field.is_required && (!val || (Array.isArray(val) && val.length === 0))) {
          setErrorMsg(`يرجى إدخال/اختيار ${field.name}.`);
          return;
        }
      }
    }

    setSubmitting(true);
    setErrorMsg('');

    const orderInputItems = items.map((item, index) => {
      if (index === 0 && Object.keys(customOptions).length > 0) {
        // join array values into comma-separated string for easier reading in admin
        const formattedOptions: Record<string, string> = {};
        for (const [key, value] of Object.entries(customOptions)) {
          formattedOptions[key] = Array.isArray(value) ? value.join(', ') : value;
        }
        return {
          ...item,
          custom_options: { ...item.custom_options, ...formattedOptions }
        };
      }
      return item;
    });

    const orderInput = {
      full_name: form.name,
      phone: form.phone,
      wilaya: selectedWilaya.name,
      commune: selectedCommune.name,
      notes: '',
      delivery_type: deliveryType,
      delivery_fee: shippingFee,
      source: source,
      items: orderInputItems
    };

    try {
      const res = await createOrder(orderInput);
      if (res.success) {
        onSuccess(res.data.id);
      } else {
        if (res.message) {
          setErrorMsg(res.message);
        } else if (res.errors && Array.isArray(res.errors)) {
          setErrorMsg(res.errors.join(' | '));
        } else if (typeof res === 'object') {
          // DRF validation errors
          const errs = Object.values(res).flat().join(' | ');
          setErrorMsg(errs || 'حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى.');
        } else {
          setErrorMsg('حدث خطأ أثناء تسجيل الطلب، يرجى المحاولة مرة أخرى.');
        }
      }
    } catch (err) {
      setErrorMsg('تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-form-container" style={{ direction: 'rtl', width: '100%' }}>
      {errorMsg && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'var(--error-container)', color: 'var(--error)', borderRadius: 12, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
          {errorMsg}
        </div>
      )}

      <div className="checkout-step" style={{ marginBottom: 20 }}>

        <div className="form-field" style={{ marginBottom: 16 }}>
          <input
            className="form-input"
            type="text"
            placeholder="أدخل اسمك الكامل"
            value={form.name}
            onChange={e => updateForm('name', e.target.value)}
            style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--outline-variant)', padding: '0 16px', fontSize: 15, fontFamily: 'inherit' }}
          />
        </div>
        <div className="form-field" style={{ marginBottom: 16 }}>
          <input
            className="form-input"
            type="tel"
            placeholder="05xxxxxxxx"
            value={form.phone}
            onChange={e => updateForm('phone', e.target.value)}
            style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--outline-variant)', padding: '0 16px', fontSize: 15, fontFamily: 'inherit', direction: 'ltr', textAlign: 'right' }}
          />
        </div>

        {loadingConfig ? (
          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: 14 }}>
            <span className="material-symbols-outlined" style={{ animation: 'spin 1.5s linear infinite', verticalAlign: 'middle', marginLeft: 8 }}>sync</span>
            جاري تحميل خيارات التوصيل...
          </div>
        ) : (
          <>
            <div className="form-field" style={{ marginBottom: 16 }}>
              <select
                className="form-input"
                value={selectedWilaya?.id || ''}
                onChange={e => {
                  const id = Number(e.target.value);
                  const w = deliveryConfig?.wilayas.find(x => x.id === id) || null;
                  setSelectedWilaya(w);
                  setSelectedCommune(null);
                }}
                style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--outline-variant)', padding: '0 16px', fontSize: 15, fontFamily: 'inherit', appearance: 'none', background: 'var(--surface-container-low) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%235a5d6e\\\' stroke-width=\\\'2\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'%3E%3Cpath d=\\\'M6 9l6 6 6-6\\\'/%3E%3C/svg%3E") no-repeat left 12px center', backgroundSize: '16px' }}
              >
                <option value="">اختر الولاية</option>
                {deliveryConfig?.wilayas.map(w => (
                  <option key={w.id} value={w.id}>{w.id} - {w.name}</option>
                ))}
              </select>
            </div>

            {selectedWilaya && (
              <div className="form-field" style={{ marginBottom: 16 }}>
                <select
                  className="form-input"
                  value={selectedCommune?.id || ''}
                  onChange={e => {
                    const id = Number(e.target.value);
                    const c = filteredCommunes.find(x => x.id === id) || null;
                    setSelectedCommune(c);
                  }}
                  style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--outline-variant)', padding: '0 16px', fontSize: 15, fontFamily: 'inherit', appearance: 'none', background: 'var(--surface-container-low) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%235a5d6e\\\' stroke-width=\\\'2\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'%3E%3Cpath d=\\\'M6 9l6 6 6-6\\\'/%3E%3C/svg%3E") no-repeat left 12px center', backgroundSize: '16px' }}
                >
                  <option value="">اختر البلدية</option>
                  {filteredCommunes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-field" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setDeliveryType('domicile')}
                  style={{
                    flex: 1, height: 46, borderRadius: 12,
                    border: `1.5px solid ${deliveryType === 'domicile' ? 'var(--primary)' : 'var(--outline-variant)'}`,
                    background: deliveryType === 'domicile' ? 'rgba(0,74,198,0.06)' : 'transparent',
                    color: deliveryType === 'domicile' ? 'var(--primary)' : 'var(--on-surface-variant)',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  توصيل للمنزل
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryType('stopdesk')}
                  style={{
                    flex: 1, height: 46, borderRadius: 12,
                    border: `1.5px solid ${deliveryType === 'stopdesk' ? 'var(--primary)' : 'var(--outline-variant)'}`,
                    background: deliveryType === 'stopdesk' ? 'rgba(0,74,198,0.06)' : 'transparent',
                    color: deliveryType === 'stopdesk' ? 'var(--primary)' : 'var(--on-surface-variant)',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  توصيل للمكتب
                </button>
              </div>
            </div>

            {/* Custom Fields */}
            {customFields && customFields.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ height: 1, background: 'var(--outline-variant)', margin: '0 0 16px 0' }} />
                {customFields.map((field) => {
                  const val = customOptions[field.name];
                  return (
                    <div key={field.id} className="form-field" style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>
                        {field.name} {field.is_required && <span style={{ color: 'var(--error)' }}>*</span>}
                      </label>

                      {field.field_type === 'radio' && field.options && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {field.options.map(opt => {
                            const isSelected = val === opt.value;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setCustomOptions(prev => ({ ...prev, [field.name]: opt.value }))}
                                style={{
                                  flex: '1 1 auto', height: 46, borderRadius: 12, padding: '0 16px',
                                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--outline-variant)'}`,
                                  background: isSelected ? 'rgba(0,74,198,0.06)' : 'transparent',
                                  color: isSelected ? 'var(--primary)' : 'var(--on-surface-variant)',
                                  fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                }}
                              >
                                {opt.value}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {field.field_type === 'checkbox' && field.options && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                          {field.options.map(opt => {
                            const selectedArray = Array.isArray(val) ? val : [];
                            const isSelected = selectedArray.includes(opt.value);
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  const newArr = isSelected 
                                    ? selectedArray.filter((v: string) => v !== opt.value)
                                    : [...selectedArray, opt.value];
                                  setCustomOptions(prev => ({ ...prev, [field.name]: newArr }));
                                }}
                                style={{
                                  flex: '1 1 auto', height: 46, borderRadius: 12, padding: '0 16px',
                                  border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--outline-variant)'}`,
                                  background: isSelected ? 'rgba(0,74,198,0.06)' : 'transparent',
                                  color: isSelected ? 'var(--primary)' : 'var(--on-surface-variant)',
                                  fontFamily: 'inherit', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                }}
                              >
                                {opt.value}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {field.field_type === 'select' && field.options && (
                        <select
                          className="form-input"
                          value={(val as string) || ''}
                          onChange={(e) => setCustomOptions(prev => ({ ...prev, [field.name]: e.target.value }))}
                          style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--outline-variant)', padding: '0 16px', fontSize: 15, fontFamily: 'inherit', appearance: 'none', background: 'var(--surface-container-low) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\\\'http://www.w3.org/2000/svg\\\' viewBox=\\\'0 0 24 24\\\' fill=\\\'none\\\' stroke=\\\'%235a5d6e\\\' stroke-width=\\\'2\\\' stroke-linecap=\\\'round\\\' stroke-linejoin=\\\'round\\\'%3E%3Cpath d=\\\'M6 9l6 6 6-6\\\'/%3E%3C/svg%3E") no-repeat left 12px center', backgroundSize: '16px' }}
                        >
                          <option value="">اختر...</option>
                          {field.options.map(opt => (
                            <option key={opt.id} value={opt.value}>{opt.value}</option>
                          ))}
                        </select>
                      )}

                      {field.field_type === 'text' && (
                        <input
                          type="text"
                          className="form-input"
                          placeholder={`أدخل ${field.name}`}
                          value={(val as string) || ''}
                          onChange={(e) => setCustomOptions(prev => ({ ...prev, [field.name]: e.target.value }))}
                          style={{ width: '100%', height: 48, borderRadius: 12, border: '1px solid var(--outline-variant)', padding: '0 16px', fontSize: 15, fontFamily: 'inherit' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <div className="checkout-step" style={{ marginBottom: 20 }}>

        <div style={{ background: 'var(--surface-container-low)', borderRadius: 16, padding: 16, marginBottom: 20, border: '1px solid var(--outline-variant)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--on-surface-variant)' }}>
            <span>سعر المنتجات:</span>
            <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{totalAmount} د.ج</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: 'var(--on-surface-variant)' }}>
            <span>سعر التوصيل:</span>
            <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{shippingFee} د.ج</span>
          </div>
          <div style={{ height: 1, background: 'var(--outline-variant)', margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
            <span style={{ color: 'var(--on-surface)' }}>الإجمالي الكلي للدفع:</span>
            <span style={{ color: 'var(--primary)' }}>{grandTotal} د.ج</span>
          </div>
        </div>



        <button
          onClick={handlePlaceOrder}
          style={{
            width: '100%',
            height: 56,
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            borderRadius: 16,
            fontFamily: 'inherit',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(34, 197, 94, 0.3)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="material-symbols-outlined" style={{ animation: 'spin 1.5s linear infinite', fontSize: 22 }}>sync</span>
              جاري تسجيل الطلب...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>check_circle</span>
              {buttonText}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
