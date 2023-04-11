import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Link from 'next/link'
import { slugify } from '../../../utils'
import Image from 'next/image'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { Box, Container, Stack, Typography } from '@mui/material'

export default function PostPage({ content, frontmatter }: any) {
  const date = new Date(frontmatter.date)

  return (
    <Container>
      <Button href={`/blog`} variant="outlined">Go back</Button>

      <div className='card card-page'>
        <Typography gutterBottom variant="h3" component="div">
          {frontmatter.title}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {(frontmatter.categories) ? (`Categories: ` + frontmatter.categories.join(', ')) : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`} by {frontmatter.author}
        </Typography>
        <div className='post-image'>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center">
            <Image
              src={(frontmatter?.image) ? frontmatter.image : '/assets/images/logo.jpg'}
              alt=""
              width="250"
              height="250"
            />
          </Box>
        </div>
        <Stack direction="row" spacing={1}>
          {(frontmatter.tags) ?
            frontmatter.tags.map(
              (tag: string) => {
                const slug = slugify(tag)

                return (
                  <Link key={tag} href={`/tag/${slug}`}>
                    <Chip variant="outlined" clickable={true} label={`#${tag}`} />
                  </Link>
                )
              }
            ) : 'no tags'
          }
        </Stack>

        <div className='post-body' dangerouslySetInnerHTML={{ __html: marked.parse(content) }}></div>
      </div>
    </Container>
  )
}


export async function getStaticPaths() {
  //  Get files from the posts dir
  const files = fs.readdirSync(path.join('posts'))

  // Get slug and frontmatter from posts
  const temppaths = files.map((filename) => {

    // Get frontmatter
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8'
    )

    const { data: frontmatter } = matter(markdownWithMeta)

    if (!frontmatter.draft || frontmatter.draft === false) {
      return {
        params: {
          slug: filename.replace('.md', ''),
        },
      }
    } else {
      return null
    }

  })
  //   remove null in tempPosts 
  const paths = temppaths.filter(
    path => {
      return path && path
    }
  )

  return {
    paths,
    fallback: false,
  }
}


export async function getStaticProps({ params: { slug } }: any) {
  const markdownWithMeta = fs.readFileSync(
    path.join('posts', slug + '.md'),
    'utf-8'
  )

  let { data: frontmatter, content } = matter(markdownWithMeta)
  frontmatter.slug = slug;

  return {
    props: {
      frontmatter,
      slug,
      content,
    },
  }
}