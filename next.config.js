/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for the Docker deployment (see client/Dockerfile) — produces a
  // self-contained .next/standalone directory with only the files needed
  // to run the app, so the runtime image doesn't need the full node_modules
  // tree or source files copied in.
  output: "standalone",
  images: {
    // Every image here is a local static asset in public/, already sized for
    // its use. Runtime optimization would buy nothing, and requiring it means
    // shipping sharp — whose platform-specific binaries cannot be locked
    // correctly from a Windows dev machine, breaking `npm ci` in the Linux
    // build. Serving these as-is removes that whole class of failure.
    unoptimized: true,
  },
};

module.exports = nextConfig;
