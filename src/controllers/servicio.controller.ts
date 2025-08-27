import { Request, Response } from "express";
import * as service from "../services/servicio.service";
import { BaseResponse } from "../shared/base-response";

export const crear = async (req: Request, res: Response) => {
  try {
    const creado = await service.crear(req.body);
    res.status(201).json(BaseResponse.success(creado, "Servicio creado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const idNegocio = req.query.idNegocio ? parseInt(String(req.query.idNegocio)) : undefined;
    const soloActivos = req.query.activos === "true";
    const page = req.query.page ? parseInt(String(req.query.page)) : 1;
    const pageSize = req.query.pageSize ? parseInt(String(req.query.pageSize)) : 20;

    const data = await service.listar({ idNegocio, soloActivos, page, pageSize });
    res.json(BaseResponse.success(data, "Consulta exitosa"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const obtenerPorId = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const item = await service.obtenerPorId(id);
    if (!item) {
      res.status(404).json(BaseResponse.error("Servicio no encontrado"));
      return;
    }
    // Convertir precio a number para el response, si quieres
    const data = { ...item, precio: Number(item.precio) };
    res.json(BaseResponse.success(data, "Servicio encontrado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const actualizar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.actualizar(id, req.body);
    res.json(BaseResponse.success(null, "Servicio actualizado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const desactivar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.desactivar(id);
    res.json(BaseResponse.success(null, "Servicio desactivado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};

export const activar = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await service.activar(id);
    res.json(BaseResponse.success(null, "Servicio activado"));
  } catch (err: any) {
    res.status(500).json(BaseResponse.error(err.message));
  }
};
