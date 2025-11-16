# Empaquetamiento con Capacitor

Este proyecto es una PWA convertida a app móvil nativa usando Capacitor.

## Requisitos Previos

- **Node.js** y npm instalados
- **Java 21** (OpenJDK recomendado)
- **Android Studio** con Android SDK
- **Gradle** (se instala automáticamente)

### Variables de Entorno Configuradas

```powershell
ANDROID_HOME=D:\Android\Sdk
ANDROID_SDK_ROOT=D:\Android\Sdk
ANDROID_AVD_HOME=D:\Android\avd
GRADLE_USER_HOME=D:\Android\.gradle
JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.x.x-hotspot
```

## Compilar y Ejecutar en Android

### Método 1: Línea de Comandos (Rápido)

```bash
# 1. Compilar la app web
npm run build

# 2. Sincronizar con Capacitor
npx cap sync

# 3. Ejecutar en dispositivo conectado
npx cap run android
```

**Todo en un comando:**
```bash
npm run build && npx cap sync && npx cap run android
```

### Método 2: Android Studio (Desarrollo)

```bash
# 1. Compilar la app web
npm run build

# 2. Sincronizar
npx cap sync

# 3. Abrir en Android Studio
npx cap open android

# 4. En Android Studio, click en el botón Run ▶️
```

## Actualizar Código

### Solo cambios en código web (HTML/CSS/JS)

```bash
npm run build && npx cap sync && npx cap run android
```

### Cambios en código nativo o plugins

```bash
npm run build
npx cap sync
npx cap open android
# Hacer cambios en Android Studio y ejecutar desde ahí
```

## Configuración del Dispositivo Android

### Activar Opciones de Desarrollador

1. Ve a **Ajustes → Acerca del teléfono**
2. Toca **Número de compilación** 7 veces
3. Regresa a **Ajustes → Sistema → Opciones de desarrollador**

### Permisos Necesarios

Activa en **Opciones de desarrollador**:
- ✅ **Depuración USB**
- ✅ **Instalar vía USB**
- Instalar aplicaciones via USB

## Generar APK para Producción

### APK de Debug (desarrollo)

```bash
cd android
./gradlew assembleDebug
# APK generado en: android/app/build/outputs/apk/debug/app-debug.apk
```

### APK de Release (producción)

```bash
cd android
./gradlew assembleRelease
# APK generado en: android/app/build/outputs/apk/release/app-release.apk
```

**Nota:** Para release necesitas configurar el firmado en `android/app/build.gradle`

## Comandos Útiles de Capacitor

```bash
# Ver dispositivos conectados
npx cap run android --list

# Limpiar y reconstruir
npx cap sync android --clean

# Ver logs del dispositivo
npx cap run android --livereload

# Actualizar Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest
npm install @capacitor/android@latest
npx cap sync
```

## Estructura del Proyecto

```
experienciasArroyo/
├── src/              # Código fuente web (React)
├── dist/             # Build de producción (generado)
├── android/          # Proyecto Android nativo
│   ├── app/
│   │   └── src/
│   │       └── main/
│   │           └── assets/
│   │               └── public/  # Copia de dist/
│   └── build/
│       └── outputs/
│           └── apk/  # APKs generados
├── capacitor.config.json  # Configuración de Capacitor
└── package.json
```

## Solución de Problemas

### Error: Java version incorrecta
```bash
java -version  # Debe mostrar Java 21
```

### Error: Dispositivo no detectado
```bash
D:\Android\Sdk\platform-tools\adb.exe devices
```

### Error: Gradle build failed
```bash
cd android
./gradlew clean
cd ..
npx cap sync
```

### Error: Instalación cancelada por usuario
- Verifica permisos de "Instalar vía USB" en el teléfono
- Verifica "Instalar aplicaciones desconocidas" en Ajustes → Apps

## Recursos

- [Documentación de Capacitor](https://capacitorjs.com/docs)
- [Guía de Android](https://capacitorjs.com/docs/android)
- [Plugins de Capacitor](https://capacitorjs.com/docs/plugins)