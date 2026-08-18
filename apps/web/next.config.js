/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  serverExternalPackages: ['firebase-admin'],
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'ium-morave.vercel.app',
          },
        ],
        destination: 'https://iumorave-ac.org/:path*',
        permanent: true,
      },
    ];
  },
};