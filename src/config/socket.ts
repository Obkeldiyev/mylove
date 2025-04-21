import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export function initSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected");

    socket.on("join", (username: string) => {
      socket.data.username = username;
      socket.broadcast.emit("chat message", {
        username: "System",
        message: `${username} joined the chat.`,
      });
    });

    socket.on("chat message", async ({ message, username, fileUrl, id }) => {
      if (isNaN(id)) {
        console.error(`Invalid message ID in chat message: ${id}`);
        return;
      }
      io.emit("chat message", { username, message, fileUrl, id, seen: false });
    });

    socket.on("typing", (username: string) => {
      socket.broadcast.emit("typing", username);
    });

    socket.on("message seen", async ({ messageId, username }) => {
      if (messageId === undefined || messageId === null) {
        console.debug(`Received null or undefined messageId from ${username}`);
        return;
      }

      const id = parseInt(messageId, 10);
      if (isNaN(id)) {
        console.debug(`Invalid messageId from ${username}: ${messageId}`);
        return;
      }

      try {
        const message = await client.message.findUnique({
          where: { id },
          include: { sender: true },
        });
        if (message && !message.seen) {
          if (message.sender.username === username) {
            console.log(`Ignoring message seen for ID ${id} from sender ${username}`);
            return;
          }
          await client.message.update({
            where: { id },
            data: { seen: true },
          });
          io.emit("message seen", { messageId: id });
          console.log(`Message ${id} marked as seen by ${username}`);
        }
      } catch (error) {
        console.error(`Error marking message ${id} as seen:`, error);
      }
    });

    socket.on("disconnect", () => {
      if (socket.data.username) {
        socket.broadcast.emit("chat message", {
          username: "System",
          message: `${socket.data.username} left the chat.`,
        });
      }
      console.log("🔴 User disconnected");
    });
  });
}