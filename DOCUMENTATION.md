# 📚 Documentación Completa - Blue-Green Deployment System

## 📋 Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Principales](#componentes-principales)
4. [Configuración e Instalación](#configuración-e-instalación)
5. [Pipeline CI/CD](#pipeline-cicd)
6. [Estrategia Blue-Green](#estrategia-blue-green)
7. [Pruebas de Integración](#pruebas-de-integración)
8. [Monitoreo y Logging](#monitoreo-y-logging)
9. [Troubleshooting](#troubleshooting)
10. [Mejores Prácticas](#mejores-prácticas)

---

## 🎯 Visión General

### Descripción del Proyecto

Sistema de deployment Blue-Green completamente automatizado para una aplicación Full Stack (React + Node.js) con zero downtime, implementando las mejores prácticas de DevOps y CI/CD.

### Tecnologías Utilizadas

**Frontend:**
- React 18.3.1
- Vite 7.2.2
- Node.js 20.19 (Alpine)
- Nginx (Alpine)

**Backend:**
- Node.js 20.19 (Alpine)
- Express
- ES Modules
- CORS

**Infraestructura:**
- Docker & Docker Compose
- GitHub Container Registry (GHCR)
- Nginx (Proxy Inverso)
- GitHub Actions (CI/CD)
- Ubuntu VPS

**Testing:**
- Jest 29.7.0
- Supertest 6.3.3
- Cross-env (compatibilidad multiplataforma)

### Características Principales

✅ **Zero Downtime Deployment**: Sin interrupciones durante actualizaciones
✅ **Rollback Instantáneo**: Volver a versión anterior en segundos
✅ **Automatización Completa**: Pipeline CI/CD end-to-end
✅ **Container Registry**: Imágenes versionadas en GHCR
✅ **Health Checks**: Validación automática antes de switch
✅ **Pruebas de Integración**: 7+ tests automatizados
✅ **Logging Centralizado**: Nginx access/error logs
✅ **Multi-stage Builds**: Optimización de imágenes Docker

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Arquitectura

