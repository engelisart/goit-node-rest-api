import express from "express";

import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  signinSchema,
  signupSchema,
  verifySchema,
} from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(signupSchema), authControllers.signup);

authRouter.get("/veryfi/:verificationCode", authControllers.verify);

authRouter.post(
  "/verify",
  validateBody(verifySchema),
  authControllers.resendVerifyEmail
);

authRouter.post("/signin", validateBody(signinSchema), authControllers.signin);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;
