import React, { Component } from "react";
import Image from "next/image";
import Link from "next/link";

const BLOG_POSTS_PATH = "../../content/blogPosts";

const importBlogPosts = async () => {
  // https://medium.com/@shawnstern/importing-multiple-markdown-files-into-a-react-component-with-webpack-7548559fce6f
  // second flag in require.context function is if subdirectories should be searched
  const markdownFiles = require
    .context("../../content/blogPosts", false, /\.md$/)
    .keys()
    .filter((el) => !el.includes("blogPosts"))
    .map((relativePath) => relativePath.substring(2));
  return Promise.all(
    markdownFiles.map(async (path) => {
      console.log("markdownFiles", markdownFiles);
      console.log("path", path);
      const markdown = await import(`../../content/blogPosts/${path}`);
      return { ...markdown, slug: path.substring(0, path.length - 3) };
    })
  );
};

export default class Blog extends Component {
  static async getInitialProps() {
    const postsList = await importBlogPosts();

    return { postsList };
  }
  render() {
    const { postsList } = this.props;
    return (
      <div className="blog-list">
        {postsList.map((post) => {
          return (
            <Link key={post.slug} href={`blog/post/${post.slug}`}>
              <Image
                src={post.attributes.thumbnail}
                alt=""
                width="500"
                height="500"
              />
              <h2>{post.attributes.title}</h2>
            </Link>
          );
        })}
        <style jsx>{`
          .blog-list a {
            display: block;
          }
          .blog-list img {
            max-width: 100%;
            max-height: 300px;
          }
          .blog-list {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }
}
