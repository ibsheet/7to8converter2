/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  basePath: process.env.NODE_ENV  === 'production' ? '/7to8converter2' : '',
  assetPrefix: process.env.NODE_ENV  === 'production' ? '/7to8converter2/' : '',
}

module.exports = nextConfig