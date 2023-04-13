import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from '../../utils';
import { Button, Container, Grid, Typography } from '@mui/material';
import CardPost from '../../components/PostListCard';

export default function tag({ posts }: any) {
  return (
    <Container>
      <Button href={`/blog`} variant="outlined">Go back</Button>
      <Typography variant="h4">search results:</Typography>

      {(posts) ? posts.map((post: any, index: any) => (
        <Grid key={index} marginBottom={4} marginTop={4}>
          <CardPost key={index} post={post.post} />
        </Grid>)) : (
        <p>No posts found!</p>
      )}
    </Container>
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
