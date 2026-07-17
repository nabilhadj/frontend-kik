export type Product = {
  id: number | string;
  name: string;
  category: string;
  categorySlug?: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  colors?: string[];
  badge?: string;
  description: string;
  features: string[];
};

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface BackendProduct {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  price: string;
  discount_price: string | null;
  discount_percentage: number;
  effective_price: string;
  in_stock: boolean;
  stock_quantity: number;
  category: number | null;
  category_name: string | null;
  category_slug: string | null;
  main_image: string | null;
  has_colors: boolean;
  created_at: string;
  description?: string;
  characteristics?: string[];
  colors?: {
    id: number;
    name: string;
    hex_code: string;
    image_url: string | null;
    order: number;
  }[];
  custom_fields?: {
    id: number;
    name: string;
    field_type: string;
    is_required: boolean;
    order: number;
    options: {
      id: number;
      value: string;
      order: number;
    }[];
  }[];
  images?: {
    id: number;
    image_url: string;
    alt_text: string;
    is_main: boolean;
    order: number;
  }[];
}

export interface Wilaya {
  id: number;
  name: string;
}

export interface Commune {
  id: number;
  name: string;
  wilaya_id: number;
  has_stop_desk: boolean;
}

export interface DeliveryConfig {
  wilayas: Wilaya[];
  communes: Commune[];
  fees: Record<string, {
    domicile: number;
    stopdesk: number;
  }>;
}

// Map backend product representation to frontend Product interface
export function mapProduct(bp: BackendProduct): Product {
  // Ensure the image URL has the absolute backend URL prefix if it's a relative path
  let img = bp.main_image || '';
  if (!img && bp.images && bp.images.length > 0) {
    // Look for main image or fallback to the first one
    const mainImgObj = bp.images.find(imgObj => imgObj.is_main) || bp.images[0];
    img = mainImgObj.image_url;
  }
  
  if (img && !img.startsWith('http') && !img.startsWith('//')) {
    img = `${API_BASE_URL}${img.startsWith('/') ? '' : '/'}${img}`;
  }
  
  // In local dev only: replace 127.0.0.1 with localhost to prevent Next.js SSRF blocking
  // In production the API_BASE_URL is already the correct domain, no replacement needed.
  if (img && API_BASE_URL.includes('localhost')) {
    img = img.replace('127.0.0.1', 'localhost');
  }

  // Map colors name list if colors detail array exists
  const colorsList = bp.colors ? bp.colors.map(c => c.hex_code || c.name) : [];

  return {
    id: bp.id,
    name: bp.name,
    category: bp.category_name || 'عام',
    categorySlug: bp.category_slug || undefined,
    price: parseFloat(bp.effective_price || bp.price),
    oldPrice: bp.discount_price ? parseFloat(bp.price) : undefined,
    rating: 4.8, // Dummy fallback
    reviews: 142, // Dummy fallback
    image: img,
    colors: colorsList.length > 0 ? colorsList : undefined,
    badge: bp.discount_percentage > 0 ? `خصم ${bp.discount_percentage}%` : undefined,
    description: bp.description || bp.short_description || '',
    features: bp.characteristics && bp.characteristics.length > 0 ? bp.characteristics : (bp.description ? [
      "جودة عالية مضمونة",
      "تصميم مريح وأنيق",
      "متين ومقاوم للاستخدام اليومي"
    ] : [])
  };
}

export async function fetchProducts(categorySlug?: string, searchQuery?: string): Promise<Product[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/products/`);
    if (categorySlug) {
      url.searchParams.append('category', categorySlug);
    }
    if (searchQuery) {
      url.searchParams.append('search', searchQuery);
    }

    const res = await fetch(url.toString(), { next: { revalidate: 15 } });
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    
    // Check if the response contains paginated results
    const productsList: BackendProduct[] = data.results || data;
    return productsList.map(mapProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProductById(idOrSlug: string): Promise<BackendProduct | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${idOrSlug}/`, { next: { revalidate: 15 } });
    if (!res.ok) throw new Error('Failed to fetch product details');
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product ${idOrSlug}:`, error);
    return null;
  }
}

export interface BackendLandingPage {
  id: number;
  old_price: string | null;
  theme_color: string;
  main_image_url: string | null;
  title_1: string;
  description_1: string;
  image_2_url: string | null;
  title_2: string;
  description_2: string;
  image_3_url: string | null;
  title_3: string;
  description_3: string;
  whatsapp_number: string;
  product_details: BackendProduct;
}

export async function fetchLandingPage(idOrSlug: string): Promise<BackendLandingPage | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/landing-pages/${idOrSlug}/`, { next: { revalidate: 15 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch landing page config');
    }
    const data = await res.json();
    
    // In local dev only: replace 127.0.0.1 with localhost to prevent Next.js SSRF blocking
    if (API_BASE_URL.includes('localhost')) {
      if (data.main_image_url) data.main_image_url = data.main_image_url.replace('127.0.0.1', 'localhost');
      if (data.image_2_url) data.image_2_url = data.image_2_url.replace('127.0.0.1', 'localhost');
      if (data.image_3_url) data.image_3_url = data.image_3_url.replace('127.0.0.1', 'localhost');
      if (data.product_details && data.product_details.main_image) {
        data.product_details.main_image = data.product_details.main_image.replace('127.0.0.1', 'localhost');
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching landing page for ${idOrSlug}:`, error);
    return null;
  }
}



export async function fetchDeliveryConfig(): Promise<DeliveryConfig | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/delivery-config/`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch delivery config');
    const data = await res.json();
    if (data.success) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching delivery config:', error);
    return null;
  }
}

export interface OrderInputItem {
  product_id: number | string;
  quantity: number;
  color_name?: string;
  custom_options?: Record<string, string>;
}

export interface OrderInput {
  full_name: string;
  phone: string;
  wilaya: string;
  commune: string;
  notes?: string;
  delivery_type: 'domicile' | 'stopdesk';
  delivery_fee: number;
  items: OrderInputItem[];
  source?: string;
}

export async function createOrder(orderData: OrderInput) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/guest-create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'تعذر إرسال الطلب، يرجى المحاولة مرة أخرى.' };
  }
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  image: string | null;
  parent: number | null;
  children?: Category[];
  is_active: boolean;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/`, { next: { revalidate: 15 } });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.results || data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
