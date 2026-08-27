/** @type {import('next').NextConfig} */
const nextConfig = {
  // TileStencil is a browser-only tool, so Cloudflare Pages can serve the
  // prerendered HTML/CSS/JS directly without a Node.js runtime.
  output: "export",
};

export default nextConfig;
