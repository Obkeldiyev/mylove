import { ErrorHandler } from "@errors";
import { Admin, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
dotenv.config();

const client = new PrismaClient();

export class AdminController {
    static async getCreateAdminPage(req: Request, res: Response, next: NextFunction){
        try {
            res.render("admin/create");
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status || 500));
        }
    }

    static async createAdmin(req: Request, res: Response, next: NextFunction){
        try {
            const { first_name, second_name, username, password, birth_year, birth_month, birth_day, about } = req.body;
            const profile_photo = req.file?.filename || null;

            const checkAdmin = await client.admin.findUnique({
                where: {
                    username,
                }
            });

            if(checkAdmin){
                req.flash("error", "This username has been taken");
                res.redirect("/create");
            }else{
                await client.admin.create({
                    data: {
                        first_name,
                        second_name,
                        username,
                        password,
                        profile_photo,
                        birth_year: Number(birth_year),
                        birth_month,
                        birth_day: Number(birth_day),
                        about
                    }
                });

                req.flash("success", "The admin created successfully");
                res.redirect("/");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status || 500));
        }
    }

    static async getAllAdmins(req: Request, res: Response, next: NextFunction){
        try {
            const admins = await client.admin.findMany();

            req.flash("success", "Successfulyy");
            res.render("admin/all", { admins });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status || 500))
        }
    }

    static async getProfile(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const checkAdmin = await client.admin.findUnique({
                where: {
                    id: data.id,
                }
            });

            if(checkAdmin){
                req.flash("success", "Your profile");
                res.render("admin/profile", {checkAdmin});
            }else{
                req.flash("error", "Token required or you does not existng");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getUpdateProfilePage(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = await verify(token, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(admin){
                res.render("admin/update", { admin });
            }else{
                req.flash("error", "This admin does not exists");
                res.redirect("/");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async updateProfile(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;
            const { first_name, second_name, username, password, birth_year, birth_month, birth_day, about } = req.body;
            const profile_photo = req.file?.filename || null;
            
            const data: any = verify(token, process.env.SECRET_KEY as string);

            const profile = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(profile){
                if(profile.username === username){
                    await client.admin.update({
                        where: {
                            id: profile.id
                        },
                        data: {
                            first_name,
                            second_name,
                            username,
                            password,
                            birth_year,
                            birth_month,
                            birth_day,
                            about,
                            profile_photo,
                        }
                    });

                    req.flash("success", "Profile updated successfully");
                    res.redirect("/profile");
                }else{
                    req.flash("error", "Something went wrong");
                    res.redirect("/login");
                }
            }else{
                req.flash("error", "This profile does not exists");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}