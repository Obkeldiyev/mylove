import { Router } from "express";
import adminRoutes from "./admin";
import wishRoutes from "./wishes";
import noteRoutes from "./notes";
import { mainPage } from "src/controllers/main.page.controller";
import diaryRoutes from "./diary";
import chatRoutes from "./chat";

const router: Router = Router();

router.get("/", mainPage.get)
router.get("/us", mainPage.getUs)
router.use(adminRoutes);
router.use(wishRoutes);
router.use(noteRoutes);
router.use(diaryRoutes);
router.use(chatRoutes)

export default router;