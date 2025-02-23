import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditPage({
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

  async function updatePost(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await db
      .update(posts)
      .set({ title, content, updatedAt: new Date() })
      .where(eq(posts.id, post.id));
    revalidatePath("/");
    redirect("/");
  }

  return (
    <div>
      <Link
        href={`/post/${post.id}`}
        className="text-blue-500 mb-4 inline-block"
      >
        &larr; Back to post
      </Link>
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form action={updatePost}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Title
          </label>
          <input
            type="text"
            required
            name="title"
            id="title"
            defaultValue={post.title}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2">
            Content
          </label>
          <textarea
            name="content"
            id="content"
            className="w-full p-2 border rounded"
            required
            rows={5}
            defaultValue={post.content}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Update Post
        </button>
      </form>
    </div>
  );
}
