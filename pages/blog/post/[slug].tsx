import React, { Component } from "react";
import Image from "next/image";
import { NextPageContext } from "next";

interface Props {
  blogpost?: any;
}

class Post extends Component<Props> {
  static async getStatic({ query }: NextPageContext) {
    const { slug } = query;
    const blogpost = await import(
      `../../../content/blogPosts/${slug}.md`
    ).catch((error) => null);

    return { blogpost };
  }
  render() {
    if (!this.props.blogpost) return <div>not found</div>;

    const {
      html,
      attributes: { thumbnail, title },
    } = this.props.blogpost.default;

    return (
      <>
        <article>
          <h1>{title}</h1>
          <Image src={thumbnail} alt="" width={500} height={500} />
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </article>
        <style jsx>{`
          article {
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          h1 {
            text-align: center;
          }
        `}</style>
      </>
    );
  }
}

export default Post;
