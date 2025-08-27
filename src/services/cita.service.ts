import { AppDataSource } from "../config/appdatasource";
import { Cita } from "../entities/cita";
import { Usuario } from "../entities/usuario";
import { Servicio } from "../entities/servicio";

async function ensureDS() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
}

export const crear = async (data: {
  idUsuario: number;
  idServicio: number;
  fechaCita: string;
  horaCita: string;
}): Promise<Cita> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Cita);

  const usuario = await AppDataSource.getRepository(Usuario).findOneByOrFail({ idUsuario: data.idUsuario });
  const servicio = await AppDataSource.getRepository(Servicio).findOneByOrFail({ idServicio: data.idServicio });

  const entidad = repo.create({
    usuario,
    servicio,
    fechaCita: data.fechaCita,
    horaCita: data.horaCita,
    estado: "Pendiente",
  });

  return await repo.save(entidad);
};

export const listar = async (opts: { idUsuario?: number; idServicio?: number; estado?: string }) => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Cita);

  const qb = repo
    .createQueryBuilder("c")
    .leftJoinAndSelect("c.usuario", "u")
    .leftJoinAndSelect("c.servicio", "s")
    .orderBy("c.fechaCita", "DESC")
    .addOrderBy("c.horaCita", "DESC");

  if (opts.idUsuario) qb.andWhere("u.idUsuario = :idUsuario", { idUsuario: opts.idUsuario });
  if (opts.idServicio) qb.andWhere("s.idServicio = :idServicio", { idServicio: opts.idServicio });
  if (opts.estado) qb.andWhere("c.estado = :estado", { estado: opts.estado });

  return await qb.getMany();
};

export const obtenerPorId = async (idCita: number): Promise<Cita | null> => {
  await ensureDS();
  return await AppDataSource.getRepository(Cita).findOne({
    where: { idCita },
    relations: ["usuario", "servicio"],
  });
};

export const actualizar = async (idCita: number, data: Partial<Cita> & { idUsuario?: number; idServicio?: number }): Promise<void> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Cita);

  if (data.idUsuario) {
    const usuario = await AppDataSource.getRepository(Usuario).findOneByOrFail({ idUsuario: data.idUsuario });
    (data as any).usuario = usuario;
    delete (data as any).idUsuario;
  }

  if (data.idServicio) {
    const servicio = await AppDataSource.getRepository(Servicio).findOneByOrFail({ idServicio: data.idServicio });
    (data as any).servicio = servicio;
    delete (data as any).idServicio;
  }

  delete (data as any).idCita;
  await repo.update({ idCita }, data);
};

export const cancelar = async (idCita: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Cita).update({ idCita }, { estadoAuditoria: false, estado: "Cancelada" });
};

export const cambiarEstado = async (idCita: number, estado: string): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Cita).update({ idCita }, { estado });
};
