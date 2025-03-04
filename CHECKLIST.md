# Checklist del Sistema de Citas Médicas

## Backend Core ✅
- [x] Configuración del Proyecto (Express + TypeScript + PostgreSQL)
- [x] Esquema de Base de Datos y Migraciones
- [x] Sistema de Autenticación
- [x] Gestión de Usuarios
  - [x] Registro
  - [x] Inicio de Sesión
  - [x] Operaciones CRUD
- [x] Funcionalidades Core de Citas
  - [x] Crear con validación de médico y hora
  - [x] Leer citas de usuario con detalles
  - [x] Actualizar con verificación de disponibilidad
  - [x] Eliminar con verificación de propiedad
- [ ] Asignación de Doctores (Admin) - No implementado por no ser requisito core

## Frontend Core (En Progreso)
- [x] Configuración del Proyecto (Next.js + TypeScript)
- [x] Integración API
  - [x] Configuración de Axios
  - [x] Integración de SWR
  - [x] Manejo de Autenticación
- [x] Páginas de Autenticación
  - [x] Formulario de Inicio de Sesión
  - [x] Formulario de Registro
- [x] Gestión de Citas
  - [x] Ver Citas
  - [x] Listar con fecha, hora, detalles del doctor
  - [x] Eliminar Cita
  - [x] Crear Cita
  - [ ] Actualizar Cita (siguiente)

## Documentación Requerida
- [x] Repositorio GitHub
  - [x] Estructura del Proyecto
  - [x] Explicación del Stack Tecnológico
  - [ ] Esquema de Base de Datos
  - [ ] Rutas API
- [x] README
  - [ ] Pasos de Instalación
  - [ ] Configuración del Entorno
  - [ ] Instrucciones para Ejecutar
- [ ] Documentación API
  - [ ] Endpoints
  - [ ] Ejemplos de Solicitud/Respuesta
  - [ ] Requisitos de Autenticación

## Testing Requerido
- [ ] Pruebas Unitarias Backend

## Estado Actual
- Backend completamente funcional con todos los requisitos core (excepto pruebas unitarias :c)
- Frontend con la mayoría de la funcionalidad CRUD funcionando
- Sistema de autenticación completo
- Operaciones de base de datos funcionando
- Necesario completar:
  1. Interfaz de Usuario para Actualizar cita
  2. Documentación
  3. Pruebas
