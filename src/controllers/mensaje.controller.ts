import { Request, Response } from "express";
import * as service from "../services/mensaje.service";
import { BaseResponse } from "../shared/base-response";

export const crear = async (req: Request, res: Response) => {
  try {
    const creado = await service.crear(req.body);
    res.status(201).json(BaseResponse.success(creado, "Mensaje registrado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const listarPorUsuario = async (req: Request, res: Response) => {
  try {
    const idUsuario = parseInt(req.params.idUsuario);
    const items = await service.listarPorUsuario(idUsuario);
    res.json(BaseResponse.success(items, "Historial de mensajes"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = await service.obtenerPorId(id);
    if (!item) {
      res.status(404).json(BaseResponse.error("Mensaje no encontrado"));
      return;
    }
    res.json(BaseResponse.success(item, "Mensaje encontrado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const actualizarRespuesta = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { respuestaBot } = req.body;
    await service.actualizarRespuesta(id, respuestaBot);
    res.json(BaseResponse.success(null, "Respuesta del bot actualizada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const eliminar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.eliminar(id);
    res.json(BaseResponse.success(null, "Mensaje eliminado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};
