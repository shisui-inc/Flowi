# 🚀 Flowi App — Guía de Deploy Completo
## Supabase + Vercel (100% Gratis)

---

## ⏱ Tiempo estimado: 15-20 minutos

---

## PASO 1: Configurar Supabase

### 1.1 Crear proyecto
1. Ve a https://supabase.com y haz login
2. Click **"New project"**
3. Nombre: `flowi-app` | Elige región más cercana a tus usuarios
4. Anota la contraseña de la base de datos
5. Espera ~2 minutos mientras se crea

### 1.2 Crear la base de datos
1. En el dashboard de Supabase → **SQL Editor** → **New query**
2. Copia y pega todo el contenido del archivo `db/schema.sql`
3. Click **Run** (verde)
4. Deberías ver "Success. No rows returned"

### 1.3 Configurar autenticación con Google
1. En Supabase → **Authentication** → **Providers**
2. Activa **Google**
3. Necesitas crear credenciales OAuth en Google Cloud Console:
   - Ve a https://console.cloud.google.com
   - Crea un proyecto nuevo o usa uno existente
   - Busca "OAuth 2.0 credentials" → Create credentials
   - Application type: **Web application**
   - Authorized redirect URIs: `https://TU-PROYECTO.supabase.co/auth/v1/callback`
   - Copia el **Client ID** y **Client Secret** → péegalos en Supabase
4. En Supabase → Authentication → URL Configuration:
   - Site URL: `https://tu-app.vercel.app` (lo obtendrás en el Paso 3)
   - Redirect URLs: agrega `http://localhost:3000/**` y `https://tu-app.vercel.app/**`

### 1.4 Obtener las API Keys
1. En Supabase → **Settings** → **API**
2. Copia:
   - **Project URL** (algo como `https://xyzabc.supabase.co`)
   - **anon / public key** (la clave larga que empieza con `eyJ...`)

---

## PASO 2: Configurar el proyecto localmente

### 2.1 Instalar dependencias
```bash
# En la carpeta del proyecto:
npm install
```

### 2.2 Crear archivo de variables de entorno
```bash
# Copia el ejemplo:
cp .env.local.example .env.local
```

Edita `.env.local` con tus valores reales:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.3 Probar localmente
```bash
npm run dev
```
Abre http://localhost:3000 → debería redirigir a `/auth/login`

---

## PASO 3: Deploy a Vercel

### 3.1 Subir código a GitHub
```bash
git init
git add .
git commit -m "feat: flowi app initial commit"
git branch -M main
# Crea un repositorio en github.com, luego:
git remote add origin https://github.com/TU-USUARIO/flowi-app.git
git push -u origin main
```

### 3.2 Importar en Vercel
1. Ve a https://vercel.com → **Add New Project**
2. Importa tu repositorio de GitHub
3. Framework: detecta **Next.js** automáticamente
4. **Environment Variables** — agrega estas 3:
   ```
   NEXT_PUBLIC_SUPABASE_URL    = https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
   NEXT_PUBLIC_SITE_URL        = https://tu-app.vercel.app
   ```
5. Click **Deploy**
6. En ~2 minutos tendrás tu URL: `https://flowi-app-xxx.vercel.app`

### 3.3 Actualizar Supabase con la URL de Vercel
1. Vuelve a Supabase → **Authentication** → **URL Configuration**
2. **Site URL**: cambia a `https://tu-app.vercel.app`
3. **Redirect URLs**: agrega `https://tu-app.vercel.app/**`

---

## PASO 4: Verificar que todo funciona

✅ Abre tu URL de Vercel  
✅ Crea una cuenta con email  
✅ O inicia sesión con Google  
✅ Verifica que el dashboard carga  
✅ Agrega una transacción de prueba  
✅ Crea una meta de ahorro  
✅ Crea un presupuesto  
✅ Prueba exportar a CSV  
✅ Cambia el tema claro/oscuro  

---

## 🎯 Dominio personalizado (opcional, gratis)

### Con Vercel:
1. En Vercel → **Settings** → **Domains**
2. Agrega tu dominio (ej: `flowi.app`)
3. Configura los DNS en tu registrador siguiendo las instrucciones de Vercel

### Registradores baratos:
- Namecheap.com (~$8/año para .app)
- Porkbun.com (~$10/año)

---

## 📊 Límites del plan gratuito

### Supabase Free:
- 500 MB de base de datos
- 2 GB de banda ancha
- 50,000 usuarios activos/mes
- **Nota**: Los proyectos inactivos se pausan después de 7 días. Upgrading a Pro ($25/mes) elimina esta limitación.

### Vercel Hobby (Free):
- 100 GB de banda ancha
- Deployments ilimitados
- Sin límite de tiempo
- **URL personalizada**: 100% gratis con tu dominio

---

## 🛠 Comandos útiles

```bash
# Desarrollo local
npm run dev

# Build de producción (para verificar antes del deploy)
npm run build
npm start

# Linting
npm run lint

# Ver logs de Vercel en tiempo real
vercel logs
```

---

## 🆘 Problemas comunes

### "Cannot read properties of null"
→ El usuario no tiene perfil en la tabla `profiles`. 
→ Solución: Verifica que el trigger `on_auth_user_created` se ejecutó correctamente.

### Google OAuth no funciona
→ Verifica que la URL de callback en Google Console coincide exactamente con la de Supabase.

### Variables de entorno no detectadas
→ En Vercel, después de agregar variables de entorno, haz un nuevo deploy.

### Supabase "Invalid API key"
→ Asegúrate de usar la clave `anon/public`, NO la `service_role` (esa es privada).

---

## 📞 Soporte
- Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs  
- Vercel docs: https://vercel.com/docs

---

**¡Listo! Tu app Flowi está en producción. 🎉**
