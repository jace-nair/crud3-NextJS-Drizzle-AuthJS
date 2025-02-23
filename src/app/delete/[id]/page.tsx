import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DeletePage({
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

  const deletePost = async () => {
    "use server";
    await db.delete(posts).where(eq(posts.id, post.id));
    revalidatePath("/");
    redirect("/");
  };

  return (
    <div>
      <Link
        href={`/post/${post.id}`}
        className="text-blue-500 mb-4 inline-block"
      >
        &larr; Back to post
      </Link>
      <h1 className="text-2xl font-bold mb-4">Delete Post</h1>
      <p>
        Are you sure you want to delete the post{" "}
        <span className="font-bold underline">{post.title}</span>?
      </p>
      <form action={deletePost}>
        <button
          type="submit"
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Delete Post
        </button>
      </form>
    </div>
  );
}
