import { Request, Response } from "express";
import * as servicioService from "../services/servicio.service";

export const insertarServicio = async (req: Request, res: Response) => {
  try {
    const nuevoServicio = await servicioService.insertarServicio(req.body);
    res.status(201).json({ success: true, message: "Servicio insertado", data: nuevoServicio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const listarServicios = async (_req: Request, res: Response) => {
//   try {
//     const servicios = await servicioService.listarServiciosConNegocio();
//     res.json({ success: true, data: servicios });
//   } catch (error: any) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
export const listarServicios = async (req: Request, res: Response) => {
  try {
    const idNegocio = req.query.idNegocio ? Number(req.query.idNegocio) : undefined;
    
    console.log(`🔍 DEBUG Backend - listarServicios: idNegocio=${idNegocio}`);
    
    const servicios = await servicioService.listarServiciosConNegocio(idNegocio);
    res.json({ success: true, data: servicios });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listarServiciosActivos = async (_req: Request, res: Response) => {
  try {
    const servicios = await servicioService.listarServiciosActivos();
    res.json({ success: true, data: servicios });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// NUEVO: Endpoint para servicios con descuento (ofertas)
export const listarServiciosConDescuento = async (_req: Request, res: Response) => {
  try {
    const servicios = await servicioService.listarServiciosConDescuento();
    res.json({ success: true, data: servicios });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const obtenerServicioPorId = async (req: Request, res: Response) => {
  try {
    const servicio = await servicioService.obtenerServicioPorId(Number(req.params.id));
    if (!servicio) return res.status(404).json({ success: false, message: "Servicio no encontrado" });
    res.json({ success: true, data: servicio });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const actualizarServicio = async (req: Request, res: Response) => {
  try {
    await servicioService.actualizarServicio(Number(req.params.id), req.body);
    res.json({ success: true, message: "Servicio actualizado" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const eliminarServicio = async (req: Request, res: Response) => {
  try {
    await servicioService.eliminarServicio(Number(req.params.id));
    res.json({ success: true, message: "Servicio eliminado (soft delete)" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const activarServicio = async (req: Request, res: Response) => {
  try {
    await servicioService.activarServicio(Number(req.params.id));
    res.json({ success: true, message: "Servicio activado" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
