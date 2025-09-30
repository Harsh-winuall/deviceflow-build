/** @type {import('next').NextConfig} */

// import BundleAnalyzer from "@next/bundle-analyzer";

const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.apple.com",
      },
      {
        protocol: "https",
        hostname: "d22e6o9mp4t2lx.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

// const withBundleAnalyzer = BundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// });
// analyzing command
// ANALYZE=true yarn build

// export default withBundleAnalyzer(nextConfig);

export default nextConfig;
