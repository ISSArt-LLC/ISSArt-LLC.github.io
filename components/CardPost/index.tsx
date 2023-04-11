import Link from 'next/link'
import { slugify } from '../../utils'
import Image from 'next/image'
import { Avatar, Box, Button, Chip, Stack } from '@mui/material'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function CardPost({ post }: any) {

  const date = new Date(post.date)
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h4" component="div">
          {post.title}
        </Typography>
        <Typography gutterBottom variant="h6" component="div">
          {(post.categories) ? (`Categories: ` + post.categories.join(', ')) : ''}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`} by {post.author}
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center">
          <Link href={`/blog/post/${post.slug}`}>
            <Image
              src={(post.image) ? post.image : '/assets/images/logo.jpg'}
              alt=""
              width="250"
              height="250"
            />
          </Link>
        </Box>
        <Stack direction="row" spacing={1}>
          {
            (post.tags) ?
              post.tags.map(
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
        </Stack>
      </CardContent>
      <CardActions>
        <Button href={`/blog/post/${post.slug}`}>Read More</Button>
      </CardActions>
    </Card>
  );
}
