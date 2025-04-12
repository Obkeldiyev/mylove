import { Router } from "express";
import adminRoutes from "./admin";
import wishRoutes from "./wishes";
import noteRoutes from "./notes";
import { mainPage } from "src/controllers/main.page.controller";

const router: Router = Router();

router.get("/", mainPage.get)
router.use(adminRoutes);
router.use(wishRoutes);
router.use(noteRoutes);

export default router;