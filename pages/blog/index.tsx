import React from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import CardPost from '../../components/CardPost';
import { sortByDate } from '../../utils';
import { Container, Grid } from '@mui/material';

export default function Home({ posts }: any) {
  return (
    <>
      {(posts) ? posts.map((post: any, index: any) => (
        <Grid key={index} marginBottom={4} marginTop={4}>
          <CardPost key={index} post={post.frontmatter} slug={post.slug} />
        </Grid>)) : (
        <p>No posts yet!</p>
      )}
    </>
  );
}

export async function getStaticProps() {
  // Get files from the posts dir
  const files = fs.readdirSync(path.join('posts'));
  // Get slug and frontmatter from posts
  const tempPosts = files.map(filename => {
    // Create slug
    const slug = filename.replace('.md', '');
    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(path.join('posts', filename), 'utf-8');
    let { data: frontmatter } = matter(markdownWithMeta);
    frontmatter.slug = slug;
    if (!frontmatter.draft || frontmatter.draft === false) {
      return {
        slug,
        frontmatter
      };
    } else {
      return null;
    }
  });
  //  remove null in tempPosts
  const posts = tempPosts.filter(post => {
    return post && post;
  });
  // const jsonString = JSON.stringify(posts)
  // fs.writeFileSync('./search.json', jsonString, err => {
  //   if (err) {
  //     console.log('Error writing file', err)
  //   } else {
  //     console.log('Successfully wrote file')
  //   }
  // })
  return {
    props: {
      posts: posts.sort(sortByDate)
    }
  };
}
