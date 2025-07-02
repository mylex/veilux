"use client";
import React, { useState } from 'react';

export default function SizingPage() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');

  const recommendSize = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple logic for MVP
    const h = parseInt(height, 10);
    const w = parseInt(weight, 10);
    if (!h || !w) return setSize('Please enter valid numbers.');
    if (h < 155 || w < 50) setSize('S');
    else if (h < 170 || w < 65) setSize('M');
    else setSize('L');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">AI Size Recommender</h1>
      <form onSubmit={recommendSize} className="flex flex-col gap-4 w-64">
        <input type="number" placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-[#1a2233] text-white py-2 rounded">Recommend Size</button>
      </form>
      {size && <div className="mt-4 text-lg font-semibold">Recommended Size: {size}</div>}
    </main>
  );
} 