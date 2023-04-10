const fs = require('fs');
const blogPostsFolder = './content/blogPosts';

const getPathsForPosts = () => {
    return fs
        .readdirSync(blogPostsFolder)
        .map(blogName => {
            const trimmedName = blogName.substring(0, blogName.length - 3);
            return {
                [`/blog/post/${trimmedName}`]: {
                    page: '/blog/post/[slug]',
                    query: {
                        slug: trimmedName,
                    },
                },
            };
        })
        .reduce((acc, curr) => {
            return {...acc, ...curr};
        }, {});
};

/** @type {import('next').NextConfig} */
module.exports = {
    images: {
        unoptimized: true,
      },
    // reactStrictMode: true,
    output: 'export',
    webpack: configuration => {
        configuration.module.rules.push({
            test: /\.md$/,
            use: 'frontmatter-markdown-loader',
        });
        return configuration;
    },
    async exportPathMap(defaultPathMap) {
        return {
            ...defaultPathMap,
            ...getPathsForPosts(),
        };
    },
};
