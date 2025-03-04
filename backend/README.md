# Backend - Sistema de Citas Médicas

API REST construida con Node.js, Express.js, TypeScript y PostgreSQL, desplegada en AWS Lambda.

## Características Técnicas Destacadas

### Patrón Factory para Handlers
Implementación de un patrón factory para estandarizar:
- Manejo de errores
- Respuestas HTTP
- Logging
- Tipado

```typescript
// Ejemplo de uso del HandlerFactory
export const createUser = HandlerFactory.create<{ user: User }>(
  async (req) => {
    // Business logic
    return { user };
  },
  { errorMessage: "Failed to create user", successStatus: 201 }
);
```

### Sistema de Autenticación
- JWT para tokens de acceso
- Middleware de autenticación personalizado
- Protección de rutas
- Hash seguro de contraseñas con bcrypt

### Base de Datos
- PostgreSQL sin ORM. Solo pg
- Migraciones SQL para control de versiones

## Estructura de la Base de Datos

### Tablas Principales
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  specialty VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_appointment_time CHECK (
    time >= '08:00' AND time <= '18:00'
  )
);

CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS doctors_specialty_idx ON doctors(specialty);
CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_doctor_id_idx ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS appointments_date_time_idx ON appointments(date, time);

INSERT INTO doctors (name, specialty) VALUES
  ('Juan Diaz', 'Ortopedia'),
  ('Daniela Ortega', 'Cardiología'),
  ('Samuel Santamaria', 'Pediatría'),
  ('Fernanda Gutierrez', 'Traumatología')
ON CONFLICT (name) DO NOTHING;
```

## API Endpoints

### Autenticación
- `POST /users/create` - Registro de usuario
- `POST /users/login` - Inicio de sesión
- `GET /users/authorized` - Obtener usuario autenticado
- `GET /users/read` -  Leer usuarios (requiere autenticación)
- `PATCH /users/update` -  Actualizar usuario (requiere autenticación)
- `DELETE /users/delete` - Eliminar usuario (requiere autenticación)

### Citas
- `GET /appointments/read` - Listar citas del usuario (requiere autenticación)
- `POST /appointments/create` - Crear nueva cita (requiere autenticación)
- `PATCH /appointments/update/:id` - Actualizar cita (requiere autenticación)
- `DELETE /appointments/delete/:id` - Cancelar cita (requiere autenticación)

### Médicos
- `GET /doctors` - Listar médicos disponibles

## Decisiones Técnicas

### AWS CDK y Lambda
- Infraestructura como código
- Serverless para mejor escalabilidad
- Gestión automatizada de recursos

### Patrón Factory
Implementado para:
- Reducir boilerplate
- Estandarizar manejo de errores
- Facilitar testing
- Mantener consistencia en respuestas

## Desarrollo Local

1. Configurar variables de entorno:
```bash
cp .env.example .env
```

2. Iniciar PostgreSQL:
```bash
docker-compose up -d
```

3. Ejecutar migraciones:
```bash
pnpm db:migrate
```

4. Iniciar servidor:
```bash
pnpm dev
```

## Despliegue

El despliegue se realiza mediante AWS CDK:
```bash
pnpm cdk deploy
```

Esto crea:
- Lambda Function
- API Gateway
- RDS PostgreSQL
- Secrets Manager
- VPC y Security Groups (No es Free Tier)

## Mejoras Futuras

- [ ] Rate limiting
- [ ] Tests unitarios
