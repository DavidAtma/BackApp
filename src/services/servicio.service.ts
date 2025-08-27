import { AppDataSource } from "../config/appdatasource";
import { Servicio } from "../entities/servicio";
import { Negocio } from "../entities/negocio";

type UpdateServicioInput = {
  idNegocio?: number;
  nombre?: string;
  descripcion?: string | null;
  precio?: number;            
  duracionMinutos?: number;
  estado?: boolean;
};


async function ensureDS() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
}

// Crear servicio
export const crear = async (data: {
  idNegocio: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;             
  duracionMinutos: number;
}): Promise<Servicio> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Servicio);
  const negocio = await AppDataSource.getRepository(Negocio).findOneByOrFail({
    idNegocio: data.idNegocio,
  });

  const entidad = repo.create({
    negocio,
    nombre: data.nombre,
    descripcion: data.descripcion ?? null,
    precio: data.precio.toFixed(2),  
    duracionMinutos: data.duracionMinutos,
  });

  return await repo.save(entidad);
};

export const listar = async (opts: {
  idNegocio?: number;
  soloActivos?: boolean;
  page?: number;
  pageSize?: number;
}) => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Servicio);

  const page = Math.max(1, opts.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, opts.pageSize ?? 20));

  const qb = repo
    .createQueryBuilder("s")
    .leftJoinAndSelect("s.negocio", "n")
    .orderBy("s.idServicio", "ASC")
    .skip((page - 1) * pageSize)
    .take(pageSize);

  if (opts.idNegocio) qb.andWhere("n.idNegocio = :idNegocio", { idNegocio: opts.idNegocio });
  if (opts.soloActivos) qb.andWhere("s.estado = 1");

  const [items, total] = await qb.getManyAndCount();

  const itemsMap = items.map(i => ({ ...i, precio: Number(i.precio) }));

  return { items: itemsMap, total, page, pageSize };
};

export const obtenerPorId = async (idServicio: number): Promise<Servicio | null> => {
  await ensureDS();
  const item = await AppDataSource.getRepository(Servicio).findOne({
    where: { idServicio },
    relations: ["negocio"],
  });
  return item ? { ...item, precio: item.precio } : null;
};

export const actualizar = async (idServicio: number, data: UpdateServicioInput): Promise<void> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Servicio);

  if (data.idNegocio) {
    const negocio = await AppDataSource.getRepository(Negocio).findOneByOrFail({
      idNegocio: data.idNegocio,
    });
    (data as any).negocio = negocio;
    delete (data as any).idNegocio;
  }

  if (typeof data.precio === "number") {
    (data as any).precio = data.precio.toFixed(2); 
  }

  await repo.update({ idServicio }, data as any);
};

export const desactivar = async (idServicio: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Servicio).update({ idServicio }, { estado: false });
};

export const activar = async (idServicio: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Servicio).update({ idServicio }, { estado: true });
};


