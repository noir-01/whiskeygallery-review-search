/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
});

const config = {
  reactStrictMode: false,
};

const nextConfig = withPWA(config);

module.exports = nextConfig;
