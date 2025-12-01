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

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/atracciones', atraccionRoutes);
app.use('/api/eventos', eventosRoutes);

// Healthcheck simple (no depende de DB)
app.get('/api/health', (req, res) => {
	res.json({ success: true, message: 'OK', timestamp: new Date().toISOString() });
});

// Cargar .env desde la raíz (opcional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Escuchar en HOST/PORT (0.0.0.0:3000 por defecto)
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
	console.log(`🚀 Servidor corriendo en ${HOST}:${PORT}`);
	console.log(`💚 Health: http://127.0.0.1:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	console.log('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		console.log('HTTP server closed');
	});
});

export default server;