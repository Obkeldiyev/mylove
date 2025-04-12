import { ErrorHandler } from "@errors";
import { Admin, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
dotenv.config();

const client = new PrismaClient();

export class WishesController {
    static async getAllWishes(req: Request, res: Response, next: NextFunction){
        try {
            const wishes = await client.wishes.findMany();

            req.flash("success", "All wishes");

            res.render("wishes/all", { wishes });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getCreateWishPage(req: Request, res: Response, next: NextFunction){
        try {
            res.render("wishes/create");
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async createWishes(req: Request, res: Response, next: NextFunction){
        try {
            const { title, description } = req.body;

            await client.wishes.create({
                data: {
                    title,
                    description
                }
            });

            req.flash("success", "The wish created successfully");
            res.redirect("/wishes");
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }

    static async getOneWish(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.params;

            const wish = await client.wishes.findUnique({
                where: {
                    id: Number(id),
                }
            });

            if(wish){
                req.flash("success", "Wish found");
                res.render("wishes/one", {wish});
            }else{
                req.flash("error", "The wish not found");
                res.redirect("/wishes");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getUpdateWishPage(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.params;

            const wish = await client.wishes.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if(wish){
                res.render("wishes/update", { wish });
            }else{
                req.flash("error", "This wish not found");
                res.redirect("/wishes");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async updateWish(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            const checkWish = await client.wishes.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if(checkWish){
                await client.wishes.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        title,
                        description
                    }
                });

                req.flash("success", "The wish updated successfully");
                res.redirect(`/wishes/${id}`);
            }else{
                req.flash("error", "This wish not found");
                res.redirect("/wishes");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async deleteWish(req: Request, res: Response, next: NextFunction){
        try {
            const { id } = req.params;

            const checkWish = await client.wishes.findUnique({
                where: {
                    id: Number(id)
                }
            });

            if(checkWish){
                await client.wishes.delete({
                    where: {
                        id: Number(id)
                    }
                });

                req.flash("success", "The wish deleted successfully");
                res.redirect("/wishes");
            }else{
                req.flash("error", "This wish does not exists");
                res.redirect("/wishes");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}