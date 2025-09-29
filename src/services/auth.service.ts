import { AppDataSource } from "../config/appdatasource";
import { Usuario } from "../entities/usuario";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import jwt, { SignOptions } from "jsonwebtoken";

// Cliente de Google para verificar idTokens
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

/* ===============  LOGIN NORMAL (correo + contraseña)  =============== */
export const login = async (
  correo: string,
  contrasena: string
): Promise<Usuario | null> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Usuario);
  const usuario = await repo.findOne({
    where: { correo: correo.trim().toLowerCase(), estadoAuditoria: 1 },
    relations: ["negocio"],   // 👈 aquí ya traes los negocios
  });
  if (!usuario) return null;
  return usuario.contrasena === contrasena ? usuario : null;
};

/* =====================  GOOGLE SIGN-IN  ===================== */

/** Verifica el idToken contra Google y devuelve el payload */
export async function verifyGoogleIdToken(
  idToken: string
): Promise<TokenPayload> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) throw new Error("Token de Google inválido");
  return payload;
}

type GoogleUserParams = {
  email: string;
  nombre: string;
  googleId: string;
  fotoPerfil?: string | null;
};

/**
 * Busca por correo; si no existe, crea un usuario placeholder
 */
export async function findOrCreateGoogleUser(
  p: GoogleUserParams
): Promise<Usuario> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Usuario);

  // 1) Buscar por correo
  let user = await repo.findOne({
    where: { correo: p.email.toLowerCase() },
    relations: ["negocio"],   // ✅ por consistencia
  });

  if (user) {
    // Actualizar fotoPerfil y estadoAuditoria si hace falta
    if (!user.fotoPerfil && p.fotoPerfil) user.fotoPerfil = p.fotoPerfil;
    if (!user.estadoAuditoria) user.estadoAuditoria = 1;
    await repo.save(user);
    return user;
  }

  // 2) Crear nuevo con contraseña placeholder
  const placeholderPwd = `GOOGLE_${Math.random().toString(36).slice(2, 10)}`;

  user = repo.create({
    nombre: p.nombre,
    correo: p.email.toLowerCase(),
    contrasena: placeholderPwd,
    fechaNacimiento: null as any,       // asume nullable
    fotoPerfil: p.fotoPerfil ?? null,
    estadoAuditoria: 1,
  } as Partial<Usuario>);

  return await repo.save(user);
}

/* =====================  JWT HELPERS  ===================== */

function generateToken(payload: object): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en .env");
  }
  const expiresIn: SignOptions["expiresIn"] =
    (process.env.JWT_EXPIRES as any) || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Construye el objeto que envía tu controlador a la app Android:
 * { token, usuario: { … } }
 */
export async function buildAuthResponse(usuario: Usuario) {
  const token = generateToken({
    id: usuario.idUsuario,
    email: usuario.correo,
  });
    const negocioId = usuario.negocio ? usuario.negocio.idNegocio : null;

  return {
    token,
    usuario: {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellidoPaterno ?? null,
      apellido_materno: usuario.apellidoMaterno ?? null,
      correo: usuario.correo,
      foto_perfil: usuario.fotoPerfil ?? null,
      // negocio_id: negocioId,
      negocioId: usuario.negocio ? usuario.negocio.idNegocio : null,
      // negocio_id: usuario.negocio ? usuario.negocio.idNegocio : null, // 👈 cambio aquí
      rol: "USER", // ajusta según tus roles
    },
  };
}