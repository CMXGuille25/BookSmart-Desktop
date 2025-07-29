# BookSmart-Desktop
=======
# React + Vite
=======
# BookSmart Desktop 📚
>>>>>>> ffdfb1e (docs: Actualizar README.md con documentación completa del proyecto)

**BookSmart Desktop** es una aplicación de escritorio desarrollada con React y Electron para la gestión de préstamos bibliotecarios. La aplicación permite a los bibliotecarios administrar préstamos de libros, escanear tarjetas de usuario y mantener un control eficiente del inventario bibliotecario.

## 🎯 Características Principales

### ✅ Implementado
- **🔐 Sistema de Autenticación Seguro**
  - Login con credenciales (usuario/contraseña)
  - Verificación de doble factor (2FA) por correo electrónico
  - Manejo seguro de tokens JWT
  - Gestión automática de sesiones

- **🖥️ Interfaz de Usuario Pixel-Perfect**
  - Diseño basado en mockups de Figma
  - Componentes reutilizables con CSS modular
  - Responsive design optimizado para desktop
  - Transiciones y animaciones suaves

<<<<<<< HEAD
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 6a21ac9 (Initial commit: Biblioteca Desktop React App)
=======
- **📱 Navegación Intuitiva**
  - Sidebar reutilizable para navegación principal
  - Sistema de rutas con React Router
  - Pantallas de transición personalizadas
  - Manejo de estados de carga

- **🛡️ Manejo de Errores Robusto**
  - Mensajes de error genéricos para usuarios finales
  - Logging detallado para soporte técnico
  - Validación de formularios en tiempo real
  - Recuperación automática de errores de red

### 🚧 En Desarrollo
- **📖 Gestión de Préstamos**
  - Búsqueda avanzada de libros
  - Registro de nuevos préstamos
  - Seguimiento de devoluciones
  - Historial de préstamos por usuario

- **🔍 Escaneo de Códigos**
  - Integración con lector de códigos de barras
  - Escaneo de tarjetas de usuario
  - Búsqueda rápida por código ISBN

## 🛠️ Stack Tecnológico Completo

### **📱 Frontend & UI**
- **React 19.1.0** - Framework principal con hooks modernos y concurrent features
- **React DOM 19.1.0** - Renderizado eficiente del DOM virtual
- **React Router DOM 7.6.3** - Enrutamiento SPA con navegación declarativa
- **CSS Modules** - Estilos encapsulados por componente
- **CSS3** - Flexbox, Grid, Variables CSS, Media Queries
- **HTML5** - Estructura semántica moderna

### **🖥️ Tecnologías Desktop**
- **Electron 37.2.0** - Framework para aplicaciones desktop multiplataforma
- **Node.js** - Runtime JavaScript para el proceso principal de Electron
- **Chromium** - Motor de renderizado integrado en Electron
- **Native APIs** - Acceso a funcionalidades del sistema operativo

### **⚡ Herramientas de Desarrollo**
- **Vite 4.5.2** - Bundler ultrarrápido con Hot Module Replacement (HMR)
- **@vitejs/plugin-react** - Plugin oficial de Vite para React
- **Concurrently** - Ejecución simultánea de Electron y Vite en desarrollo
- **PostCSS** - Procesamiento avanzado de CSS
- **Autoprefixer 10.4.21** - Prefijos automáticos para compatibilidad cross-browser

### **📡 Comunicación & Datos**
- **Axios 1.10.0** - Cliente HTTP con interceptors y manejo de errores
- **Fetch API** - API nativa para requests HTTP
- **JSON Web Tokens (JWT)** - Autenticación stateless y segura
- **LocalStorage** - Persistencia de datos en el cliente
- **RESTful API** - Comunicación con backend mediante endpoints REST

### **🔍 Calidad de Código**
- **ESLint 9.29.0** - Linter para JavaScript/React
- **@eslint/js** - Configuración base de ESLint
- **eslint-plugin-react-hooks** - Reglas específicas para React Hooks
- **eslint-plugin-react-refresh** - Reglas para Vite React Refresh
- **Prettier** (configuración implícita) - Formato consistente de código

### **🏗️ Arquitectura & Patrones**
- **Component-Based Architecture** - Componentes reutilizables y modulares
- **Custom Hooks** - Lógica reutilizable con useState, useEffect, useNavigate
- **Error Boundaries** - Manejo robusto de errores en componentes
- **Modular CSS** - Arquitectura de estilos escalable y mantenible
- **Responsive Design** - Adaptabilidad a diferentes resoluciones de pantalla

### **🔐 Seguridad & Autenticación**
- **JWT Authentication** - Tokens seguros con expiración automática
- **2FA (Two-Factor Authentication)** - Verificación en dos pasos
- **HTTPS** - Comunicación encriptada con el servidor
- **Input Validation** - Sanitización y validación de datos de entrada
- **CORS Headers** - Configuración segura de headers HTTP

