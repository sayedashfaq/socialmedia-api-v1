import express from "express";

import { checkUserAuth } from "../middlewares/authMiddleware.js";
import {
  changeUserPassword,
  loggedUser,
  loginUser,
  registerUser,
} from "../controllers/Auth.js";

const router = express.Router();

//routes midllewares
router.use("/auth/changepassword", checkUserAuth);
router.use("/auth/loggeduser", checkUserAuth);

//routes normal
router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
// router.post("/send_reset_password_email", sendUserPasswordResetEmail);
// router.post("/reset_password/:id/:token", resetUserPassword)

//Protected Routes
router.post("/auth/changepassword", changeUserPassword);
router.get("/auth/loggeduser", loggedUser);

export default router;
