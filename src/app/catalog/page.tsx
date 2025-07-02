"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const PRODUCTS = [
  { id: 1, name: 'Classic Hijab', category: 'Hijab', price: '$20', image: '/hijab-sample.png' },
  { id: 2, name: 'Elegant Tunic', category: 'Tunic', price: '$45', image: '/tunic-sample.png' },
  { id: 3, name: 'Layered Dress', category: 'Dress', price: '$60', image: '/dress-sample.png' },
];
const CATEGORIES = ['All', 'Hijab', 'Tunic', 'Dress'];

export default function CatalogPage() {
  const [category, setCategory] = useState('All');
  const router = useRouter();
  const filtered = category === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

  return (
    <main className="min-h-screen flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-4">Product Catalog</h1>
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 rounded ${category === cat ? 'bg-[#1a2233] text-white' : 'bg-[#f8f7f2] text-[#1a2233] border border-[#1a2233]'}`}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
        {filtered.map(product => (
          <div key={product.id} className="bg-white rounded shadow p-4 flex flex-col items-center">
            <Image
              src={product.image}
              alt={product.name}
              width={96}
              height={96}
              className="w-24 h-24 object-cover mb-2"
            />
            <div className="font-semibold mb-1">{product.name}</div>
            <div className="text-gray-500 text-sm mb-2">{product.category}</div>
            <div className="font-bold mb-2">{product.price}</div>
            <button
              onClick={() => router.push(`/tryon?image=${product.image}&type=${product.category.toLowerCase()}`)}
              className="px-3 py-1 bg-[#1a2233] text-white rounded hover:bg-opacity-90"
            >
              Try On
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}