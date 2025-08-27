import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { BaseResponse } from "../shared/base-response";

const {
  JWT_SECRET,
  JWT_ISSUER,
  JWT_AUDIENCE,
} = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET no configurado");
}

export interface AuthPayload extends JwtPayload {
  sub: string;       
  email?: string;
  role?: string;
}

export interface AuthenticatedRequest extends Request {
  usuario?: AuthPayload;
}

function extraerToken(req: Request): string | null {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7).trim();

  const cookie = (req as any).cookies?.access_token;
  if (typeof cookie === "string" && cookie.length > 0) return cookie;

  return null;
}

export function verificarJWT(req: Request, res: Response, next: NextFunction) {
  const token = extraerToken(req);
  if (!token) {
    res.status(401).json(BaseResponse.error("Token no proporcionado o inválido"));
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ["HS256"],          
      clockTolerance: 5              
    }) as AuthPayload;

    (req as AuthenticatedRequest).usuario = decoded;
    next();
  } catch (_err) {
    res.status(401).json(BaseResponse.error("Token inválido o expirado"));
  }
}


export function requireRole(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).usuario;
    if (!user || !user.role || !rolesPermitidos.includes(user.role)) {
      res.status(403).json(BaseResponse.error("No autorizado"));
      return;
    }
    next();
  };
}
