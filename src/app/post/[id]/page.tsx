import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function DetailPost({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number.parseInt(id)))
    .then((res) => res[0]);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <Link href="/" className="text-blue-500 mb-4 inline-block">
        &larr; Back to all posts
      </Link>
      <article>
        <h1>{post.title}</h1>
        <p className="text-gray-600">
          Published on {new Date(post.createdAt).toLocaleDateString()}
          {post.updatedAt > post.createdAt &&
            ` (Updated on ${new Date(post.updatedAt).toLocaleDateString()})`}
        </p>
        <p>{post.content}</p>
      </article>
      <div className="mt-2">
        <Link href={`/edit/${post.id}`} className="text-blue-500 mr-2">
          Edit
        </Link>
        <Link href={`/delete/${post.id}`} className="text-red-500">
          Delete
        </Link>
      </div>
    </div>
  );
}
