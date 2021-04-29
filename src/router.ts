import { Router } from "express";
import { messagesRoutes } from "./routes/messages-routes";
import { settingsRoutes } from "./routes/settings-routes";
import { usersRoutes } from "./routes/users-routes";

export const router = Router();

router.use("/messages", messagesRoutes);
router.use("/settings", settingsRoutes);
router.use("/users", usersRoutes);
