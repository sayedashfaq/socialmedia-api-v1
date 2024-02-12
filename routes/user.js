import express from "express";
import {
  deleteUser,
  followUser,
  getAllUsers,
  getUser,
  unfollowUser,
  updateUser,
} from "../controllers/user.js";

import { checkUserAuth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/user/:id", getUser);
router.get("/user/", getAllUsers);
router.put("/user/:id", checkUserAuth, updateUser);
router.delete("/user/:id", checkUserAuth, deleteUser);
router.put("/user/:id/follow", checkUserAuth, followUser);
router.put("/user/:id/unfollow", checkUserAuth, unfollowUser);

export default router;
