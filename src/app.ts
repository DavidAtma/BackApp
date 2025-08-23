import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';


import usuarioRouter from './routes/usuario.route';
import authRouter from './routes/auth.route';


import { AppDataSource } from './config/appdatasource';

const app: Application = express();

// Middleware CORS
app.use(cors({
  origin: [
    'http://127.0.0.1:8080',
    'http://localhost:3000',
    'http://10.0.2.2:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/v1/usuarios', usuarioRouter);
app.use('/api/v1/auth', authRouter);
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: " Ruta no encontrada",
    data: null
  });
});

app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("Error interno:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    data: null
  });
});

export const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
  }
};

export default app;
