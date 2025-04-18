import { Router } from "express";
import { DiaryController } from "src/controllers/diary.controller";
import { verifyToken } from "src/middlewares/verifyToken";

const diaryRoutes: Router = Router();

diaryRoutes.get("/diary", verifyToken, DiaryController.getAllDiary);
diaryRoutes.get("/diary/my", verifyToken, DiaryController.getMyDiary);
diaryRoutes.get("/diary/create", verifyToken, DiaryController.getCreateDiaryPage);
diaryRoutes.post("/diary/create", verifyToken, DiaryController.createDiary);
diaryRoutes.get("/diary/update/:id", verifyToken, DiaryController.getUpdateDiaryPage);
diaryRoutes.get("/diary/:id", verifyToken, DiaryController.getOneDiary);
diaryRoutes.post("/diary/update/:id", verifyToken, DiaryController.updateDiary);
diaryRoutes.post("/diary/delete/:id", verifyToken, DiaryController.deleteDiary);

export default diaryRoutes;