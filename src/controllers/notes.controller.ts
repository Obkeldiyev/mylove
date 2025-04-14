import { ErrorHandler } from "@errors";
import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

const client = new PrismaClient();

export class NotesController {
    static async getAllNotes(req: Request, res: Response, next: NextFunction) {
        try {
            const notes = await client.notes.findMany({
                include: {
                    written_by: true,
                    written_for: true
                }
            });

            req.flash("success", "All notes");
            res.render("notes/all", { notes });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getOneNote(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { token } = req.cookies;
            
            const noted = await client.notes.findUnique({
                where: {
                    id: Number(id)
                },
                include: {
                    written_for: true
                }
            })

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const checkAdmin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            })

            if(checkAdmin){
                if(checkAdmin.id === noted?.written_for.id){
                    const note = await client.notes.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            seen: true
                        },
                        include: {
                            written_by: true,
                            written_for: true
                        }
                    });
        
                    if (note) {
                        req.flash("success", "Note viewed");
                        res.render("notes/one", { note });
                    } else {
                        req.flash("error", "Note not found");
                        res.redirect("/notes");
                    }
                }else{
                    const note = await client.notes.update({
                        where: {
                            id: Number(id)
                        },
                        data: {
                            seen: false
                        },
                        include: {
                            written_by: true,
                            written_for: true
                        }
                    });
        
                    if (note) {
                        req.flash("success", "Note viewed");
                        res.render("notes/one", { note });
                    } else {
                        req.flash("error", "Note not found");
                        res.redirect("/notes");
                    }
                }
            }else{
                req.flash("error", "Admin not found");
                res.redirect("/")
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getCreateNotePage(req: Request, res: Response, next: NextFunction) {
        try {
            const admins = await client.admin.findMany();
            res.render("notes/create", { admins });
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async createNote(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.cookies;
            const { title, content, written_for_id } = req.body;

            const data: any = verify(token, process.env.SECRET_KEY as string);

            const checkAdmin = await client.admin.findUnique({
                where: {
                    id: data.id
                }
            });

            if(checkAdmin){
                await client.notes.create({
                    data: {
                        title,
                        content,
                        written_by_id: checkAdmin.id,
                        written_for_id
                    }
                });
    
                req.flash("success", "Note created successfully");
                res.redirect("/notes");
            }else{
                req.flash("error", "Your token required");
                res.redirect("/")
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async getUpdateNotePage(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const note = await client.notes.findUnique({
                where: { id: Number(id) }
            });

            const admins = await client.admin.findMany();

            if (note) {
                res.render("notes/update", { note, admins });
            } else {
                req.flash("error", "Note not found");
                res.redirect("/notes");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async updateNote(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.cookies;
            
            const data: any = verify(token, process.env.SECRET_KEY as string);

            const { id } = req.params;
            const { title, content, written_by_id, written_for_id } = req.body;

            const note = await client.notes.findUnique({
                where: { id: Number(id) }
            });

            if(note?.written_by_id === data.id){
                if (note) {
                    await client.notes.update({
                        where: { id: Number(id) },
                        data: {
                            title,
                            content,
                            written_by_id,
                            written_for_id
                        }
                    });
    
                    req.flash("success", "Note updated successfully");
                    res.redirect(`/notes/${id}`);
                } else {
                    req.flash("error", "Note not found");
                    res.redirect("/notes");
                }
            }else{
                req.flash("error", "You don't have access to edit this note");
                res.redirect(`/notes/${id}`)
            } 
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }

    static async deleteNote(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;

            const note = await client.notes.findUnique({
                where: { id: Number(id) }
            });

            if (note) {
                await client.notes.delete({
                    where: { id: Number(id) }
                });

                req.flash("success", "Note deleted successfully");
                res.redirect("/notes");
            } else {
                req.flash("error", "Note not found");
                res.redirect("/notes");
            }
        } catch (error: any) {
            next(new ErrorHandler(error.message, error.status));
        }
    }
}
