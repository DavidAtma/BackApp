import { AppDataSource } from "../config/appdatasource";
import { ImagenResena } from "../entities/imagenResena";
import { Resena } from "../entities/resena";

async function ensureDS() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
}

export const insertar = async (data: {
  idResena: number;
  urlImagen: string;
}): Promise<ImagenResena> => {
  await ensureDS();
  const repo = AppDataSource.getRepository(ImagenResena);

  const resena = await AppDataSource.getRepository(Resena).findOneByOrFail({
    idResena: data.idResena,
  });

  const entidad = repo.create({
    resena,
    urlImagen: data.urlImagen,
  });

  return await repo.save(entidad);
};

export const listarPorResena = async (idResena: number): Promise<ImagenResena[]> => {
  await ensureDS();
  return await AppDataSource.getRepository(ImagenResena).find({
    where: { resena: { idResena } },
    relations: ["resena"],
    order: { idImagenResena: "DESC" },
  });
};

export const obtenerPorId = async (idImagenResena: number): Promise<ImagenResena | null> => {
  await ensureDS();
  return await AppDataSource.getRepository(ImagenResena).findOne({
    where: { idImagenResena },
    relations: ["resena"],
  });
};

export const eliminar = async (idImagenResena: number): Promise<void> => {
  await ensureDS();
  await AppDataSource.getRepository(ImagenResena).delete({ idImagenResena });
};
