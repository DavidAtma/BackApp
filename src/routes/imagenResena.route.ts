import { Router } from "express";
import * as controller from "../controllers/imagenResena.controller";
import { verificarJWT } from "../middlewares/auth.middleware";

const router = Router();
router.use(verificarJWT);

router.post("/", controller.insertar);
router.get("/resena/:idResena", controller.listarPorResena);
router.get("/:id", controller.obtenerPorId);
router.delete("/:id", controller.eliminar);

export default router;
