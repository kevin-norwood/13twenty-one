import type { NextConfig } from "next";

module.exports = {
  async headers() {
    return [
      {
        // Apply these headers to all routes ('/:path*')
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};