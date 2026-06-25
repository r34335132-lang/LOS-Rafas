# Implementación de ligas y credenciales

## Estado incluido

- La app usa Supabase para ligas, equipos, jugadores, estadísticas, plantillas, cards y solicitudes de credencial.
- La home y la sección de fútbol ya consumen ligas reales.
- `create-league` es un wizard de 4 pasos con branding, uploads a Storage, preview y guardado.
- Las credenciales y cards usan componentes reutilizables premium.
- Los mocks fijos de fútbol demo fueron retirados del flujo principal.

## Migración SQL

Ejecutar en Supabase SQL Editor o con Supabase CLI:

```bash
supabase db push
```

Archivo:

```text
supabase/migrations/202606220001_league_platform.sql
```

Incluye tablas:

- `leagues`
- `teams`
- `players`
- `player_stats`
- `card_templates`
- `player_cards`
- `credential_requests`

Incluye buckets:

- `league-assets`
- `player-photos`
- `generated-cards`

## Variables env

En `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=TU_ANON_KEY
```

Nunca colocar `SUPABASE_SERVICE_ROLE_KEY` en la app Expo.

## Edge Function

Función base:

```text
supabase/functions/create-player-account/index.ts
```

Deploy:

```bash
supabase functions deploy create-player-account
```

Secrets requeridos en Supabase:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
```

La función valida que el usuario autenticado sea `leagues.owner_id` antes de invitar/asociar jugador.

## Flujo crear liga

1. Ir a `Crear liga`.
2. Completar información general.
3. Subir logo/banner a `league-assets`.
4. Elegir colores y estilo visual.
5. Revisar preview.
6. Crear liga.
7. La app inserta la liga y crea plantillas base:
   - Upper Deck Elite
   - Rookie Card
   - MVP Edition
   - Team Identity

## Flujo jugador/credencial

1. Crear equipo y jugador en Supabase o desde pantallas admin futuras.
2. El jugador debe tener `credential_code`.
3. Abrir `/player/:id`.
4. La credencial muestra datos reales de `players`, `teams`, `leagues` y `player_stats`.
5. Tocar la credencial alterna entre credencial digital y card premium.
6. Compartir captura usa `react-native-view-shot` y `expo-sharing`.

## RLS

Reglas principales:

- Público puede leer ligas, equipos, templates y perfiles/cards si `public_profiles_enabled = true`.
- Owner de liga puede administrar liga, equipos, jugadores, estadísticas, plantillas, cards y credential requests.
- Jugador con `auth_user_id` ligado puede ver/editar su perfil básico.
- Solicitudes de credencial sólo las administra el owner.

## Cómo probar

1. Ejecutar migración SQL.
2. Confirmar `.env`.
3. Iniciar app:

```bash
npm run web
```

4. Crear una liga desde la app.
5. En Supabase insertar un equipo y jugador asociado.
6. Abrir la liga desde Inicio o la sección Fútbol.
7. Abrir un jugador y probar compartir credencial.
8. Ejecutar:

```bash
npm run typecheck
```

## Pendientes

- Crear formularios completos de alta/edición de equipos y jugadores dentro de la app.
- Conectar `create-player-account` desde el botón administrativo final.
- Subir automáticamente el resultado de `view-shot` a `generated-cards` y guardar `player_cards.image_url`.
- Agregar activación por invitación con pantalla dedicada usando `invitation_token`.
- Ajustar políticas si se quiere lectura pública cerrada por defecto.
