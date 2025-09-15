import { AppDataSource } from "../config/appdatasource";
import { Usuario } from "../entities/usuario";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import jwt, { SignOptions } from "jsonwebtoken";

/* ===============  LOGIN NORMAL (correo + contraseña)  =============== */
export const login = async (correo: string, contrasena: string): Promise<Usuario | null> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repository = AppDataSource.getRepository(Usuario);

    const usuario = await repository.findOne({
      where: {
        correo: correo.trim().toLowerCase(),
        estadoAuditoria: true,
      },
    });

    if (!usuario) {
      return null;
    }

    // Comparación simple (tal como lo tenías). Si luego pasas a bcrypt, cambia aquí.
    const isMatch = usuario.contrasena === contrasena;
    return isMatch ? usuario : null;
  } catch (error) {
    console.error("Error en login (auth.service):", error);
    throw new Error("Error al intentar iniciar sesión");
  }
};

/* =====================  GOOGLE SIGN-IN  ===================== */

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/** Verifica el idToken contra Google y devuelve el payload (email, name, picture, sub, etc.) */
export async function verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) throw new Error("No se pudo verificar idToken");
    return payload;
  } catch (e) {
    console.error("verifyGoogleIdToken error:", e);
    throw new Error("Token de Google inválido");
  }
}

type GoogleUserParams = {
  email: string;
  nombre: string;
  googleId: string;
  fotoPerfil?: string | null;
};

/**
 * Busca por correo; si no existe, crea un usuario.
 * Como tu entidad exige 'contrasena' (no nullable), guardamos una contraseña placeholder.
 */
export async function findOrCreateGoogleUser(p: GoogleUserParams): Promise<Usuario> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Usuario);

  // 1) Buscar por correo
  let user = await repo.findOne({ where: { correo: p.email.toLowerCase() } });

  if (user) {
    // Actualizaciones opcionales
    // Si más adelante agregas campos como googleId/proveedor, los setearías aquí.
    if (!user.fotoPerfil && p.fotoPerfil) user.fotoPerfil = p.fotoPerfil;
    if (user.estadoAuditoria !== true) user.estadoAuditoria = true;
    await repo.save(user);
    return user;
  }

  // 2) Crear nuevo (tu entidad exige 'contrasena': ponemos un placeholder)
  const placeholderPwd = `GOOGLE_${Math.random().toString(36).slice(2, 10)}`;

  user = repo.create({
    nombre: p.nombre,
    correo: p.email.toLowerCase(),
    contrasena: placeholderPwd, // requerido por tu esquema actual
    fechaNacimiento: null as any, // si no la tienes, déjala null (es nullable)
    fotoPerfil: p.fotoPerfil ?? null,
    estadoAuditoria: true,
  } as Partial<Usuario>);

  return await repo.save(user);
}

/* =====================  JWT helpers  ===================== */

function generateToken(payload: object): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en .env");
  }
  const expiresIn: SignOptions["expiresIn"] = (process.env.JWT_EXPIRES as any) || "7d";
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret, options);
}

/**
 * Devuelve el mismo shape que tu app Android consume:
 * { token, usuario: {...} }
 */
export async function buildAuthResponse(usuario: Usuario) {
  const token = generateToken({ id: usuario.idUsuario, email: usuario.correo });
  return {
    token,
    usuario: {
      id_usuario: usuario.idUsuario,          // <-- tu app suele llamarlo id_usuario
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellidoPaterno ?? null,
      apellido_materno: usuario.apellidoMaterno ?? null,
      correo: usuario.correo,
      foto_perfil: usuario.fotoPerfil ?? null, // <-- tu app lo llama foto_perfil, aquí mapeamos
      rol: "USER", // ajusta si tienes roles
    },
  };
}
