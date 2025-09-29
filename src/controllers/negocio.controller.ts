import { Request, Response } from "express";
import * as negocioService from "../services/negocio.service";
import { BaseResponse } from "../shared/base-response";

// export const crear = async (req: Request, res: Response) => {
//   try {

//     // Obtener el idUsuario del token JWT (depende de tu middleware)
//     const idUsuario = (req as any).user?.idUsuario; // ← Ajusta según tu implementación
    
//     const datosNegocio = {
//       ...req.body,
//       idUsuario
//     };
//     const creado = await negocioService.crear(datosNegocio);

//      // Verificar que el ID sea válido
//     if (!creado.idNegocio || creado.idNegocio === 0) {
//       throw new Error("El ID del negocio no se generó correctamente");
//     }
//     res.status(201).json(BaseResponse.success(creado, "Negocio creado"));
//   } catch (err: any) {
//     res.status(500).json(BaseResponse.error(err.message));
//   }
// };

// En negocio.controller.ts - CON DEBUG
export const crear = async (req: Request, res: Response) => {
  try {
    console.log("=== DEBUG BACKEND NEGOCIO.CONTROLLER ===");
    console.log("Headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("req.usuario:", (req as any).usuario);
    console.log("req.user:", (req as any).user);
    
    // Probar ambas opciones
    const idUsuario = (req as any).usuario?.id || (req as any).user?.id;
//                                    ↑↑
//                          Cambia idUsuario por id
    // const idUsuario = (req as any).usuario?.idUsuario || (req as any).user?.idUsuario;
    
    console.log("🔍 idUsuario encontrado:", idUsuario);
    
    if (!idUsuario) {
      console.log("❌ ERROR: No se pudo obtener idUsuario del token");
      return res.status(401).json(BaseResponse.error("Usuario no autenticado"));
    }
    
    const datosNegocio = {
      ...req.body,
      idUsuario: idUsuario
    };
    
    console.log("📨 Datos completos para servicio:", datosNegocio);
    
    const creado = await negocioService.crear(datosNegocio);
    
    console.log("✅ Negocio creado con ID:", creado.idNegocio);
    
    res.status(201).json(BaseResponse.success(creado, "Negocio creado"));
  } catch (err: any) {
    console.error("❌ Error en crear negocio:", err);
    res.status(500).json(BaseResponse.error(err.message));
  }
};


export const listar = async (req: Request, res: Response) => {
  try {
    // Soportar tanto pageSize como limit
    const page       = parseInt(String(req.query.page ?? "1"));
    const pageSize   = parseInt(String(req.query.pageSize ?? req.query.limit ?? "20"));

    const soloActivos  = req.query.activos === "true";
    const idCategoria  = req.query.idCategoria ? parseInt(String(req.query.idCategoria)) : undefined;
    const idUbicacion  = req.query.idUbicacion ? parseInt(String(req.query.idUbicacion)) : undefined;

    // 🔎 NUEVO: parámetros de búsqueda
    const q        = (req.query.q as string) || (req.query.search as string) || undefined; // alias
    const distrito = req.query.distrito ? String(req.query.distrito) : undefined;
    const ciudad   = req.query.ciudad   ? String(req.query.ciudad)   : undefined;

    const data = await negocioService.listar({
      page, pageSize,
      soloActivos, idCategoria, idUbicacion,
      q, distrito, ciudad
    });

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
