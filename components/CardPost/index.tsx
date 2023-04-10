import Link from 'next/link'
import { slugify } from '../../utils'
import Image from 'next/image'
import { Button, Chip } from '@mui/material'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function CardPost({ post }: any) {

  const date = new Date(post.frontmatter?.date)
  return (
    <>
      <Image
        src={(post.frontmatter?.image) ? post.frontmatter.image : '/assets/images/logo.jpg'}
        alt=""
        width="250"
        height="250"
      />
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {post.frontmatter.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`${date.getFullYear()} - ${date.getMonth() + 1} - ${date.getDate()} - `} by {post.frontmatter.author}
          </Typography>
          <p>
            {
              (post.frontmatter.tags) ?
                post.frontmatter.tags.map(
                  (tag: string) => {

                    const slug = slugify(tag)

                    return (
                      <Link key={tag} href={`/tag/${slug}`}>
                        <Chip variant="outlined" clickable={true} label={`#${tag}`} />
                      </Link>
                    )
                  }
                ) : ''
            }
          </p>
          <p>
            {(post.frontmatter.categories) ? <p>categories: {post.frontmatter.categories.join()}</p> : ''}
          </p>
        </CardContent>
        <CardActions>
          <Button href={`/blog/post/${post.slug}`} variant="outlined">Read More</Button>
        </CardActions>
      </Card>
    </>
  );
}
