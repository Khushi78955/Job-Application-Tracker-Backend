import express from "express";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.js";


import {create, getAll, getById, update, remove} from "../controllers/application.controller.js"

import { createApplicationSchema, updateApplicationSchema } from "../validators/application.validator.js";

const router = express.Router();

router.use(protect);

router.post("/", validate(createApplicationSchema), create)
router.get("/", getAll)
router.get("/:id", getById)
router.patch("/:id", validate(updateApplicationSchema), update)
router.delete("/:id", remove)

export default router;