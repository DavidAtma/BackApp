import { Router } from "express";
import * as controller from "../controllers/mensaje.controller";
import { verificarJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verificarJWT);

router.post("/", controller.crear);
router.get("/usuario/:idUsuario", controller.listarPorUsuario);
router.get("/:id", controller.obtenerPorId);
router.put("/:id/respuesta", controller.actualizarRespuesta);
router.delete("/:id", controller.eliminar);

export default router;
