import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const client = new PrismaClient();

export class ChatController {
  static async getChatPage(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies.token;
      if (!token) return res.redirect("/login");

      const data: any = verify(token, process.env.SECRET_KEY!);
      const admin = await client.admin.findUnique({ where: { id: data.id } });

      if (!admin) return res.redirect("/login");

      const messages = await client.message.findMany({
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      });

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        username: msg.sender.username,
        message: msg.content,
        fileUrl: msg.fileUrl,
        createdAt: msg.createdAt.toISOString(),
        seen: msg.seen,
      }));

      res.render("chat/chat", {
        username: admin.username,
        messages: formattedMessages,
      });
    } catch (err: any) {
      next(err);
    }
  }

  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const username = req.headers["x-username"] as string;
      if (!username) return res.status(401).json({ error: "Username required" });

      const admin = await client.admin.findUnique({ where: { username } });
      if (!admin) return res.status(401).json({ error: "Unauthorized" });

      let fileUrl: string | undefined;
      if (req.file) {
        const uploadPath = join(process.cwd(), "src", "public", "uploads");
        if (!existsSync(uploadPath)) {
          mkdirSync(uploadPath, { recursive: true });
        }
        fileUrl = `/uploads/${req.file.filename}`;
      }

      const message = req.body.message || "";
      const messageData = await client.message.create({
        data: {
          content: message || undefined,
          fileUrl,
          senderId: admin.id,
          seen: false,
        },
      });

      res.json({
        id: messageData.id,
        message: messageData.content,
        fileUrl: messageData.fileUrl,
        seen: messageData.seen,
      });
    } catch (err: any) {
      next(err);
    }
  }
}