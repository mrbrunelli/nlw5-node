import { Router } from "express";
import { MessagesController } from "../controllers/MessagesController";

export const messagesRoutes = Router();

const messagesController = new MessagesController();
messagesRoutes.post("/", messagesController.create);
messagesRoutes.get("/:id", messagesController.showByUser);
