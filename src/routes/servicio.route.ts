import { Router } from "express";
import * as servicioController from "../controllers/servicio.controller";

const router = Router();

router.post("/", servicioController.insertarServicio);
router.get("/", servicioController.listarServicios);
router.get("/activos", servicioController.listarServiciosActivos);
router.get("/:id", servicioController.obtenerServicioPorId);
router.put("/:id", servicioController.actualizarServicio);
router.delete("/:id", servicioController.eliminarServicio);
router.patch("/:id/activar", servicioController.activarServicio);

export default router;
