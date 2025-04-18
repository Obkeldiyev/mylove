import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { upload } from "src/config/multer";

const chatRoutes = Router();

chatRoutes.get("/chat", verifyToken, upload.single("file"), ChatController.getChatPage);

export default chatRoutes;
