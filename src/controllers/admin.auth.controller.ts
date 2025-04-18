import { ErrorHandler } from "../middlewares/errorHandler.middleware";
import { Admin, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
dotenv.config();

const client = new PrismaClient();

export class AdminAuthController {
    static async getLoginPage(req: Request, res: Response, next: NextFunction){
        try {
            res.render("admin/login");
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status || 500));
        }
    }

    static async login(req: Request, res: Response, next: NextFunction){
        try {
            res.clearCookie("token");
            const { username, password } = req.body;

            const checkAdmin = await client.admin.findUnique({
                where: {
                    username,
                    password
                }
            });

            if(checkAdmin){
                if(checkAdmin.password === password){
                    const token = sign({ id: checkAdmin.id, role: 'admin' }, process.env.SECRET_KEY as string, { expiresIn: "24h" });

                    res.cookie("token", token);
                    req.flash("success", "Welcome back Hayotim");
                    res.redirect("/profile");
                }else{
                    req.flash("error", "Wrong password");
                    res.redirect("/login");
                }
            }else{
                req.flash("error", "Username or password is wrong");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status || 500));
        }
    }
}