const path = require('path');

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: ['@ium-morave/shared'],
  turbopack: {
    root: path.resolve(__dirname, '..', '..')
  }
};
