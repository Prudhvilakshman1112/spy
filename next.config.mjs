/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.109'],
  images: {
    remotePatterns: [
      new URL('https://xpmudrchipnbmvlawsuw.supabase.co/**'),
    ],
  },
};

export default nextConfig;
