import AppDataSource from "../config/appdatasource";
import { Servicio } from "../entities/servicio";

const servicioRepository = AppDataSource.getRepository(Servicio);

// Crear servicio
export const insertarServicio = async (servicio: Partial<Servicio>) => {
  return await servicioRepository.save(servicio);
};

// Listar todos
export const listarServicios = async () => {
  return await servicioRepository.find({
    relations: ["negocio"], // para traer datos del negocio
  });
};

// Listar activos
export const listarServiciosActivos = async () => {
  return await servicioRepository.find({
    where: { estadoAuditoria: true },
    relations: ["negocio"],
  });
};

// Buscar por ID
export const obtenerServicioPorId = async (id: number) => {
  return await servicioRepository.findOne({
    where: { idServicio: id },
    relations: ["negocio"],
  });
};

// Actualizar
export const actualizarServicio = async (id: number, data: Partial<Servicio>) => {
  await servicioRepository.update({ idServicio: id }, data);
};

// Eliminar lógico (soft delete)
export const eliminarServicio = async (id: number) => {
  await servicioRepository.update({ idServicio: id }, { estadoAuditoria: false });
};

// Activar servicio
export const activarServicio = async (id: number) => {
  await servicioRepository.update({ idServicio: id }, { estadoAuditoria: true });
};
