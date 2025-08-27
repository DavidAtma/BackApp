import { Request, Response } from "express";
import * as negocioService from "../services/negocio.service";
import { BaseResponse } from "../shared/base-response";

export const crear = async (req: Request, res: Response) => {
  try {
    const creado = await negocioService.crear(req.body);
    res.status(201).json(BaseResponse.success(creado, "Negocio creado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const page = parseInt(String(req.query.page ?? "1"));
    const pageSize = parseInt(String(req.query.pageSize ?? "20"));
    const soloActivos = req.query.activos === "true";
    const idCategoria = req.query.idCategoria ? parseInt(String(req.query.idCategoria)) : undefined;
    const idUbicacion = req.query.idUbicacion ? parseInt(String(req.query.idUbicacion)) : undefined;

    const data = await negocioService.listar({ page, pageSize, soloActivos, idCategoria, idUbicacion });
    res.json(BaseResponse.success(data, "Consulta exitosa"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = await negocioService.obtenerPorId(id);
    if (!item) {
      res.status(404).json(BaseResponse.error("Negocio no encontrado"));
      return;
    }
    res.json(BaseResponse.success(item, "Negocio encontrado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await negocioService.actualizar(id, req.body);
    res.json(BaseResponse.success(null, "Negocio actualizado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const desactivar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await negocioService.desactivar(id);
    res.json(BaseResponse.success(null, "Negocio desactivado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const activar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await negocioService.activar(id);
    res.json(BaseResponse.success(null, "Negocio activado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};
