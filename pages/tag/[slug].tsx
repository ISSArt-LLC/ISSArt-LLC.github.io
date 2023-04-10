import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from '../../utils';
import ItemPost from '../../components/ItemPost';
import { Button } from '@mui/material';

export default function tag({ posts }: any) {
  return (
    <>
      <div className="container my-3">
        <Button href={`/blog/`} variant="outlined">Go back</Button>
        <p>search results:</p>
        <div className="row">
          <div className="col-lg-10 post-date m-1 p-2m-auto">
            {posts.map((post: any, index: any) => {
              return <ItemPost key={index} post={post} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync(path.join('posts'));
  let tempStorage: { params: { slug: string; }; }[] = [];
  const temppaths = files.map(filename => {
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    if (!frontmatter.draft || frontmatter.draft === false) {
      if (frontmatter.tags) {
        frontmatter.tags.map((tag: string) => {
          let slug = slugify(tag);
          tempStorage.push({ params: { slug } });
        });
      }
    } else {
      return null;
    }
  });
  const paths = tempStorage.filter((item, index) => {
    return tempStorage.indexOf(item) === index;
  });
  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params: { slug } }: any) {
  // Get files from the posts dir
  const files = fs.readdirSync(path.join('posts'));
  let tempStorage: { post: { [key: string]: Array<any>; } }[] = [];
  // Get slug and frontmatter from posts
  const tempPosts = files.map(filename => {
    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    );
    const { data: frontmatter } = matter(markdownWithMeta);
    if (!frontmatter.draft || frontmatter.draft === false) {
      if (frontmatter.tags) {
        frontmatter.tags.map((tag: string) => {
          let tagSlug = slugify(tag);
          if (slug === tagSlug) {
            tempStorage.push({ post: frontmatter });
          }
        });
      }
    } else {
      return null;
    }
  });
  //  remove null in tempPosts
  const posts = tempStorage.filter(post => {
    return post && post;
  });
  return {
    props: {
      posts
    }
  };
}
