import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Import Keypoint type if available
import type { Keypoint, PoseDetector } from '@tensorflow-models/pose-detection';

// TODO: Add a loading state for the detector
// TODO: Dress should be fit automatically, and the value should be set automatically
// TODO: Add a button to reset the canvas
// TODO: Add a button to toggle the camera
// TODO: Add a button to toggle the overlay
// TODO: Add a button to toggle the detector
// TODO: Add a button to toggle the overlay
// TODO: Add a button to toggle the overlay
// TODO: Could save the image to the user's device
interface ARCanvasProps {
  overlayImage: string; // Path to overlay PNG (e.g., dress, tunic)
  overlayType: 'hijab' | 'dress' | 'tunic'; // Type of garment for proper positioning
}

const ARCanvas: React.FC<ARCanvasProps> = ({ overlayImage, overlayType }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [usingCamera, setUsingCamera] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [detector, setDetector] = useState<PoseDetector | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Alert and redirect if no overlayImage
  useEffect(() => {
    if (!overlayImage || overlayImage.trim() === '') {
      window.alert('Please come from the product catalog page and try on a specific product.');
      router.push('/catalog');
    }
  }, [overlayImage, router]);

  // Initialize TensorFlow.js backend and pose detector
  useEffect(() => {
    const initializeDetector = async () => {
      setLoading(true);
      try {
        // Initialize TensorFlow.js backend
        await import('@tensorflow/tfjs-backend-webgl');
        const tf = await import('@tensorflow/tfjs-core');
        await tf.setBackend('webgl');
        await tf.ready();
        
        // Create pose detector
        const poseDetection = await import('@tensorflow-models/pose-detection');
        const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
          modelType: 'SinglePose.Lightning',
        });
        setDetector(detector);
      } catch (error) {
        console.error('Error initializing TensorFlow.js:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeDetector();
  }, []);

  // Start camera
  const startCamera = async () => {
    setUsingCamera(true);
    setImageSrc(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageSrc(URL.createObjectURL(file));
      setUsingCamera(false);
    }
  };

  // Helper to find keypoint by name with type
  const findKeypoint = (keypoints: Keypoint[], name: string): Keypoint | undefined => {
    return keypoints.find((k) => k.name === name);
  };

  // Helper to draw overlay based on garment type and keypoints
  const drawOverlay = useCallback(
    (ctx: CanvasRenderingContext2D, keypoints: Keypoint[], overlay: HTMLImageElement) => {
      const leftShoulder = findKeypoint(keypoints, 'left_shoulder');
      const rightShoulder = findKeypoint(keypoints, 'right_shoulder');
      const leftHip = findKeypoint(keypoints, 'left_hip');
      const rightHip = findKeypoint(keypoints, 'right_hip');
      const nose = findKeypoint(keypoints, 'nose');
      const leftEye = findKeypoint(keypoints, 'left_eye');
      const rightEye = findKeypoint(keypoints, 'right_eye');
      const leftEar = findKeypoint(keypoints, 'left_ear');
      const rightEar = findKeypoint(keypoints, 'right_ear');

      if (
        overlayType === 'hijab' &&
        nose && leftEye && rightEye && leftEar && rightEar &&
        nose.score && nose.score > 0.3 &&
        leftEye.score && leftEye.score > 0.3 &&
        rightEye.score && rightEye.score > 0.3 &&
        leftEar.score && leftEar.score > 0.3 &&
        rightEar.score && rightEar.score > 0.3
      ) {
        // Calculate center between eyes
        const eyeCenterX = (leftEye.x + rightEye.x) / 2;
        const eyeCenterY = (leftEye.y + rightEye.y) / 2;
        // Use distance between ears for width
        const headWidth = Math.abs(leftEar.x - rightEar.x) * 3.1; // Try 2.1 for better fit
        // Use distance from eyes to chin (if available) or nose for height
        const headHeight = headWidth * 1.15; // Slightly taller for hijab
        // Position: center horizontally, a bit above the eyes
        const x = eyeCenterX - headWidth / 2;
        const y = eyeCenterY - headHeight * 0.25; // Move up a bit
        ctx.drawImage(overlay, x, y, headWidth, headHeight);
      } else if ((overlayType === 'dress' || overlayType === 'tunic') && 
                 leftShoulder && rightShoulder && leftHip && rightHip &&
                 leftShoulder.score && leftShoulder.score > 0.3 &&
                 rightShoulder.score && rightShoulder.score > 0.3 &&
                 leftHip.score && leftHip.score > 0.3 &&
                 rightHip.score && rightHip.score > 0.3) {
        // Calculate body dimensions and position
        const x = Math.min(leftShoulder.x, rightShoulder.x, leftHip.x, rightHip.x);
        const y = Math.min(leftShoulder.y, rightShoulder.y);
        const width = Math.abs(rightShoulder.x - leftShoulder.x) * 1.8;
        const height = Math.abs(leftHip.y - rightShoulder.y) * 2;
        ctx.drawImage(overlay, x - width * 0.6, y - height * 0.15, width * 1.8, height * 1.6);
      }
    },
    [overlayType]
  );

  // Run pose detection and draw overlay
  useEffect(() => {
    let animationId: number;
    const runDetection = async () => {
      if (!detector) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const poses = await detector.estimatePoses(video);
        if (poses && poses[0]) {
          const keypoints = poses[0].keypoints as Keypoint[];
          const overlay = new window.Image();
          overlay.src = overlayImage;
          // Draw overlay as soon as image is loaded, and also if already loaded
          if (overlay.complete) {
            drawOverlay(ctx, keypoints, overlay);
          } else {
            overlay.onload = () => drawOverlay(ctx, keypoints, overlay);
          }
        }
      }
      animationId = requestAnimationFrame(runDetection);
    };
    if (usingCamera && detector && videoRef.current) {
      // Always run detection loop, not just after button click
      runDetection();
    }
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [usingCamera, detector, overlayImage, overlayType, drawOverlay]);

  // For static image: run detection once
  useEffect(() => {
    const runDetection = async () => {
      if (!detector || !imageSrc) return;
      const img = new window.Image();
      img.src = imageSrc;
      await new Promise(res => (img.onload = res));
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const poses = await detector.estimatePoses(img);
      if (poses && poses[0]) {
        const keypoints = poses[0].keypoints as Keypoint[];
        const overlay = new window.Image();
        overlay.src = overlayImage;
        overlay.onload = () => drawOverlay(ctx, keypoints, overlay);
      }
    };
    if (imageSrc && detector) {
      runDetection();
    }
  }, [imageSrc, detector, overlayImage, overlayType, drawOverlay]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button onClick={startCamera} className="px-3 py-1 bg-[#1a2233] text-white rounded">Use Camera</button>
        <label className="px-3 py-1 bg-[#f8f7f2] text-[#1a2233] rounded cursor-pointer border border-[#1a2233]">
          Upload Photo
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>
      <div className="relative w-80 h-96 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
        {usingCamera ? (
          <video ref={videoRef} autoPlay playsInline className="absolute w-full h-full object-cover z-0" />
        ) : null}
        <canvas ref={canvasRef} className="absolute w-full h-full z-10 pointer-events-none" />
        {!usingCamera && !imageSrc && (
          <span className="text-gray-400 z-20">Camera or photo preview</span>
        )}
      </div>
      {loading && <p className="text-gray-500 text-sm">Loading pose detection...</p>}
    </div>
  );
};

export default ARCanvas;