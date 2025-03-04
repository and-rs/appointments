# Sistema de Citas Médicas (Appointments App)

Aplicación fullstack para gestión de citas médicas, construida con TypeScript, Express y Next.js.

  - [Ver Checklist](./CHECKLIST.md)

## Estructura del Proyecto (Monorepo)

Este proyecto es un monorepo que contiene las siguientes carpetas principales:

  - **`/backend`**:  API.
  - **`/frontend`**: UI.

## Características Principales

La aplicación ofrece las siguientes funcionalidades:

  * **Autenticación de usuarios**:  Sistema de registro e inicio de sesión seguro para usuarios.
  * **Gestión de citas (CRUD)**:  Permite crear, leer, actualizar y eliminar citas médicas.
  * **Disponibilidad de médicos**:  Verificación de horarios disponibles de los médicos.
  * **Estado de citas en tiempo real**:  Visualización del estado actualizado de las citas.
  * **Diseño responsivo**:  Interfaz adaptable a diferentes dispositivos (escritorio y móvil).

## Tecnologías Utilizadas

### Backend

  * **Framework**: Express.js con TypeScript
  * **Base de datos**: PostgreSQL
  * **Infraestructura**: AWS CDK
  * **Autenticación**: JWT + bcrypt
  * **Gestión de secretos**: AWS Secrets Manager
  * **Entorno Serverless**: Serverless Express para AWS Lambda
  * **Desarrollo Local**: Docker Compose

### Frontend

  * **Framework**: Next.js 15.2 (App Router) con TypeScript
  * **Gestión de fetching**: SWR
  * **Validación de formularios**: React Hook Form + Zod
  * **Estilos**: Tailwind CSS + shadcn/ui
  * **Formato de fechas**: Date-fns
  * **Peticiones HTTP**: Axios

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalados los siguientes requisitos:

  * [Node.js 22+](https://nodejs.org/)
  * [pnpm](https://pnpm.io/)
  * [Docker](https://www.docker.com/) (para PostgreSQL local)
  * [AWS CLI](https://aws.amazon.com/cli/) (para despliegue en AWS)

## Instalación y Configuración

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/and-rs/appointments.git
    cd appointments
    ```

2.  **Instalar dependencias:**

    ```bash
    pnpm install
    ```

    > **Nota:** Los scripts de `package.json` son similares para el backend y el frontend. Consulta `package.json` en cada carpeta para más detalles.

3.  **Configurar variables de entorno del Frontend:**

    ```bash
    cp frontend/.env.example frontend/.env
    ```

    > Edita el archivo `frontend/.env` para configurar las variables de entorno necesarias.

4.  **Iniciar servidores de desarrollo:**

    ```bash
    pnpm dev
    ```

    > Esto iniciará tanto el frontend como el backend en modo desarrollo.

## Documentación Detallada

Documentación específica para cada parte del proyecto:
  * **[Backend Documentation](./backend/README.md)**
  * **[Frontend Documentation](./frontend/README.md)**

## Desarrollo y Convenciones

  * **Gestor de paquetes**: [pnpm](https://pnpm.io/)
  * **Linter Frontend**: [ESLint](https://eslint.org/)
  * **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)

## Despliegue (Producción)

  * **Backend**: [AWS Lambda](https://aws.amazon.com/lambda/) + [API Gateway](https://aws.amazon.com/api-gateway/)
  * **Frontend**: [Vercel](https://vercel.com/)
