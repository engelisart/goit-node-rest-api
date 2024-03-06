import express from "express";

import authControllers from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { signinSchema, signupSchema } from "../schemas/usersSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(signupSchema),
  authControllers.signup
);

authRouter.post("/signin", validateBody(signinSchema), authControllers.signin);

authRouter.get("/current", authenticate, authControllers.current);

authRouter.post("/logout", authenticate, authControllers.logout);

// authRouter.patch(
//   "/users/avatars",
//   upload.single("photo"),
//   authenticate,
//   authControllers.avatars
// );

export default authRouter;
