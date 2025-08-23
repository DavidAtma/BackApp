import { Router } from "express";
import * as usuarioController from "../controllers/usuario.controller";
import { verificarJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", verificarJWT, usuarioController.insertarUsuario);

router.get("/", verificarJWT, usuarioController.listarUsuarios);

router.get("/activos", verificarJWT, usuarioController.listarUsuariosActivos);

router.put("/:idUsuario", verificarJWT, usuarioController.actualizarUsuario);

router.put("/activar/:idUsuario", verificarJWT, usuarioController.activarUsuario);

router.delete("/:idUsuario", verificarJWT, usuarioController.eliminarUsuario);

router.get("/:id", verificarJWT, usuarioController.obtenerUsuarioPorId);

export default router;
