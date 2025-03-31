/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["assets.coingecko.com", "cdn.jsdelivr.net"],
  },
  // Configure headers to improve caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            // Layered caching strategy with:
            // - 1 hour for client browsers (max-age)
            // - 24 hours for CDN/edge (s-maxage)
            // - 2 hour stale-while-revalidate to refresh in background
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=7200",
          },
        ],
      },
    ];
  },
};
