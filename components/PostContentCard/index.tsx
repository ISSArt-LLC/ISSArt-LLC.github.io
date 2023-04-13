import Image from "next/image";
import { marked } from "marked";
import { Box, Chip, Link, Stack, Typography } from "@mui/material";
import { slugify } from "../../utils";

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
  const date = new Date(frontmatter.date);

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
        {`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`} by{" "}
        {frontmatter.author}
      </Typography>
      <div className="post-image">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            sx={{
              height: 250,
              width: { xs: "100%", md: "50%" },
              position: "relative",
              margin: 5,
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
        className="post-body"
        dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
      ></div>
    </div>
  );
}
