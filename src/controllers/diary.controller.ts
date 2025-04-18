import { ErrorHandler } from "../middlewares/errorHandler.middleware";
import { Admin, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
dotenv.config();

const client = new PrismaClient();

export class DiaryController {
    static async getMyDiary(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const checkAdmin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(checkAdmin){
                const diary = client.diary.findMany({
                    where: {
                        adminId: data.id
                    }
                });

                req.flash("success", "Your diary My heart");
                res.render("diary/mine", { diary });
            }else{
                req.flash("error", "Your token is required");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getAllDiary(req: Request, res: Response, next: NextFunction){
        try {
            const diary = await client.diary.findMany();

            req.flash("success", "All diary");
            res.render("diary/all", { diary });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }
    
    static async getCreateDiaryPage(req: Request, res: Response, next: NextFunction){
        try {
            req.flash("success", "Create diary page");
            res.render("diary/create");
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getOneDiary(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.params;

            const diary = await client.diary.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if(diary){
                req.flash("success", "Your day Jonim");
                res.render("diary/one", { diary });
            }else{
                req.flash("error", "This diary does not exists");
                res.redirect("/diary");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async createDiary(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;
            const { title, content, ranking } = req.body;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(admin){
                await client.diary.create({
                    data: {
                        title,
                        content,
                        ranking: Number(ranking),
                        adminId: admin.id
                    }
                });

                req.flash("success", "The day addedd successfully");
                res.redirect("/diary");
            }else{
                req.flash("error", "Token is required please login again");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getUpdateDiaryPage(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;
            const { id } = req.params;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(admin){
                const diary = await client.diary.findUnique({
                    where: {
                        id: Number(id)
                    }
                });

                if(diary){
                    req.flash("success", "Your day");
                    res.render("diary/update", { diary });
                }else{
                    req.flash("error", "This diary does not exists");
                    res.redirect(`/diary`);
                }
            }else{
                req.flash("error", "Token required please login again");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status || 500));
        }
    }

    static async updateDiary(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;
            const { title, content, ranking } = req.body;
            const { id } = req.params;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(admin){
                const diary = await client.diary.findUnique({
                    where: {
                        id: Number(id)
                    }
                });

                if(diary){
                    if(diary.adminId === admin.id){
                        await client.diary.update({
                            where: {
                                id: Number(id)
                            },
                            data: {
                                title,
                                content,
                                ranking: Number(ranking)
                            }
                        });
    
                        req.flash("success", "The day updated successfully");
                        res.redirect(`/diary/${id}`)
                    }else{
                        req.flash("error", "You don't have access to that");
                        res.redirect(`/diary/${diary.id}`)
                    }
                }else{
                    req.flash("error", "This diary does not exists");
                    res.redirect("/diary");
                }
            }else{
                req.flash("error", "Your token required please login again");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async deleteDiary(req: Request, res: Response, next: NextFunction){
        try {
            const { token } = req.cookies;
            const { id } = req.params;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const admin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(admin){
                const diary = await client.diary.findUnique({
                    where: {
                        id: Number(id)
                    }
                })

                if(diary){
                    if(diary.adminId === admin.id){
                        await client.diary.delete({
                            where: {
                                id: Number(id)
                            }
                        });

                        req.flash("success", "This day deleted successfully");
                        res.redirect("/diary");
                    }else{
                        req.flash("error", "You don't have access to delete this diary");
                        res.redirect(`/diary/${diary.id}`)
                    }
                }else{
                    req.flash("error", "This diary does not exists");
                    res.redirect("/diary");
                }
            }else{
                req.flash("error", "Token required please login again");
                res.redirect("/login");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}