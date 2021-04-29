import { Router } from "express";
import { SettingsController } from "../controllers/SettingsController";

export const settingsRoutes = Router();

const settingsController = new SettingsController();
settingsRoutes.post("/", settingsController.create);
settingsRoutes.get("/:username", settingsController.findByUsername);
settingsRoutes.put("/:username", settingsController.update);
