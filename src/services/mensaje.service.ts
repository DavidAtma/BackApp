import { AppDataSource } from "../config/appdatasource";
import { Mensaje } from "../entities/mensaje";
import { Usuario } from "../entities/usuario";

async function ensureDS() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
}

export const crear = async (data: {
  idUsuario: number;
  mensajeUsuario: string;
  respuestaBot?: string | null;
}): Promise<Mensaje> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(Mensaje);
  const usuario = await AppDataSource.getRepository(Usuario).findOneByOrFail({
    idUsuario: data.idUsuario,
  });

  const entidad = repo.create({
    usuario,
    mensajeUsuario: data.mensajeUsuario,
    respuestaBot: data.respuestaBot ?? null,
  });

  return await repo.save(entidad);
};

export const listarPorUsuario = async (idUsuario: number): Promise<Mensaje[]> => {
  await ensureDS();
  return await AppDataSource.getRepository(Mensaje).find({
    where: { usuario: { idUsuario } },
    relations: ["usuario"],
    order: { fechaEnvio: "DESC" },
  });
};

export const obtenerPorId = async (idMensaje: number): Promise<Mensaje | null> => {
  await ensureDS();
  return await AppDataSource.getRepository(Mensaje).findOne({
    where: { idMensaje },
    relations: ["usuario"],
  });
};

export const actualizarRespuesta = async (idMensaje: number, respuestaBot: string): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Mensaje).update({ idMensaje }, { respuestaBot });
};

export const eliminar = async (idMensaje: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(Mensaje).delete({ idMensaje });
};
