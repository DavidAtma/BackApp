import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Usuario } from '../entities/usuario';

export const AppDataSource = new DataSource({
type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as any, 10) || 1433,
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || '123',
  database: process.env.DB_NAME || 'AppMovil',
 synchronize: false,
  logging: false,
  entities: [
    Usuario],
  extra: {
    options: {
      encrypt: false,
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  },
});

export default AppDataSource;
