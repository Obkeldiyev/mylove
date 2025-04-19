import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

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
        username: msg.sender.username,
        message: msg.content,
        createdAt: msg.createdAt.toLocaleString() // format to readable date-time
      }));

      res.render("chat/chat", {
        username: admin.username,
        messages: formattedMessages
      });
    } catch (err: any) {
      next(err);
    }
  }
}
