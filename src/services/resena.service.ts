import { AppDataSource } from "../config/appdatasource";
import { Resena } from "../entities/resena";
import { Usuario } from "../entities/usuario";
import { Negocio } from "../entities/negocio";

async function ensureDS() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
}

export const crear = async (data: {
  idUsuario: number;
  idNegocio: number;
  calificacion: number;
  comentario?: string | null;
}): Promise<Resena> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Resena);

  const usuario = await AppDataSource.getRepository(Usuario).findOneByOrFail({ idUsuario: data.idUsuario });
  const negocio = await AppDataSource.getRepository(Negocio).findOneByOrFail({ idNegocio: data.idNegocio });

  const entidad = repo.create({
    usuario,
    negocio,
    calificacion: data.calificacion,
    comentario: data.comentario ?? null,
  });

  return await repo.save(entidad);
};

export const listar = async (opts: { idNegocio?: number; idUsuario?: number; soloActivas?: boolean }) => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Resena);

  const qb = repo
    .createQueryBuilder("r")
    .leftJoinAndSelect("r.usuario", "u")
    .leftJoinAndSelect("r.negocio", "n")
    .orderBy("r.fechaCreacion", "DESC");

  if (opts.idNegocio) qb.andWhere("n.idNegocio = :idNegocio", { idNegocio: opts.idNegocio });
  if (opts.idUsuario) qb.andWhere("u.idUsuario = :idUsuario", { idUsuario: opts.idUsuario });
  if (opts.soloActivas) qb.andWhere("r.estado = 1");

  return await qb.getMany();
};

export const obtenerPorId = async (idResena: number): Promise<Resena | null> => {
  await ensureDS();
  return await AppDataSource.getRepository(Resena).findOne({
    where: { idResena },
    relations: ["usuario", "negocio"],
  });
};

export const actualizar = async (idResena: number, data: Partial<Resena>): Promise<void> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Resena);
  delete (data as any).idResena;
  delete (data as any).usuario;
  delete (data as any).negocio;
  await repo.update({ idResena }, data);
};

export const desactivar = async (idResena: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Resena).update({ idResena }, { estado: false });
};

export const activar = async (idResena: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Resena).update({ idResena }, { estado: true });
};
