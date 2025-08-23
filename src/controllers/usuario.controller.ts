import { Request, Response } from "express";
import * as usuarioService from "../services/usuario.service";
import { BaseResponse } from "../shared/base-response";
import { MensajeController } from "../shared/constants";
import { Usuario } from "../entities/usuario";
import AppDataSource from "../config/appdatasource";

// Insertar usuario
export const insertarUsuario = async (req: Request, res: Response) => {
    try {
        const usuario: Partial<Usuario> = req.body;
        const nuevoUsuario = await usuarioService.insertarUsuario(usuario);
        res.json(BaseResponse.success(nuevoUsuario.idUsuario, MensajeController.INSERTADO_OK));
    } catch (error: any) {
        console.error("Error insertarUsuario:", error);
        res.status(500).json(BaseResponse.error(error.message));
    }
};

// Listar todos los usuarios
export const listarUsuarios = async (_req: Request, res: Response) => {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        res.json(BaseResponse.success(usuarios, MensajeController.CONSULTA_OK));
    } catch (error: any) {
        console.error("Error listarUsuarios:", error);
        res.status(500).json(BaseResponse.error(error.message));
    }
};

// Listar usuarios activos
export const listarUsuariosActivos = async (_req: Request, res: Response) => {
    try {
        const usuarios = await usuarioService.listarUsuariosActivos();
        res.json(BaseResponse.success(usuarios, MensajeController.CONSULTA_OK));
    } catch (error: any) {
        console.error("Error listarUsuariosActivos:", error);
        res.status(500).json(BaseResponse.error(error.message));
    }
};



// Actualizar usuario
export const actualizarUsuario = async (req: Request, res: Response) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);
        const data: Partial<Usuario> = req.body;

        console.log("👉 ID recibido:", idUsuario);
        console.log("👉 Data recibida:", data);

        await usuarioService.actualizarUsuario(idUsuario, data);

        res.json(BaseResponse.success(null, MensajeController.ACTUALIZADO_OK));
    } catch (error: any) {
        console.error(" Error actualizarUsuario:", error);  
        res.status(500).json(BaseResponse.error(error.message));
    }
};

// Eliminar usuario (soft delete)
export const eliminarUsuario = async (req: Request, res: Response) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);
        await usuarioService.eliminarUsuario(idUsuario);
        res.json(BaseResponse.success(null, MensajeController.ELIMINADO_OK));
    } catch (error: any) {
        console.error("Error eliminarUsuario:", error);
        res.status(500).json(BaseResponse.error(error.message));
    }
};

// Activar usuario
export const activarUsuario = async (req: Request, res: Response) => {
    try {
        const idUsuario = parseInt(req.params.idUsuario);
        await usuarioService.activarUsuario(idUsuario);
        res.json(BaseResponse.success(null, MensajeController.ACTUALIZADO_OK));
    } catch (error: any) {
        console.error("Error activarUsuario:", error);
        res.status(500).json(BaseResponse.error(error.message));
    }
};

export const obtenerUsuarioPorId = async (req: Request, res: Response): Promise<void> => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({
      success: false,
      message: "ID inválido",
      data: null
    });
    return;
  }

  try {
    const usuario = await AppDataSource.getRepository(Usuario).findOne({
      where: { idUsuario: id },
      relations: ["rol"]
    });

    if (!usuario) {
      res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
        data: null
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Usuario encontrado",
      data: usuario
    });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      data: null
    });
  }
};


