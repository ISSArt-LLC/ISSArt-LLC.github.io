import { useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import { slugify } from "../../utils";
import markdownStyles from "./markdown.module.scss"
import DateFormatter from "../DateFromatter";
import 'highlight.js/styles/github.css';
import Highlight from 'react-highlight'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

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
              style={{objectFit:"contain"}}
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

      <div className={`'post-body' ${markdownStyles['markdown']}`}>
        <ReactMarkdown
          // eslint-disable-next-line react/no-children-prop
          children={content}
          components={{
            p: (paragraph: { children?: any; node?: any; }) => {
              const { node } = paragraph

              if (node.children[0].tagName === "img") {
                const image = node.children[0]
                const metastring = image.properties.alt
                const alt = metastring?.replace(/ *\{[^)]*\} */g, "")
                const metaWidth = metastring.match(/{([^}]+)x/)
                const metaHeight = metastring.match(/x([^}]+)}/)
                const width = metaWidth ? metaWidth[1] : "768"
                const height = metaHeight ? metaHeight[1] : "432"
                const isPriority = metastring?.toLowerCase().match('{priority}')

                return (
                  <Zoom>
                    <Image
                      src={image.properties.src}
                      width={width}
                      height={height}
                      className="post-img"
                      alt={(alt) ? alt : ''}
                      priority={isPriority}
                    />
                  </Zoom>
                )
              }
              return <p>{paragraph.children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <Highlight className={match[1]}>
                  {String(children).replace(/\n$/, '')}
                </Highlight>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              )
            }
          }}
        />
      </div>
    </div>

  );
}
