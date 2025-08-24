// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // 정적 파일 생성을 위해 활성화
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 정적 배포를 위한 추가 설정
  distDir: 'out',
  assetPrefix: '',
  basePath: '',

  webpack: (config: import('webpack').Configuration) => {
    config.module?.rules?.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // SVG 설정 - URL 방식과 컴포넌트 방식 모두 지원
    config.module?.rules?.push(
      // *.svg?url 형태로 import할 때는 URL로 처리
      {
        test: /\.svg$/i,
        resourceQuery: /url/,
        type: 'asset/resource',
      },
      // 일반적인 *.svg import는 React 컴포넌트로 처리
      {
        test: /\.svg$/i,
        resourceQuery: { not: [/url/] },
        use: ['@svgr/webpack'],
      },
    );

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
