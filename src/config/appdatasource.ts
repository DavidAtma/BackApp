import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Usuario } from '../entities/usuario';
import { Ubicacion } from '../entities/ubicacion';
import { Categoria } from '../entities/categoria';
import { Negocio } from '../entities/negocio';
import { NegocioImagen } from '../entities/negocioImagen';
import { Servicio } from '../entities/servicio';
import { Horario } from '../entities/horario';
import { Resena } from '../entities/resena';
import { ImagenResena } from '../entities/imagenResena';
import { Mensaje } from '../entities/mensaje';
import { DocumentoVerificacion } from '../entities/documentoVerificacion';
import { Administrador } from '../entities/administrador';
import { Cita } from '../entities/cita';

export const AppDataSource = new DataSource({
type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as any, 10) || 1433,
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || '22quispe2002',
  database: process.env.DB_NAME || 'AppMovil',
 synchronize: false,
  logging: false,
  entities: [
    Usuario,
  Ubicacion,
Categoria,
Negocio,
NegocioImagen,
Servicio,
Horario,
Resena,
ImagenResena,
Mensaje,
DocumentoVerificacion,
Administrador,
Cita
],
  extra: {
    options: {
      encrypt: false,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
});

export default AppDataSource;
