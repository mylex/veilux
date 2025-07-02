import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a2233] to-[#f8f7f2] text-[#1a2233]">
      <h1 className="text-4xl font-bold mb-4">Veilux AR Try-On App</h1>
      <p className="mb-8 text-lg max-w-xl text-center">
        Try on modest fashion virtually with AR. Explore our catalog, get AI-powered size recommendations, and shop with confidence.
      </p>
      <nav className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/tryon" className="bg-[#1a2233] text-[#f8f7f2] py-3 rounded-lg text-center font-semibold hover:bg-[#2c3654]">Virtual Try-On</Link>
        <Link href="/catalog" className="bg-[#f8f7f2] text-[#1a2233] py-3 rounded-lg text-center font-semibold border border-[#1a2233] hover:bg-[#e5e6ea]">Product Catalog</Link>
        <Link href="/sizing" className="bg-[#f8f7f2] text-[#1a2233] py-3 rounded-lg text-center font-semibold border border-[#1a2233] hover:bg-[#e5e6ea]">AI Size Recommender</Link>
        <Link href="/cart" className="bg-[#f8f7f2] text-[#1a2233] py-3 rounded-lg text-center font-semibold border border-[#1a2233] hover:bg-[#e5e6ea]">Cart & Checkout</Link>
      </nav>
    </main>
  );
} 