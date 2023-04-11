/** @type {import('next').NextConfig} */
module.exports = {
  /**
   * Disable server-based image optimization.
   *
   * @see https://nextjs.org/blog/next-12-3#disable-image-optimization-stable
   */
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  output: "export",
};
