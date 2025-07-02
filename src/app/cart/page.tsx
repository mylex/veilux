"use client";
import React, { useState } from 'react';

const INITIAL_CART = [
  { id: 1, name: 'Classic Hijab', price: '$20' },
  { id: 2, name: 'Elegant Tunic', price: '$45' },
];

export default function CartPage() {
  const [cart, setCart] = useState(INITIAL_CART);

  const removeItem = (id: number) => setCart(cart.filter(item => item.id !== id));

  return (
    <main className="min-h-screen flex flex-col items-center py-8">
      <h1 className="text-3xl font-bold mb-4">Cart & Checkout</h1>
      <div className="w-full max-w-md bg-white rounded shadow p-4">
        {cart.length === 0 ? (
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <span>{item.name}</span>
                <span>{item.price}</span>
                <button onClick={() => removeItem(item.id)} className="ml-2 text-red-500">Remove</button>
              </li>
            ))}
          </ul>
        )}
        <button className="mt-4 w-full bg-[#1a2233] text-white py-2 rounded" disabled={cart.length === 0}>Checkout</button>
      </div>
    </main>
  );
} 