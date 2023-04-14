import { useEffect } from "react";
import Image from "next/image";
import { marked } from "marked";
import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import { slugify } from "../../utils";
import markdownStyles from "./markdown.module.scss"
import DateFormatter from "../DateFromatter";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

interface PostContentCardProps {
  frontmatter: {
    [key: string]: any;
  };
  content: string;
}

export default function PostContentCard({
  frontmatter,
  content,
}: PostContentCardProps) {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll("[class^='language-']");
    codeBlocks.forEach(
      (el) =>
        hljs.highlightElement(el as HTMLElement)
    );
  }, []);

  return (
    <div className="card card-page">
      <Typography gutterBottom variant="h3" component="div">
        {frontmatter.title}
      </Typography>
      <Typography gutterBottom variant="h6" component="div">
        {frontmatter.categories
          ? `Categories: ` + frontmatter.categories.join(", ")
          : ""}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        <DateFormatter dateString={frontmatter.date} /> by{" "}
        {frontmatter.author}
      </Typography>
      <div className="post-image">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            sx={{
              height: 250,
              width: { xs: "100%", md: "50%" },
              position: "relative",
              margin: { xs: 1, md: 5 },
            }}
          >
            <Image
              src={
                frontmatter?.image
                  ? frontmatter.image
                  : "/assets/images/logo.jpg"
              }
              alt=""
              fill
              objectFit="contain"
            />
          </Box>
        </Box>
      </div>
      <Stack direction="row" spacing={1}>
        {frontmatter.tags
          ? frontmatter.tags.map((tag: string) => {
              const slug = slugify(tag);

              return (
                <Link key={tag} href={`/tag/${slug}`}>
                  <Chip variant="outlined" clickable={true} label={`#${tag}`} />
                </Link>
              );
            })
          : "no tags"}
      </Stack>

      <div
        className={`'post-body' ${markdownStyles['markdown']}`}
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      ></div>
    </div>
  );
}
