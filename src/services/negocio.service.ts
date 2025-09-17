import { AppDataSource } from "../config/appdatasource";
import { Negocio } from "../entities/negocio";
import { Categoria } from "../entities/categoria";
import { Ubicacion } from "../entities/ubicacion";

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
}): Promise<Negocio> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Negocio);
  const catRepo = AppDataSource.getRepository(Categoria);
  const ubiRepo = AppDataSource.getRepository(Ubicacion);

  const categoria = await catRepo.findOneByOrFail({ idCategoria: data.idCategoria });
  const ubicacion = await ubiRepo.findOneByOrFail({ idUbicacion: data.idUbicacion });

  const entidad = repo.create({
    categoria,
    ubicacion,
    nombre: data.nombre,
    descripcion: data.descripcion ?? null,
    direccion: data.direccion ?? null,
    latitud: data.latitud !== undefined && data.latitud !== null ? String(data.latitud) : null,
    longitud: data.longitud !== undefined && data.longitud !== null ? String(data.longitud) : null,
    telefono: data.telefono ?? null,
    correoContacto: data.correoContacto ?? null,
  });

  return await repo.save(entidad);
};

export const listar = async (opts: {
  page?: number;
  pageSize?: number;
  idCategoria?: number;
  idUbicacion?: number;
  soloActivos?: boolean;
}) => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Negocio);

  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));

  const qb = repo
    .createQueryBuilder("n")
    .leftJoinAndSelect("n.categoria", "c")
    .leftJoinAndSelect("n.ubicacion", "u")
    .orderBy("n.idNegocio", "ASC")
    .skip((page - 1) * pageSize)
    .take(pageSize);

  if (opts.idCategoria) qb.andWhere("c.idCategoria = :idCategoria", { idCategoria: opts.idCategoria });
  if (opts.idUbicacion) qb.andWhere("u.idUbicacion = :idUbicacion", { idUbicacion: opts.idUbicacion });
  if (opts.soloActivos) qb.andWhere("n.estado = 1");

  const [items, total] = await qb.getManyAndCount();
  return { items, total, page, pageSize };
};

// export const obtenerPorId = async (idNegocio: number): Promise<Negocio | null> => {
//   await ensureDS();
//   return await AppDataSource.getRepository(Negocio).findOne({
//     where: { idNegocio },
//     relations: ["categoria", "ubicacion"],
//   });
// };
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
  await AppDataSource.getRepository(Negocio).update({ idNegocio }, { estado: false });
};

export const activar = async (idNegocio: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Negocio).update({ idNegocio }, { estado: true });
};
