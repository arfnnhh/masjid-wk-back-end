import express from "express";
import * as DanaController from "../controllers/danaController";

const router = express.Router();

router.get("/", DanaController.getDanaWakaf);
router.get("/:danaId", DanaController.getDana);
router.patch("/:danaId", DanaController.updateDana);

export default router;