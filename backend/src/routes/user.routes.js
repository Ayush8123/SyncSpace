import express from "express";

import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {

  return res.status(200).json({
    user: {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    },
  });

});

export default router;