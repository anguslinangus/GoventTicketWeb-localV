/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // SVG 處理配置
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      use: ['@svgr/webpack'],
    })
    return config
  },

  // 圖片配置
  images: {
    domains: ['localhost'],
    unoptimized: true
  },

  // 環境變數配置
  env: {
    CUSTOM_KEY: 'my-value',
  },
}

export default nextConfig
