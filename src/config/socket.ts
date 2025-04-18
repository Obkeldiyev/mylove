import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export function initSocket(server: any) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("🟢 User connected");

    socket.on("join", (username: string) => {
      socket.data.username = username;
      socket.broadcast.emit("chat message", {
        username: "System",
        message: `${username} joined the chat.`,
      });
    });

    socket.on("chat message", async ({ message, username }) => {
      const admin = await client.admin.findUnique({ where: { username } });

      if (!admin) return;

      await client.message.create({
        data: {
          content: message,
          senderId: admin.id,
        },
      });

      io.emit("chat message", { username, message });
    });

    socket.on("typing", (username: string) => {
      socket.broadcast.emit("typing", username);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected");
    });
  });
}
