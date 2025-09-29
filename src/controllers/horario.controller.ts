import { Request, Response } from "express";
import * as service from "../services/horario.service";
import { BaseResponse } from "../shared/base-response";

export const crear = async (req: Request, res: Response) => {
  try {
    const creado = await service.crear(req.body);
    res.status(201).json(BaseResponse.success(creado, "Horario creado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const idNegocio = req.query.idNegocio ? parseInt(String(req.query.idNegocio)) : undefined;
    const items = await service.listar(idNegocio);
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
      res.status(404).json(BaseResponse.error("Horario no encontrado"));
      return;
    }
    res.json(BaseResponse.success(item, "Horario encontrado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.actualizar(id, req.body);
    res.json(BaseResponse.success(null, "Horario actualizado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const desactivar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.desactivar(id);
    res.json(BaseResponse.success(null, "Horario desactivado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const activar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.activar(id);
    res.json(BaseResponse.success(null, "Horario activado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};
