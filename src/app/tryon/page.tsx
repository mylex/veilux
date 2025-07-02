"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';

export default function TryOnPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [usingCamera, setUsingCamera] = useState(false);

  const startCamera = async () => {
    setUsingCamera(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        (videoRef.current as HTMLVideoElement).srcObject = stream;
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setUsingCamera(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold mb-4">Virtual Try-On</h1>
      <div className="flex gap-4">
        <button onClick={startCamera} className="px-4 py-2 bg-[#1a2233] text-white rounded">Use Camera</button>
        <label className="px-4 py-2 bg-[#f8f7f2] text-[#1a2233] rounded cursor-pointer border border-[#1a2233]">
          Upload Photo
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>
      <div className="relative w-64 h-80 bg-gray-100 flex items-center justify-center rounded overflow-hidden mt-4">
        {usingCamera ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : imageSrc ? (
          <Image src={imageSrc} alt="Uploaded" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400">Camera or photo preview</span>
        )}
        {/* Sample hijab overlay */}
        <Image
          src="/hijab-sample.png"
          alt="Hijab Overlay"
          width={160}
          height={160}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-40 opacity-80 pointer-events-none"
        />
      </div>
      <p className="text-gray-500 text-sm mt-2">(MVP: Overlay is static. Real AR/ML coming soon!)</p>
    </main>
  );
} 