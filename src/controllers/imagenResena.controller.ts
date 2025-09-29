import { Request, Response } from "express";
import * as service from "../services/imagenResena.service";
import { BaseResponse } from "../shared/base-response";

export const insertar = async (req: Request, res: Response) => {
  try {
    const creada = await service.insertar(req.body);
    res.status(201).json(BaseResponse.success(creada, "Imagen añadida a la reseña"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const listarPorResena = async (req: Request, res: Response) => {
  try {
    const idResena = parseInt(req.params.idResena);
    const items = await service.listarPorResena(idResena);
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

export const eliminar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.eliminar(id);
    res.json(BaseResponse.success(null, "Imagen eliminada"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};
