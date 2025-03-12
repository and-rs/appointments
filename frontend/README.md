# Frontend - Sistema de Citas Médicas

Aplicación web construida con Next.js, TypeScript y Tailwind CSS, enfocada en una experiencia de usuario fluida y responsiva.

## Características Técnicas Destacadas

### Cliente HTTP Personalizado
Implementación de un cliente Axios orientado a objetos para:
- Manejo consistente de errores
- Integración con SWR
- Gestión de autenticación

```typescript
class ApiClient {
  private client: AxiosInstance;

  async fetch<T>(url: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = false, method = "get", ...rest } = config;
    const response = await this.client.request({
      url,
      method,
      headers: {
        ...(requiresAuth ? this.getAuthHeader() : {}),
      },
      ...rest,
    });
    return response.data;
  }
}
```

### Gestión de Estado
- SWR para fetching y caché
- Estado local con React hooks
- Manejo optimizado de re-renders

### Validación de Formularios
Integración de React Hook Form con Zod:
```typescript
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
});

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema)
});
```

## Estructura de Carpetas

```
src/
├── app/                    # App Router
│   ├── (auth)/            # Rutas protegidas
│   │    └── dashboard/     # Panel principal
│   └── page.tsx            # Página de login
├── components/
│   ├── appointments/      # Componentes de citas
│   │    ├── date-picker.tsx
│   │    └── doctor-select.tsx
│   └── ui/                # Componentes base
└── lib/
    ├── axios.ts            # Cliente HTTP
    └── types.ts            # Tipos TypeScript
```

## Componentes Principales

### AppointmentsList
- Listado de citas con SWR
- Manejo de estados de carga (loading states)
- Acciones de edición/eliminación
- Formato de fechas con date-fns

### Formularios
- Login/Registro con validación
- Creación/Edición de citas
- Selección de médicos y horarios
- Feedback de forms en tiempo real

## Rutas y Navegación

### Públicas
- `/` - Login/Registro

### Protegidas
- `/dashboard` - Panel principal
- `/dashboard/create` - Nueva cita

## Decisiones Técnicas

### Next.js App Router
- Fácil de desplegar
- Bastante documentación

### Componentes UI
- shadcn/ui como base, usando únicamente estilos de Tailwind CSS y no incrementar las
dependencias (solo hay algunas excepciones como selectores y el calendario)
- Diseño responsivo

### TypeScript
- Tipos estrictos
- Interfaces compartidas con backend
- Generics para componentes reusables

## Desarrollo Local

1. Configurar variables de entorno:
```bash
cp ./.env.example ./.env

# Variables requeridas:
NEXT_PUBLIC_API_URL=http://localhost:3001
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Iniciar servidor de desarrollo:
```bash
pnpm dev
```

## Integración con Backend

### Fetching de Datos
```typescript
// Ejemplo de hook para citas
function useAppointments() {
  const { data, error } = useSWR('/appointments/read',
    url => ApiClient.fetch(url, { requiresAuth: true })
  );

  return {
    appointments: data?.appointments,
    isLoading: !error && !data,
    isError: error
  };
}
```

### Manejo de Errores
- Mensajes de error específicos directos desde el backend
- Reintentos automáticos (SWR)
- Feedback visual (No está completo)

## Mejoras Futuras

- [ ] Cimentar mejor el fetching pipeline
- [ ] Optimistic UI updates
- [ ] Infinite scrolling para citas
- [ ] Temas (light y dark mode)
- [ ] Tests E2E con Cypress o Playwright
