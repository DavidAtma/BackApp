import { AppDataSource } from "../config/appdatasource";
import { Usuario } from "../entities/usuario";
import * as bcrypt from 'bcryptjs';

// Insertar usuario
export const insertarUsuario = async (usuario: Partial<Usuario>): Promise<Usuario> => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const repository = AppDataSource.getRepository(Usuario);

    // Hashear la contraseña si existe
    if (usuario.contrasena) {
        usuario.contrasena = await bcrypt.hash(usuario.contrasena, 10);
    }

    return await repository.save(usuario);
};
// Listar todos los usuarios activos
export const listarUsuariosActivos = async (): Promise<Usuario[]> => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const repository = AppDataSource.getRepository(Usuario);
    return await repository.find({
        where: { estado: true },
        order: { idUsuario: "DESC" }
    });
};

// Listar todos los usuarios
export const listarUsuarios = async (): Promise<Usuario[]> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return await AppDataSource.getRepository(Usuario).find({
    order: { idUsuario: "ASC" } // 👈 Ahora solo ordena por ID
  });
};

// // Listar todos los usuarios activos
// export const listarUsuariosActivos = async (): Promise<Usuario[]> => {
//     if (!AppDataSource.isInitialized) {
//         await AppDataSource.initialize();
//     }

//     const repository = AppDataSource.getRepository(Usuario);
//     return await repository.find({
//         relations: ['rol'],
//         where: { estado: true },
//         order: { idUsuario: "DESC" }
//     });
// };

// // Listar todos los usuarios
// export const listarUsuarios = async (): Promise<Usuario[]> => {
//   if (!AppDataSource.isInitialized) {
//     await AppDataSource.initialize();
//   }

//   return await AppDataSource.getRepository(Usuario).find({
//     order: { idUsuario: "ASC" }, // 👈 Aquí ordenas por ID ascendente
//     relations: ["rol"]
//   });
// };


// Buscar usuario por correo
/*export const buscarUsuarioPorCorreo = async (correo: string): Promise<Usuario | null> => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const repository = AppDataSource.getRepository(Usuario);
    return await repository.findOne({
        where: {
            correo: correo.trim().toLowerCase(),
            estado: true
        },
        relations: ['rol']
    });
};*/

// Actualizar usuario
export const actualizarUsuario = async (idUsuario: number, data: Partial<Usuario>): Promise<void> => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const repository = AppDataSource.getRepository(Usuario);

    // Hashear la nueva contraseña si está presente
    if (data.contrasena) {
        data.contrasena = await bcrypt.hash(data.contrasena, 10);
    }

        // Elimina idUsuario desde el frontend
    delete (data as any).idUsuario;

    await repository.update({ idUsuario }, data);
};

// Eliminar usuario
export const eliminarUsuario = async (idUsuario: number): Promise<void> => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const repository = AppDataSource.getRepository(Usuario);
    await repository.update({ idUsuario }, { estado: false });
};

// Activar usuario
export const activarUsuario = async (idUsuario: number): Promise<void> => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const repository = AppDataSource.getRepository(Usuario);
    await repository.update({ idUsuario }, { estado: true });
};

export const obtenerUsuarioPorId = async (idUsuario: number): Promise<Usuario | null> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  return await AppDataSource.getRepository(Usuario).findOne({
    where: { idUsuario },
  });
};
