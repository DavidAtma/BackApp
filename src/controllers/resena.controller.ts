import { Request, Response } from "express";
import * as service from "../services/resena.service";
import { BaseResponse } from "../shared/base-response";

export const crear = async (req: Request, res: Response) => {
  try {
    const creada = await service.crear(req.body);
    res.status(201).json(BaseResponse.success(creada, "Reseña creada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const idNegocio = req.query.idNegocio ? parseInt(String(req.query.idNegocio)) : undefined;
    const idUsuario = req.query.idUsuario ? parseInt(String(req.query.idUsuario)) : undefined;
    const soloActivas = req.query.activas === "true";

    const items = await service.listar({ idNegocio, idUsuario, soloActivas });
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
      res.status(404).json(BaseResponse.error("Reseña no encontrada"));
      return;
    }
    res.json(BaseResponse.success(item, "Reseña encontrada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.actualizar(id, req.body);
    res.json(BaseResponse.success(null, "Reseña actualizada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const desactivar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.desactivar(id);
    res.json(BaseResponse.success(null, "Reseña desactivada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const activar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.activar(id);
    res.json(BaseResponse.success(null, "Reseña activada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};
