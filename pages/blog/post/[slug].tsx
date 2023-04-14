import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Button from "@mui/material/Button";
import { Container } from "@mui/material";
import PostContentCard from "../../../components/PostContentCard";

interface PostPageProps {
  frontmatter: {
    [key: string]: any;
  };
  content: string;
}

export default function PostPage({ content, frontmatter }: PostPageProps) {
  const date = new Date(frontmatter.date);

  return (
    <Container>
      <Button href={`/blog`} variant="outlined">
        Go back
      </Button>
      <PostContentCard content={content} frontmatter={frontmatter} />
    </Container>
  );
}

export async function getStaticPaths() {
  //  Get files from the posts dir
  const files = fs.readdirSync(path.join("posts"));

  // Get slug and frontmatter from posts
  const temppaths = files.map((filename) => {
    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join("posts", filename),
      "utf-8"
    );

    const { data: frontmatter } = matter(markdownWithMeta);

    if (!frontmatter.draft || frontmatter.draft === false) {
      return {
        params: {
          slug: filename.replace(".md", ""),
        },
      };
    } else {
      return null;
    }
  });
  //   remove null in tempPosts
  const paths = temppaths.filter((path) => {
    return path && path;
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }: any) {
  const markdownWithMeta = fs.readFileSync(
    path.join("posts", slug + ".md"),
    "utf-8"
  );

  let { data: frontmatter, content } = matter(markdownWithMeta);
  frontmatter.slug = slug;

  return {
    props: {
      frontmatter,
      slug,
      content,
    },
  };
}
