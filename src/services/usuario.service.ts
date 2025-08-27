import AppDataSource from "../config/appdatasource";
import { Usuario } from "../entities/usuario";

const usuarioRepository = AppDataSource.getRepository(Usuario);

// Insertar
export const insertarUsuario = async (usuario: Partial<Usuario>) => {
  return await usuarioRepository.save(usuario);
};

// Listar todos
export const listarUsuarios = async () => {
  return await usuarioRepository.find();
};

// Listar activos
export const listarUsuariosActivos = async () => {
  return await usuarioRepository.find({ where: { estadoAuditoria: true } });
};

// Buscar por ID
export const obtenerUsuarioPorId = async (id: number) => {
  return await usuarioRepository.findOne({ where: { idUsuario: id } });
};

// Actualizar
export const actualizarUsuario = async (id: number, data: Partial<Usuario>) => {
  await usuarioRepository.update({ idUsuario: id }, data);
};

// Eliminar lógico (soft delete)
export const eliminarUsuario = async (id: number) => {
  await usuarioRepository.update({ idUsuario: id }, { estadoAuditoria: false });
};

// Activar usuario
export const activarUsuario = async (id: number) => {
  await usuarioRepository.update({ idUsuario: id }, { estadoAuditoria: true });
};
