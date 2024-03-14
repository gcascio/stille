/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

/** @type {import("next").NextConfig} */
const config = {
  async headers() {
    return [
      {
        source: '/api/feed/:slug*',
        headers: [
          {
            key: 'cache-control',
            value: `s-maxage=10, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
          },
        ],
      },
    ]
  },
};

export default config;
