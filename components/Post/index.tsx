import Link from 'next/link'
import { slugify } from '../../utils'
import Image from 'next/image'

export default function Post({ post }: any) {

  const date = new Date(post.frontmatter?.date)
  return (
    <div className="card mb-4">
      <h2 className="card-title">{post.frontmatter.title}</h2>
      <Link href={`/blog/post/${post.slug}`} >
        <Image
          src={post.frontmatter?.image}
          alt=""
          width="500"
          height="500"
        />
      </Link>

      <div className="card-body">
        <div className="small text-muted">{`${date.getMonth() + 1} - ${date.getDate()} - ${date.getFullYear()}`}</div>

        <div> {
          post.frontmatter.categories.map(
            (tag: string) => {

              const slug = slugify(tag)

              return (
                <Link key={tag} href={`/tag/${slug}`}>
                  <h6 className=' post-title'>#{tag}</h6>
                </Link>
              )
            }
          )
        } </div>

        <p className="card-text">{post.frontmatter.author}</p>
        <Link href={`/blog/post/${post.slug}`}>
        Read More
        </Link>
      </div>
    </div>
  )
}