// import { Router } from "express";
// import * as negocioController from "../controllers/negocio.controller";
// import { verificarJWT } from "../middlewares/auth.middleware";

// const router = Router();

// router.use(verificarJWT);

// router.post("/", negocioController.crear);
// router.get("/", negocioController.listar);           
// router.get("/:id", negocioController.obtenerPorId);
// router.put("/:id", negocioController.actualizar);
// router.post("/:id/activar",  negocioController.activar);
// router.delete("/:id",negocioController.desactivar);

// export default router;
import { Router } from "express";
import * as negocioController from "../controllers/negocio.controller";
import { verificarJWT } from "../middlewares/auth.middleware";

const router = Router();

// 🔓 Rutas públicas (no requieren token)
router.get("/", negocioController.listar);
router.get("/:id", negocioController.obtenerPorId);

// 🔐 Rutas privadas (sí requieren token)
router.post("/", verificarJWT, negocioController.crear);
router.put("/:id", verificarJWT, negocioController.actualizar);
router.post("/:id/activar", verificarJWT, negocioController.activar);
router.delete("/:id", verificarJWT, negocioController.desactivar);

export default router;
