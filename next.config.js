/**
 * next.config.js
 * codeFlux 🚀 – AI-powered developer assistant
 * Copyright (c) 2025 RaviChandra. All rights reserved.
 * Repository: https://github.com/Ravichandra89/codeFlux
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Exclude .node files
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });

    // Treat native modules as external
    config.externals = [...(config.externals || []), /onnxruntime-node/];

    // Add markdown loader (raw-loader)
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });

    return config;
  },
  experimental: {
    turbo: {
      rules: {
        "*.node": {
          loaders: ["node-loader"],
        },
      },
    },
  },
};

module.exports = nextConfig; // ✅ CommonJS export
