import Link from "next/link";
export default function ItemPost({ post: { post } }: any) {
  const date = new Date(post.date);
  return (
    <div className="card mb-4">
      <h2 className="card-title">{post.title}</h2>
      <a href={`/blog/post/${post.slug}`}>
        {" "}
        <img className="card-img-top" src={post.image} height="100px" width="100px" alt={post.title} />
      </a>
      <div className="card-body">
        <div className="small text-muted">{`${date.getMonth() + 1} - ${date.getDate()} - ${date.getFullYear()}`}</div>

        <p className="card-text">{post.author}</p>
        <Link href={`/blog/post/${post.slug}`}>
          Read More
        </Link>
      </div>
    </div>
  );
}
