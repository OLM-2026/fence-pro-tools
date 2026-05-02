import { Router, type IRouter } from "express";
import { eq, ilike, and, desc, sql } from "drizzle-orm";
import { db, toolsTable, submissionsTable } from "@workspace/db";
import {
  ListToolsQueryParams,
  ListToolsResponse,
  GetFeaturedToolsResponse,
  GetNewToolsResponse,
  GetToolBySlugParams,
  GetToolBySlugResponse,
  CompareToolsParams,
  CompareToolsResponse,
  GetStatsResponse,
  SubmitToolBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function serializeTool(row: typeof toolsTable.$inferSelect) {
  return {
    ...row,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}

router.get("/tools", async (req, res): Promise<void> => {
  const query = ListToolsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category, search, featured, isNew, bestFor, freeTrial, mobileApp } = query.data;

  const conditions = [];
  if (category) conditions.push(eq(toolsTable.category, category));
  if (search) conditions.push(ilike(toolsTable.name, `%${search}%`));
  if (featured !== undefined) conditions.push(eq(toolsTable.featured, featured));
  if (isNew !== undefined) conditions.push(eq(toolsTable.isNew, isNew));
  if (bestFor) conditions.push(eq(toolsTable.bestFor, bestFor));
  if (freeTrial !== undefined) conditions.push(eq(toolsTable.freeTrial, freeTrial));
  if (mobileApp !== undefined) conditions.push(eq(toolsTable.mobileApp, mobileApp));

  const rows = await db
    .select()
    .from(toolsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(toolsTable.featured), toolsTable.name);

  res.json(ListToolsResponse.parse(rows.map(serializeTool)));
});

router.get("/tools/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(toolsTable)
    .where(eq(toolsTable.featured, true))
    .orderBy(toolsTable.name)
    .limit(6);

  res.json(GetFeaturedToolsResponse.parse(rows.map(serializeTool)));
});

router.get("/tools/new", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(toolsTable)
    .where(eq(toolsTable.isNew, true))
    .orderBy(desc(toolsTable.createdAt))
    .limit(6);

  res.json(GetNewToolsResponse.parse(rows.map(serializeTool)));
});

router.get("/stats", async (_req, res): Promise<void> => {
  const [totals] = await db
    .select({
      totalTools: sql<number>`cast(count(*) as int)`,
      featuredTools: sql<number>`cast(sum(case when ${toolsTable.featured} = true then 1 else 0 end) as int)`,
    })
    .from(toolsTable);

  const categoryBreakdown = await db
    .select({
      category: toolsTable.category,
      count: sql<number>`cast(count(*) as int)`,
    })
    .from(toolsTable)
    .groupBy(toolsTable.category)
    .orderBy(desc(sql`count(*)`));

  const [categoryCount] = await db
    .select({ total: sql<number>`cast(count(distinct ${toolsTable.category}) as int)` })
    .from(toolsTable);

  res.json(
    GetStatsResponse.parse({
      totalTools: totals?.totalTools ?? 0,
      totalCategories: categoryCount?.total ?? 0,
      featuredTools: totals?.featuredTools ?? 0,
      categoryBreakdown,
    })
  );
});

router.get("/compare/:slug1/:slug2", async (req, res): Promise<void> => {
  const params = CompareToolsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [tool1] = await db.select().from(toolsTable).where(eq(toolsTable.slug, params.data.slug1));
  const [tool2] = await db.select().from(toolsTable).where(eq(toolsTable.slug, params.data.slug2));

  if (!tool1 || !tool2) {
    res.status(404).json({ error: "One or both tools not found" });
    return;
  }

  res.json(CompareToolsResponse.parse({ tool1: serializeTool(tool1), tool2: serializeTool(tool2) }));
});

router.get("/tools/:slug", async (req, res): Promise<void> => {
  const params = GetToolBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(toolsTable)
    .where(eq(toolsTable.slug, params.data.slug));

  if (!row) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  res.json(GetToolBySlugResponse.parse(serializeTool(row)));
});

router.post("/submissions", async (req, res): Promise<void> => {
  const parsed = SubmitToolBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [submission] = await db
    .insert(submissionsTable)
    .values(parsed.data)
    .returning();

  res.status(201).json({
    ...submission,
    createdAt: submission.createdAt instanceof Date ? submission.createdAt.toISOString() : submission.createdAt,
  });
});

export default router;
