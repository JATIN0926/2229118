import express from "express";
import { getNumbers } from "../controllers/number.controller.js";

const router = express.Router();

router.get("/numbers/:numberid", getNumbers);

export default router;
