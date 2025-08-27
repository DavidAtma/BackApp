import { Request, Response } from "express";
import * as service from "../services/negocioImagen.service";
import { BaseResponse } from "../shared/base-response";

export const insertar = async (req: Request, res: Response) => {
  try {
    const creada = await service.insertar(req.body);
    res.status(201).json(BaseResponse.success(creada, "Imagen agregada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const listarPorNegocio = async (req: Request, res: Response) => {
  try {
    const idNegocio = parseInt(req.params.idNegocio);
    const items = await service.listarPorNegocio(idNegocio);
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
      res.status(404).json(BaseResponse.error("Imagen no encontrada"));
      return;
    }
    res.json(BaseResponse.success(item, "Imagen encontrada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.actualizar(id, req.body);
    res.json(BaseResponse.success(null, "Imagen actualizada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const desactivar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.desactivar(id);
    res.json(BaseResponse.success(null, "Imagen desactivada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const activar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.activar(id);
    res.json(BaseResponse.success(null, "Imagen activada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};
