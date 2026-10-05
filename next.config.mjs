/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    cpus: 1,
    workerThreads: false,
    serverActions: {
      bodySizeLimit: "22mb",
    },
  },
};

export default nextConfig;
