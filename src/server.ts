import app, { startServer } from './app';

const PORT = process.env.PORT || 3000;

startServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor iniciado en: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  });
