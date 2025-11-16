# API de Atracciones Turísticas - Documentación

## 🌟 Endpoints Disponibles

### Base URL
```
http://localhost:3000/api/atracciones
```

---

## 📋 Endpoints

### 1. **Crear una Atracción**
**POST** `/api/atracciones`

**Body (JSON):**
```json
{
  "nombre": "Cascada El Salto",
  "categoria": "cascada",
  "descripcion": "Hermosa cascada natural...",
  "latitud": "20.8833",
  "longitud": "-99.6667",
  "videoUrl": "https://youtube.com/watch?v=...",
  "informacionCultural": "Historia y cultura del lugar...",
  "horarios": "9:00 AM - 6:00 PM",
  "costoEntrada": "$50 MXN",
  "restricciones": "No se permiten mascotas",
  "nivelDificultad": "moderado",
  "servicios": "Estacionamiento, baños, área de picnic",
  "fotos": [],
  "audioUrl": "",
  "estado": "activa"
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "message": "Atracción creada exitosamente",
  "data": {
    "id": "abc123",
    "nombre": "Cascada El Salto",
    ...
  }
}
```

---

### 2. **Obtener Todas las Atracciones**
**GET** `/api/atracciones`

**Query Parameters (opcionales):**
- `estado`: "activa" | "inactiva"
- `categoria`: "cascada" | "mirador" | "cueva" | "observatorio" | "sitio-historico"
- `nivelDificultad`: "facil" | "moderado" | "dificil"

**Ejemplo:**
```
GET /api/atracciones?estado=activa&categoria=cascada
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "abc123",
      "nombre": "Cascada El Salto",
      "categoria": "cascada",
      ...
    }
  ]
}
```

---

### 3. **Obtener una Atracción por ID**
**GET** `/api/atracciones/:id`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "nombre": "Cascada El Salto",
    ...
  }
}
```

---

### 4. **Actualizar una Atracción**
**PUT** `/api/atracciones/:id`

**Body (JSON):** (mismos campos que crear, todos opcionales)
```json
{
  "nombre": "Cascada El Salto - Actualizada",
  "descripcion": "Nueva descripción..."
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Atracción actualizada exitosamente",
  "data": {
    "id": "abc123",
    ...
  }
}
```

---

### 5. **Cambiar Estado de Atracción**
**PATCH** `/api/atracciones/:id/estado`

**Body (JSON):**
```json
{
  "estado": "inactiva"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Atracción marcada como inactiva",
  "data": {
    "id": "abc123",
    "estado": "inactiva",
    ...
  }
}
```

---

### 6. **Eliminar una Atracción**
**DELETE** `/api/atracciones/:id`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Atracción eliminada correctamente"
}
```

---

### 7. **Buscar Atracciones**
**GET** `/api/atracciones/buscar?q=termino`

**Query Parameter:**
- `q`: Término de búsqueda (busca en nombre y descripción)

**Ejemplo:**
```
GET /api/atracciones/buscar?q=cascada
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [...]
}
```

---

### 8. **Obtener Estadísticas**
**GET** `/api/atracciones/estadisticas`

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "activas": 8,
    "inactivas": 2,
    "porCategoria": {
      "cascada": 3,
      "mirador": 2,
      "cueva": 1,
      "observatorio": 1,
      "sitio-historico": 3
    },
    "porNivelDificultad": {
      "facil": 4,
      "moderado": 4,
      "dificil": 2
    }
  }
}
```

---

## 🚀 Cómo Usar

### Iniciar el Backend

1. Navega a la carpeta del backend:
```bash
cd Proyecto-back-Integradora
```

2. Instala las dependencias (si no lo has hecho):
```bash
npm install
```

3. Inicia el servidor:
```bash
npm start
```

El servidor estará corriendo en `http://localhost:3000`

### Usar desde el Frontend

El servicio `atraccionService.js` ya está configurado y listo para usar:

```javascript
import { crearAtraccion, obtenerAtracciones } from '../../service/atraccionService';

// Crear una atracción
const nuevaAtraccion = await crearAtraccion(datosAtraccion);

// Obtener todas las atracciones
const atracciones = await obtenerAtracciones();

// Obtener atracciones filtradas
const atraccionesActivas = await obtenerAtracciones({ estado: 'activa' });
```

---

## 📝 Códigos de Estado HTTP

- `200` - Solicitud exitosa
- `201` - Recurso creado exitosamente
- `400` - Error en la solicitud (datos faltantes o inválidos)
- `404` - Recurso no encontrado
- `500` - Error interno del servidor

---

## 🔐 Notas de Seguridad

- Asegúrate de configurar CORS correctamente en producción
- Implementa autenticación y autorización según sea necesario
- Valida y sanitiza todos los inputs del usuario
- Configura límites de tamaño para las cargas de archivos

---

## 🗄️ Estructura de Datos

### Modelo de Atracción

```typescript
{
  id: string,                    // ID único generado por Firebase
  nombre: string,                // Nombre de la atracción
  categoria: string,             // Categoría (cascada, mirador, etc.)
  descripcion: string,           // Descripción detallada
  latitud: string,               // Coordenada de latitud
  longitud: string,              // Coordenada de longitud
  videoUrl: string,              // URL del video (opcional)
  informacionCultural: string,   // Información histórica/cultural
  horarios: string,              // Horarios de apertura
  costoEntrada: string,          // Costo de entrada
  restricciones: string,         // Restricciones de acceso
  nivelDificultad: string,       // Nivel de dificultad
  servicios: string,             // Servicios disponibles
  fotos: string[],               // URLs de fotos
  audioUrl: string,              // URL de audioguía (opcional)
  estado: string,                // 'activa' o 'inactiva'
  fechaCreacion: string,         // Fecha ISO de creación
  fechaActualizacion: string     // Fecha ISO de última actualización
}
```

---

## 🛠️ Archivos Creados

### Backend
- `src/models/Atraccion.js` - Modelo de datos
- `src/controllers/AtraccionCtl.js` - Controladores de API
- `src/routes/atraccionRoutes.js` - Definición de rutas
- `src/server.js` - Servidor actualizado con nuevas rutas

### Frontend
- `src/service/atraccionService.js` - Servicio para consumir API
- `src/pages/Admin/GestionDeAtracciones.jsx` - Componente de gestión actualizado

---

## ✅ Próximos Pasos

1. Prueba las APIs usando Postman o Thunder Client
2. Verifica la conexión con Firebase
3. Implementa la carga de archivos (imágenes y audio) si es necesario
4. Añade validación de roles de usuario para las operaciones
5. Implementa paginación para grandes volúmenes de datos
