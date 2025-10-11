/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ["*"] }
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'files.stripe.com' }
    ]
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en'
  }
};

export default nextConfig;
