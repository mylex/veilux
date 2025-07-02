import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mediapipe/pose': require.resolve('@mediapipe/pose')
    };
    return config;
  },
  transpilePackages: ['@mediapipe/pose']
};

export default nextConfig;
