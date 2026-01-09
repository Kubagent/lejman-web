/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/texts',
        destination: '/written-work',
        permanent: true, // 301 redirect for SEO
      },
      {
        source: '/texts/:slug*',
        destination: '/written-work/:slug*',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
