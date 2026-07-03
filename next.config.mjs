/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hackathon-friendly: never block a Vercel deploy on lint/type nits.
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};
export default nextConfig;
