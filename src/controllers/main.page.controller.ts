import { ErrorHandler } from "../middlewares/errorHandler.middleware";
import { Admin, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
dotenv.config();

const client = new PrismaClient();

export class mainPage {
    static async get(req: Request, res: Response, next: NextFunction){
        try {
            res.render("index")
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
    static async getUs(req: Request, res: Response, next: NextFunction){
        try {
            res.render("main")
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status))
        }
    }
}