import { Request, Response } from "express";
import * as service from "../services/cita.service";
import { BaseResponse } from "../shared/base-response";

export const crear = async (req: Request, res: Response) => {
  try {
    const creada = await service.crear(req.body);
    res.status(201).json(BaseResponse.success(creada, "Cita registrada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const idUsuario = req.query.idUsuario ? parseInt(String(req.query.idUsuario)) : undefined;
    const idServicio = req.query.idServicio ? parseInt(String(req.query.idServicio)) : undefined;
    const estado = req.query.estado ? String(req.query.estado) : undefined;

    const items = await service.listar({ idUsuario, idServicio, estado });
    res.json(BaseResponse.success(items, "Consulta exitosa"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = await service.obtenerPorId(id);
    if (!item) {
      res.status(404).json(BaseResponse.error("Cita no encontrada"));
      return;
    }
    res.json(BaseResponse.success(item, "Cita encontrada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.actualizar(id, req.body);
    res.json(BaseResponse.success(null, "Cita actualizada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const cancelar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.cancelar(id);
    res.json(BaseResponse.success(null, "Cita cancelada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const cambiarEstado = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { estado } = req.body;
    await service.cambiarEstado(id, estado);
    res.json(BaseResponse.success(null, `Estado cambiado a ${estado}`));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};
