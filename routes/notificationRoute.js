import express from "express";
import {
  getMyNotifications,
  readGeneralNotifications,
  readMessageslNotifications,
} from "../controllers/notificationController.js";

export const notificationRoute = express.Router();

notificationRoute.get("/:userId", getMyNotifications);
notificationRoute.patch("/:userId", readGeneralNotifications);
notificationRoute.patch("/:userId/messages", readMessageslNotifications);
