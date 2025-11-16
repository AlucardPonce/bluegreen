import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import userRoutes from './routes/userRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import dishRoutes from './routes/dishRoutes.js';
import atraccionRoutes from './routes/atraccionRoutes.js';
import eventosRoutes from './routes/eventosRoutes.js';

const server = express();

// Middlewares
server.use(cors());
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Rutas de la API
server.use('/api/users', userRoutes);
server.use('/api/restaurants', restaurantRoutes);
server.use('/api/dishes', dishRoutes);
server.use('/api/atracciones', atraccionRoutes);
server.use('/api/eventos', eventosRoutes);

// Healthcheck simple (no depende de DB)
server.get('/api/health', (req, res) => {
	res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() });
});

// Cargar .env desde la raíz (opcional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Escuchar en HOST/PORT (0.0.0.0:3000 por defecto)
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
	console.log(`🚀 Servidor corriendo en ${HOST}:${PORT}`);
	console.log(`💚 Health: http://127.0.0.1:${PORT}/api/health`);
});

export default server;