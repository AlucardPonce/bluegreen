# Pruebas de Integración - Backend API

## 📋 Suite de Pruebas con Supertest

### Configuración

**Herramientas utilizadas:**
- **Jest**: Framework de testing
- **Supertest**: Testing de API HTTP
- **Cross-env**: Compatibilidad Windows/Linux
- **Coverage**: Reporte de cobertura de código

### Estructura de Tests

import request from 'supertest';
import app from '../src/app.js';

describe('API Integration Tests', () => {
  
  // Test 1: Health Check Endpoint
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  // Test 2: GET Users Endpoint
  describe('GET /api/users', () => {
    it('should return 200 and list of users', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      // Verificar estructura de usuario
      const user = response.body.data[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
    });
  });

  // Test 3: POST User Endpoint - Success
  describe('POST /api/users', () => {
    it('should create a new user and return 201', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('name', newUser.name);
      expect(response.body.data).toHaveProperty('email', newUser.email);
      expect(response.body.data).toHaveProperty('createdAt');
    });
    
    // Test 4: POST User Endpoint - Validation Error
    it('should return 400 when name is missing', async () => {
      const invalidUser = {
        email: 'test@example.com'
      };
      
      const response = await request(app)
        .post('/api/users')
        .send(invalidUser)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('required');
    });
  });

  // Test 5: GET User by ID Endpoint
  describe('GET /api/users/:id', () => {
    it('should return 200 and user details', async () => {
      const userId = 1;
      
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('id', userId);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data).toHaveProperty('email');
    });
    
    // Test 6: GET User by ID - Invalid ID
    it('should return 400 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/users/invalid')
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  // Test 7: 404 Handler
  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