### **📦 Gestión de Dependencias**
- **npm** - Gestor de paquetes de Node.js
- **package.json** - Definición de dependencias y scripts
- **Semantic Versioning** - Versionado consistente de dependencias
- **Lock Files** - Reproducibilidad exacta de instalaciones

## � Información del Proyecto

### **🎯 Contexto de Desarrollo**
- **Tipo de Aplicación**: Desktop App para gestión bibliotecaria
- **Arquitectura**: Electron + React (Renderer Process)
- **Patrón de Diseño**: Component-Based con Custom Hooks
- **Metodología**: Desarrollo iterativo con feedback continuo
- **Testing**: Validación manual y testing de integración

### **🔗 Integraciones Actuales**
- **Backend API**: Node.js/Express en `http://localhost:3333`
- **Base de Datos**: MySQL/PostgreSQL (via API)
- **Email Service**: SMTP para códigos 2FA
- **Authentication**: JWT con refresh tokens
- **File System**: Acceso nativo via Electron APIs

### **🎨 Sistema de Diseño**
- **Design System**: Basado en mockups de Figma
- **Color Palette**: Esquema profesional bibliotecario
- **Typography**: Fonts system optimizadas para legibilidad
- **Icons**: SVG icons escalables y optimizados
- **Spacing**: Sistema de spacing consistente (8px grid)
- **Animations**: Transiciones suaves con CSS transitions

### **📁 Estructura de Archivos Detallada**
```
BookSmart-Desktop/
├── 📄 main.js                    # Proceso principal de Electron
├── 📄 index.html                 # Punto de entrada HTML
├── 📄 vite.config.js            # Configuración de Vite
├── 📄 eslint.config.js          # Reglas de linting
├── 📄 package.json              # Dependencias y scripts
├── 📁 public/                   # Assets estáticos
│   └── 🖼️ vite.svg              # Logo de Vite
├── 📁 src/                      # Código fuente principal
│   ├── 📄 main.jsx              # Punto de entrada React
│   ├── 📄 App.jsx               # Componente raíz
│   ├── 🎨 App.css               # Estilos globales principales
│   ├── 🎨 index.css             # Reset CSS y variables
│   ├── 📁 assets/               # Recursos multimedia
│   │   ├── 🖼️ logo1.png         # Logo principal
│   │   ├── 🖼️ Libro_vacio.png   # Placeholder de libros
│   │   └── 🖼️ react.svg         # Logo de React
│   ├── 📁 Componentes/          # Componentes reutilizables
│   │   ├── 📁 AlertaModal/      # Sistema de modales
│   │   ├── 📁 PantallaTransicion/ # Loading screens
│   │   └── 📁 Sidebar/          # Navegación lateral
│   ├── 📁 Login/                # Sistema de autenticación
│   │   ├── 📄 Login.jsx         # Pantalla principal de login
│   │   ├── 📄 ConfirmarLogin.jsx # Verificación 2FA
│   │   └── 🎨 Login.css         # Estilos del login
│   ├── 📁 Inicio/               # Dashboard principal
│   ├── 📁 Nuevo_Préstamo/       # Gestión de préstamos
│   ├── 📁 Detalle_Prestamo/     # Detalles de préstamos
│   └── 📁 Escanear_Tarjeta_Usuario/ # Funcionalidad de escaneo
└── 📁 node_modules/             # Dependencias instaladas
```

### **🚀 Características de Desarrollo**
- **Hot Reload**: Desarrollo rápido con Vite HMR
- **Live Debugging**: DevTools de Chrome integradas
- **Source Maps**: Debugging preciso en desarrollo
- **Error Logging**: Sistema robusto de logs para debugging
- **Development Mode**: Códigos de prueba y información adicional

### **⚙️ Variables de Entorno**
```javascript
NODE_ENV=development          # Modo de desarrollo
VITE_API_URL=localhost:3333  # URL del backend API
ELECTRON_IS_DEV=true         # Modo desarrollo Electron
```

### **🔧 Scripts de Desarrollo Detallados**
- `npm run dev` - Inicia servidor Vite con HMR en puerto 5173
- `npm run electron` - Ejecuta solo Electron apuntando a build
- `npm run electron-dev` - Desarrollo completo (Vite + Electron)
- `npm run build` - Build optimizado para producción
- `npm run preview` - Preview del build en servidor local
- `npm run lint` - Análisis estático con ESLint
- `npm run lint:fix` - Auto-corrección de issues de ESLint

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- API Backend ejecutándose en `http://localhost:3333`

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 18.0 o superior) - Runtime JavaScript
- **npm** (versión 8.0 o superior) - Gestor de paquetes
- **Git** - Control de versiones
- **API Backend** ejecutándose en `http://localhost:3333`
- **Sistema Operativo**: Windows 10+, macOS 10.15+, o Linux Ubuntu 18.04+

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/CMXGuille25/BookSmart-Desktop.git
cd BookSmart-Desktop

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (web)
npm run dev

