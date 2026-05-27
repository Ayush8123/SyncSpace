import express from "express";

import {
  createChannel,
  getWorkspaceChannels,
} from "../controllers/channel.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createChannel);

router.get("/:workspaceId", authMiddleware, getWorkspaceChannels);

export default router;