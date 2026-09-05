/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: { unoptimized: true },
  reactStrictMode: true,
  experimental: { optimizePackageImports: ["@aisocratic/design", "lucide-react"] },
}
export default nextConfig
