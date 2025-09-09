import { Router, Request, Response } from "express";
import { AppDataSource } from "../config/appdatasource";
import { Servicio } from "../entities/servicio";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { servicio, ubicacion, precioMin, precioMax } = req.body;

    const servicioRepo = AppDataSource.getRepository(Servicio);

    let query = servicioRepo
      .createQueryBuilder("s")
      .leftJoinAndSelect("s.negocio", "n")
      .leftJoinAndSelect("n.ubicacion", "u");

    // Filtro por nombre del servicio (flexible)
    if (servicio) {
      query = query.andWhere("LOWER(s.nombre) LIKE :servicio", { servicio: `%${servicio.toLowerCase()}%` });
    }

    // Filtro por ubicación (distrito)
    if (ubicacion) {
      query = query.andWhere("LOWER(u.distrito) LIKE :ubicacion", { ubicacion: `%${ubicacion.toLowerCase()}%` });
    }

    // Filtro por rango de precios
    if (precioMin && precioMax) {
      query = query.andWhere("s.precio BETWEEN :precioMin AND :precioMax", { precioMin, precioMax });
    } else if (precioMax) {
      query = query.andWhere("s.precio <= :precioMax", { precioMax });
    } else if (precioMin) {
      query = query.andWhere("s.precio >= :precioMin", { precioMin });
    }

    const resultados = await query.getMany();

res.json({
  success: true,
  meta: { total: resultados.length },  // <--- anidado
  data: resultados,
});

  } catch (error) {
    console.error("Error al filtrar servicios:", error);
    res.status(500).json({
      success: false,
      message: "Error al filtrar servicios",
    });
  }
});

export default router;
