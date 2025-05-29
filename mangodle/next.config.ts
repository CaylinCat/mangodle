import { NextConfig } from 'next'

const isProd = process.env.NODE_ENV === 'production'

// Replace 'REPO-NAME' with your GitHub repo name
const basePath = isProd ? '/mangodle' : ''

const nextConfig: NextConfig = {
  output: 'export',   // static HTML export
  basePath,
  assetPrefix: basePath,
}

export default nextConfig