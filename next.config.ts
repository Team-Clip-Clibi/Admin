// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: import('webpack').Configuration) => {
    config.module?.rules?.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push('lightningcss', '@tailwindcss/oxide');
    } else if (typeof config.externals === 'undefined') {
      config.externals = ['lightningcss', '@tailwindcss/oxide'];
    }

    return config;
  },
};

module.exports = nextConfig;