# Ejecutar como aplicación Electron
npm run electron-dev

# Crear build de producción
npm run build
```

### 📦 Build y Distribución

#### **Desarrollo Local**
```bash
# Desarrollo web (puerto 5173)
npm run dev

# Desarrollo desktop completo
npm run electron-dev

# Preview del build
npm run preview
```

#### **Producción Desktop**
```bash
# Build para producción
npm run build

# Electron con build
npm run electron

# Package para distribución (futuro)
npm run dist  # (pendiente de configurar)

## 🏗️ Arquitectura del Proyecto

```
src/
├── assets/                    # Recursos estáticos (imágenes, iconos)
├── Componentes/              # Componentes reutilizables
│   ├── AlertaModal/          # Modal para alertas
│   ├── PantallaTransicion/   # Pantalla de carga
│   └── Sidebar/              # Navegación lateral
├── Login/                    # Sistema de autenticación
│   ├── Login.jsx            # Pantalla de login principal
│   ├── ConfirmarLogin.jsx   # Verificación 2FA
│   └── Login.css            # Estilos del sistema de login
├── Inicio/                   # Pantalla principal/dashboard
├── Nuevo_Préstamo/          # Funcionalidad de préstamos
├── Detalle_Prestamo/        # Detalles de préstamos
└── Escanear_Tarjeta_Usuario/ # Funcionalidad de escaneo
```

## 🔧 Cómo Funciona

### 1. **Flujo de Autenticación**
1. Usuario ingresa credenciales en `Login.jsx`
2. API valida credenciales y envía código 2FA por email
3. Usuario confirma código en `ConfirmarLogin.jsx`
4. Sistema recibe JWT y guarda en localStorage
5. Redirección automática a pantalla principal

### 2. **Gestión de Estado**
- **localStorage**: Tokens JWT, datos de usuario temporal
- **React State**: Estados de componentes, formularios, errores
- **Navigation**: React Router para manejo de rutas

### 3. **Comunicación con API**
- **Base URL**: `http://localhost:3333/api`
- **Headers**: `X-Client-Type: desktop` para identificación
- **Autenticación**: Bearer token en headers
- **Error Handling**: Códigos HTTP específicos con mensajes contextuales

### 4. **Seguridad Implementada**
- Tokens JWT con expiración automática
- Validación de sesión en cada ruta protegida
- Sanitización de datos de entrada
- Manejo seguro de errores (sin exposición de detalles internos)

## 🎨 Sistema de Estilos

- **CSS Modules**: Para componentes aislados (`*.module.css`)
- **CSS Global**: Para estilos compartidos (`*.css`)
- **Variables CSS**: Para colores y dimensiones consistentes
- **Responsive**: Media queries para diferentes resoluciones
- **Pixel Perfect**: Implementación exacta de diseños Figma

## 📝 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo Vite
npm run electron     # Ejecutar Electron
npm run electron-dev # Desarrollo con Electron + Vite
npm run build        # Build de producción
npm run lint         # Análisis de código con ESLint
npm run preview      # Preview del build de producción
```

## 🔮 Roadmap Futuro

### **📅 Próximas Funcionalidades**
- [ ] **Electron Builder** - Packaging automático para Windows
- [ ] **Auto-Updater** - Sistema de actualizaciones automáticas
- [ ] **Base de datos local** - SQLite para modo offline
- [ ] **Modo offline** con sincronización automática
- [ ] **Sistema de permisos** y roles de usuario
- [ ] **Backup automático** de datos locales

## 🛡️ Configuración de Seguridad

### **🔐 Medidas Implementadas**
- **Context Isolation**: Electron con contexto aislado habilitado
- **Preload Scripts**: Scripts seguros para comunicación IPC
- **Content Security Policy**: Headers CSP configurados
- **Input Sanitization**: Validación y limpieza de inputs
- **JWT Security**: Tokens con expiración y rotación
- **HTTPS Only**: Comunicación encriptada con API
- **Error Handling**: Mensajes genéricos para usuarios finales

### **📋 Dependencias de Seguridad**
```json
{
  "electron": "^37.2.0",        // Versión LTS con patches de seguridad
  "react": "^19.1.0",          // Última versión estable
  "axios": "^1.10.0"           // Cliente HTTP con validaciones
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 Autor

**CMXGuille25** - [GitHub Profile](https://github.com/CMXGuille25)

---

*BookSmart Desktop - Simplificando la gestión bibliotecaria* 📚✨
>>>>>>> ffdfb1e (docs: Actualizar README.md con documentación completa del proyecto)
