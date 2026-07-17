import { fetchProductById, mapProduct, fetchLandingPage } from '@/lib/api';
import LandingPageClient from './LandingPageClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const lpConfig = await fetchLandingPage(id);
  if (!lpConfig) {
    return {
      title: 'العرض غير موجود',
    };
  }
  const product = mapProduct(lpConfig.product_details);
  return {
    title: `${product.name} - أفضل عرض`,
    description: product.description,
  };
}

export default async function LandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lpConfig = await fetchLandingPage(id);
  
  if (!lpConfig) {
    notFound();
  }

  const product = mapProduct(lpConfig.product_details);

  return <LandingPageClient product={product} config={lpConfig} />;
}
