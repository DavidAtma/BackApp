import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { BaseResponse } from "../shared/base-response";
import { generarToken } from "../shared/jwt.utils";

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

    // Generar el token
    const token = generarToken(usuario);

    res.status(200).json(BaseResponse.success(
      {
        token,
        usuario: {
          idUsuario: usuario.idUsuario,
          correo: usuario.correo,
        }
      },
      "Inicio de sesión exitoso"
    ));
  } catch (error: any) {
    console.error("Error en login:", error);
    res.status(500).json(BaseResponse.error("Error en el servidor"));
  }
};
