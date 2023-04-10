import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import Link from 'next/link'
import { slugify } from '../../../utils'
import Image from 'next/image'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'

export default function PostPage({ content, frontmatter }: any) {
  const date = new Date(frontmatter.date)

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-10 m-auto">
            <Button href={`/blog/`} variant="outlined">Go back</Button>

            <div className='card card-page'>
              <Image
                src={(frontmatter?.image) ? frontmatter.image : '/assets/images/logo.jpg'}
                alt=""
                width="250"
                height="250"
              />
              <h1 className='post-title'>{frontmatter.title}</h1>
              <div className="small text-muted">{`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`} by {frontmatter.author}</div>

              {(frontmatter.categories) ? <p>categories: {frontmatter.categories.join()}</p> : ''}
              <div className='post-date'>

                <div> {
                  (frontmatter.tags) ?
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
                } </div>
              </div>

              <div className='post-body' dangerouslySetInnerHTML={{ __html: marked.parse(content) }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
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

  // console.log("paths", paths)

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

  const { data: frontmatter, content } = matter(markdownWithMeta)

  return {
    props: {
      frontmatter,
      slug,
      content,
    },
  }
}