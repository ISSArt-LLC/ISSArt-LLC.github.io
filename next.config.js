const fs = require("fs");
const blogPostsFolder = "./content/blogPosts";

const getPathsForPosts = () => {
  return fs
    .readdirSync(blogPostsFolder)
    .map((blogName) => {
      const trimmedName = blogName.replace(".md", "");
      return {
        [`/blog/post/${trimmedName}`]: {
          page: `/blog/post/${trimmedName}`,
        },
      };
    })
    .reduce((acc, curr) => {
      return { ...acc, ...curr };
    }, {});
};

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    unoptimized: true,
  },
  // reactStrictMode: true,
  output: "export",
  webpack: (configuration) => {
    configuration.module.rules.push({
      test: /\.md$/,
      use: "frontmatter-markdown-loader",
    });
    configuration.resolve.fallback = { fs: false };
    return configuration;
  },
  async exportPathMap(defaultPathMap) {
    return {
      ...defaultPathMap,
      ...getPathsForPosts(),
    };
  },
};
