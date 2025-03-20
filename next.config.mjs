/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_URL: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://activity.fjbcgroup.com"
  }
};

export default nextConfig;
