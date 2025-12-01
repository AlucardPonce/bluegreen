import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api/users', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { id: 1, name: 'Usuario 1', email: 'user1@example.com' },
      { id: 2, name: 'Usuario 2', email: 'user2@example.com' }
    ]
  });
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Name and email are required'
    });
  }
  
  res.status(201).json({
    success: true,
    data: {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid user ID'
    });
  }
  
  res.status(200).json({
    success: true,
    data: {
      id: parseInt(id),
      name: `Usuario ${id}`,
      email: `user${id}@example.com`
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

export default app;
