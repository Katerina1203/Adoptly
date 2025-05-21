import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
        },
        {
            protocol: 'https',
            hostname: 'images.pexels.com',
        },
        {
            protocol: 'https',
            hostname: 'www.aspca.org',
        },
        {
            protocol: 'https',
            hostname: 'rspca.sfo2.cdn.digitaloceanspaces.com',
        },
        {
            protocol: 'https',
            hostname: 'www.unioncountysheriffsoffice.com',
        },
        {
            protocol: 'https',
            hostname: 'cdn.britannica.com',
        },
    ],
},
webpack(config) {
  config.module.rules.push({
    test: /\.svg$/,
    use: ['@svgr/webpack'],
  });

  return config;
},
};

export default nextConfig;
