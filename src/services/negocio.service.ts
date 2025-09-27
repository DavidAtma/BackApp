import { AppDataSource } from "../config/appdatasource";
import { Negocio } from "../entities/negocio";
import { Categoria } from "../entities/categoria";
import { Ubicacion } from "../entities/ubicacion";
import { Usuario } from "../entities/usuario";

async function ensureDS() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
}

export const crear = async (data: {
  idCategoria: number;
  idUbicacion: number;
  nombre: string;
  descripcion?: string | null;
  direccion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  telefono?: string | null;
  correoContacto?: string | null;
  estadoAuditoria?: number;
  idUsuario?: number; 
}): Promise<Negocio> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Negocio);
  const catRepo = AppDataSource.getRepository(Categoria);
  const ubiRepo = AppDataSource.getRepository(Ubicacion);
  const usuarioRepo = AppDataSource.getRepository(Usuario);

  const categoria = await catRepo.findOneByOrFail({ idCategoria: data.idCategoria });
  const ubicacion = await ubiRepo.findOneByOrFail({ idUbicacion: data.idUbicacion });

   // 🔥 NUEVO: Buscar el usuario si se proporciona idUsuario
  let usuario: Usuario | null = null;
  if (data.idUsuario) {
    usuario = await usuarioRepo.findOneBy({ idUsuario: data.idUsuario });
  }

  const entidad = repo.create({
    categoria,
    ubicacion,
    usuario,
    nombre: data.nombre,
    descripcion: data.descripcion ?? null,
    direccion: data.direccion ?? null,
    latitud: data.latitud !== undefined && data.latitud !== null ? String(data.latitud) : null,
    longitud: data.longitud !== undefined && data.longitud !== null ? String(data.longitud) : null,
    telefono: data.telefono ?? null,
    correoContacto: data.correoContacto ?? null,
    estadoAuditoria: data.estadoAuditoria ?? 0,
  });

  return await repo.save(entidad);
};

export const listar = async (opts: {
  page?: number;
  pageSize?: number;
  idCategoria?: number;
  idUbicacion?: number;
  soloActivos?: boolean;
  // 🔎 NUEVO
  q?: string;
  distrito?: string;
  ciudad?: string;
}) => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Negocio);

  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));

  const qb = repo
    .createQueryBuilder("n")
    .leftJoinAndSelect("n.categoria", "c")
    .leftJoinAndSelect("n.ubicacion", "u")
    .leftJoinAndSelect("n.imagenes", "img")  // 👈 añadir esto
    .orderBy("n.idNegocio", "ASC")
    .skip((page - 1) * pageSize)
    .take(pageSize);

  if (opts.idCategoria) qb.andWhere("c.idCategoria = :idCategoria", { idCategoria: opts.idCategoria });
  if (opts.idUbicacion) qb.andWhere("u.idUbicacion = :idUbicacion", { idUbicacion: opts.idUbicacion });
  if (opts.soloActivos) qb.andWhere("n.estadoAuditoria = 1");

  // 🔎 Filtros por distrito/ciudad directos
  if (opts.distrito) {
    qb.andWhere("LOWER(u.distrito) LIKE LOWER(:distrito)", { distrito: `%${opts.distrito.trim()}%` });
  }
  if (opts.ciudad) {
    qb.andWhere("LOWER(u.ciudad) LIKE LOWER(:ciudad)", { ciudad: `%${opts.ciudad.trim()}%` });
  }

  // 🔎 Búsqueda general por texto en:
  // - n.nombre, n.direccion
  // - u.distrito, u.ciudad
  // - nombre de servicios asociados (EXISTS evita duplicados)
  if (opts.q && opts.q.trim() !== "") {
    const q = `%${opts.q.trim().toLowerCase()}%`;
    qb.andWhere(
      `
      (
        LOWER(n.nombre)            LIKE :q OR
        LOWER(COALESCE(n.direccion, '')) LIKE :q OR
        LOWER(COALESCE(u.distrito,  '')) LIKE :q OR
        LOWER(COALESCE(u.ciudad,   '')) LIKE :q OR
        EXISTS (
          SELECT 1
          FROM Servicios s
          WHERE s.id_negocio = n.id_negocio
            AND LOWER(s.nombre) LIKE :q
        )
      )
      `,
      { q }
    );
  }

  const [items, total] = await qb.getManyAndCount();
  return { items, total, page, pageSize };
};

export const obtenerPorId = async (idNegocio: number): Promise<Negocio | null> => {
  await ensureDS();
  return await AppDataSource.getRepository(Negocio).findOne({
    where: { idNegocio },
    relations: [
      "categoria",
      "ubicacion",
      "servicios",
      "imagenes",
      "horarios"
    ],
  });
};

export const actualizar = async (idNegocio: number, data: Partial<Negocio>): Promise<void> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Negocio);

  if ((data as any).idCategoria) {
    const cat = await AppDataSource.getRepository(Categoria).findOneByOrFail({
      idCategoria: (data as any).idCategoria,
    });
    (data as any).categoria = cat;
    delete (data as any).idCategoria;
  }
  if ((data as any).idUbicacion) {
    const ubi = await AppDataSource.getRepository(Ubicacion).findOneByOrFail({
      idUbicacion: (data as any).idUbicacion,
    });
    (data as any).ubicacion = ubi;
    delete (data as any).idUbicacion;
  }

  if ((data as any).latitud !== undefined && (data as any).latitud !== null) {
    (data as any).latitud = String((data as any).latitud);
  }
  if ((data as any).longitud !== undefined && (data as any).longitud !== null) {
    (data as any).longitud = String((data as any).longitud);
  }

  delete (data as any).idNegocio;
  await repo.update({ idNegocio }, data);
};

export const desactivar = async (idNegocio: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Negocio).update({ idNegocio }, { estadoAuditoria: 0 });
};

export const activar = async (idNegocio: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Negocio).update({ idNegocio }, { estadoAuditoria: 1 });
};