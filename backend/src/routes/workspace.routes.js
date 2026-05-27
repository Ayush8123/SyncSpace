import express from "express";

import {
  createWorkspace,
  joinWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
} from "../controllers/workspace.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createWorkspace);

router.get(
  "/:workspaceId",
  authMiddleware,
  getWorkspaceById
);
router.post("/join", authMiddleware, joinWorkspace);

router.get("/", authMiddleware, getUserWorkspaces);

export default router;