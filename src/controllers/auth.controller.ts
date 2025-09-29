import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { BaseResponse } from "../shared/base-response";
import { generarToken } from "../shared/jwt.utils";
import {
  verifyGoogleIdToken,
  findOrCreateGoogleUser,
  buildAuthResponse,
} from "../services/auth.service";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    res.status(400).json(BaseResponse.error("Correo y contraseña requeridos"));
    return;
  }

  try {
    const usuario = await authService.login(correo, contrasena);

    if (!usuario) {
      res.status(404).json(BaseResponse.error("Usuario o contraseña incorrectos"));
      return;
    }
    const data = await authService.buildAuthResponse(usuario);

    // Generar el token
    // const token = generarToken(usuario);
    res.status(200).json(BaseResponse.success(
      // {
      //   token,
      //   usuario: {
      //     idUsuario: usuario.idUsuario,
      //     correo: usuario.correo,
      //   }
      // },
      data,
      "Inicio de sesión exitoso"
    ));
  } catch (error: any) {
    console.error("Error en login:", error);
    res.status(500).json(BaseResponse.error("Error en el servidor"));
  }
};

export const googleSignIn = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: "Falta idToken" });

    const payload = await verifyGoogleIdToken(idToken);
    const email = payload.email;
    const nombre = payload.name || payload.given_name || "Usuario";
    const picture = payload.picture || null;
    const sub = payload.sub!;

    if (!email) return res.status(400).json({ success: false, message: "No se obtuvo email válido" });

    const usuario = await findOrCreateGoogleUser({
      email,
      nombre,
      googleId: sub,
      fotoPerfil: picture,
    });

    const data = await buildAuthResponse(usuario);
    return res.json({ success: true, message: "Login con Google exitoso", data });
  } catch (err: any) {
    console.error("googleSignIn error:", err);
    return res.status(401).json({ success: false, message: err.message || "Token de Google inválido" });
  }
};