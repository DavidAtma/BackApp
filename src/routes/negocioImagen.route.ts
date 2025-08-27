import { Router } from "express";
import * as controller from "../controllers/negocioImagen.controller";
import { verificarJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verificarJWT);

router.post("/", controller.insertar);
router.get("/negocio/:idNegocio", controller.listarPorNegocio);
router.get("/:id", controller.obtenerPorId);
router.put("/:id", controller.actualizar);
router.post("/:id/activar", controller.activar);
router.delete("/:id", controller.desactivar);

export default router;
