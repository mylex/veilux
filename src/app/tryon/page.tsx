"use client";
import React from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

// Dynamically import ARCanvas to avoid SSR issues
const ARCanvas = dynamic(() => import('../../components/ARCanvas'), { ssr: false });

export default function TryOnPage() {
  const searchParams = useSearchParams();
  const image = searchParams?.get('image') || '';
  const type = (searchParams?.get('type') as 'tunic' | 'hijab' | 'dress') || 'tunic';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold mb-4">Virtual Try-On</h1>
      <ARCanvas overlayImage={image} overlayType={type} />
      <p className="text-gray-500 text-sm mt-2">(Full-body AR overlay MVP. Powered by MoveNet pose detection.)</p>
    </main>
  );
}