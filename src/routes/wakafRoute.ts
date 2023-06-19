import express from "express";
import * as WakafController from "../controllers/wakafController";

const router = express.Router();

router.get("/", WakafController.getDataWakaf);
router.get("/:wakafId", WakafController.getWakaf);
router.post("/", WakafController.createWakaf);

export default router;
