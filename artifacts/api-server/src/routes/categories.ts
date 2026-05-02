import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, toolsTable } from "@workspace/db";
import {
  ListCategoriesResponse,
  GetCategoryBySlugParams,
  GetCategoryBySlugResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      toolCount: sql<number>`cast(count(${toolsTable.id}) as int)`,
    })
    .from(categoriesTable)
    .leftJoin(toolsTable, eq(toolsTable.category, categoriesTable.slug))
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.name);

  res.json(ListCategoriesResponse.parse(rows));
});

router.get("/categories/:slug", async (req, res): Promise<void> => {
  const params = GetCategoryBySlugParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      toolCount: sql<number>`cast(count(${toolsTable.id}) as int)`,
    })
    .from(categoriesTable)
    .leftJoin(toolsTable, eq(toolsTable.category, categoriesTable.slug))
    .where(eq(categoriesTable.slug, params.data.slug))
    .groupBy(categoriesTable.id);

  if (!row) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json(GetCategoryBySlugResponse.parse(row));
});

export default router;
