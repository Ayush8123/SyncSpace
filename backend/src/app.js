import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import messageRoutes from "./routes/message.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "SyncSpace API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/channels", channelRoutes);

export default app;