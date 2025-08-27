import { Router } from "express";
import * as controller from "../controllers/cita.controller";
import { verificarJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verificarJWT);

router.post("/", controller.crear);
router.get("/", controller.listar);
router.get("/:id", controller.obtenerPorId);
router.put("/:id", controller.actualizar);
router.post("/:id/cancelar", controller.cancelar);
router.put("/:id/estado", controller.cambiarEstado);

export default router;
