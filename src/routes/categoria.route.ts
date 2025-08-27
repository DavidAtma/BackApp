import { Router } from "express";
import * as categoriaController from "../controllers/categoria.controller";
import { verificarJWT } from "../middlewares/auth.middleware";

const router = Router();

router.use(verificarJWT);

router.post("/",  categoriaController.crear);
router.get("/", categoriaController.listar);                
router.get("/:id", categoriaController.obtenerPorId);
router.put("/:id",  categoriaController.actualizar);
router.post("/:id/activar",  categoriaController.activar);
router.delete("/:id",  categoriaController.desactivar);

export default router;
