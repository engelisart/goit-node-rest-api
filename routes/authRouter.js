import express from "express";

import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { signinSchema, signupSchema } from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(signupSchema),
  authControllers.signup
);

authRouter.post("/login", validateBody(signinSchema), authControllers.signin);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.post("/logout", authenticate, authControllers.logout);

export default authRouter;
