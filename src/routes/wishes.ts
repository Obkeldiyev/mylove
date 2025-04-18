import { Router } from "express"
import { WishesController } from "../controllers/wishes.controller";
import { verifyToken } from "../middlewares/verifyToken";

const wishRoutes: Router = Router();

wishRoutes.get("/wishes", WishesController.getAllWishes);
wishRoutes.get("/wishes/create", verifyToken, WishesController.getCreateWishPage);
wishRoutes.post("/wishes/create", verifyToken, WishesController.createWishes);
wishRoutes.get("/wishes/:id", verifyToken, WishesController.getOneWish);
wishRoutes.get("/wishes/update/:id", verifyToken, WishesController.getUpdateWishPage);
wishRoutes.post("/wishes/update/:id", verifyToken, WishesController.updateWish);
wishRoutes.post("/wishes/delete/:id", verifyToken, WishesController.deleteWish);

export default wishRoutes;