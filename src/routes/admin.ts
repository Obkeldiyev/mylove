import { Router } from "express";
import { AdminAuthController } from "../controllers/admin.auth.controller";
import { AdminController } from "../controllers/admin.controller";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken } from "../middlewares/verifyToken";

const uploadDir = path.join(process.cwd(), "src", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!') as unknown as null, false);
    }
  },
});


const adminRoutes: Router = Router();

adminRoutes.get('/login', AdminAuthController.getLoginPage);
adminRoutes.post("/login", AdminAuthController.login);
adminRoutes.get("/profile", verifyToken, AdminController.getProfile);
adminRoutes.get("/all", verifyToken, AdminController.getAllAdmins);
adminRoutes.get("/update", verifyToken, AdminController.getUpdateProfilePage);
adminRoutes.get("/create", AdminController.getCreateAdminPage);
adminRoutes.post("/create", upload.single("photo"), AdminController.createAdmin);
adminRoutes.post("/update", verifyToken, upload.single("photo"), AdminController.updateProfile);

export default adminRoutes;