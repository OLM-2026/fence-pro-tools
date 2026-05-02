import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, blogPostsTable, subscribersTable } from "@workspace/db";
import {
  ListBlogPostsResponse,
  GetBlogPostParams,
  GetBlogPostResponse,
  SubscribeBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializePost(row: typeof blogPostsTable.$inferSelect) {
  return {
    ...row,
    publishedAt: row.publishedAt instanceof Date ? row.publishedAt.toISOString() : row.publishedAt,
  };
}

router.get("/blog", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(blogPostsTable)
    .orderBy(blogPostsTable.publishedAt);

  res.json(ListBlogPostsResponse.parse(rows.map(serializePost)));
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, params.data.slug));

  if (!row) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(GetBlogPostResponse.parse(serializePost(row)));
});

router.post("/subscribe", async (req, res): Promise<void> => {
  const parsed = SubscribeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [subscriber] = await db
      .insert(subscribersTable)
      .values(parsed.data)
      .onConflictDoNothing()
      .returning();

    if (!subscriber) {
      res.status(201).json({ id: 0, email: parsed.data.email, createdAt: new Date().toISOString() });
      return;
    }

    res.status(201).json({
      ...subscriber,
      createdAt: subscriber.createdAt instanceof Date ? subscriber.createdAt.toISOString() : subscriber.createdAt,
    });
  } catch {
    res.status(400).json({ error: "Invalid email" });
  }
});

export default router;
