import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import toolsRouter from "./tools";
import blogRouter from "./blog";
import sitemapRouter from "./sitemap";

const router: IRouter = Router();

router.use(healthRouter);
router.use(categoriesRouter);
router.use(toolsRouter);
router.use(blogRouter);
router.use(sitemapRouter);

export default router;
