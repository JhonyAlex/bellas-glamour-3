# Guía de Deployment - Bellas Glamour en Spaceship

## Información General
- **Dominio**: bellasglamour.com
- **Hosting**: Spaceship (cPanel)
- **Usuario SSH**: otfidqlcuq
- **Aplicación**: Next.js 16+ con Prisma + MySQL
- **Puerto**: 3000 (administrado por PM2)
- **Memoria disponible**: 4 GB

---

## PRE-REQUISITOS (Verificar en cPanel)

### 1. Node.js instalado
En cPanel ve a **Software > Node.js Selector** o **Setup Node.js App**
- Verifica que tengas **Node.js 18+** instalado
- npm debe estar disponible (viene con Node.js)

### 2. Base de Datos MySQL creada
En cPanel ve a **Databases > MySQL Databases**
- Crea una base de datos (ejemplo: `bellas_glamour_db`)
- Crea un usuario MySQL (ejemplo: `bellas_user`)
- Asigna el usuario a la base de datos con ALL PRIVILEGES
- **Guarda estos datos:**
  - Host: `localhost`
  - Usuario: `bellas_user`
  - Contraseña: `[TU_CONTRASEÑA_SEGURA]`
  - Base de datos: `bellas_glamour_db`

### 3. SSH habilitado
Verifica que tengas acceso SSH en cPanel

---

## PASOS DE DEPLOYMENT

### PASO 1: Conectarse por SSH

```bash
# En tu máquina local (Windows, Mac o Linux)
ssh otfidqlcuq@bellasglamour.com
# Escribe tu contraseña (la que usas para cPanel)

# Si usas clave SSH:
ssh -i /ruta/a/id_rsa otfidqlcuq@bellasglamour.com
```

### PASO 2: Crear estructura de directorios

```bash
# Una vez conectado al servidor
cd ~

# Ver el contenido
ls -la

# Deberías ver una carpeta "public_html"
# Si no existe, créala
mkdir -p public_html

# Crear directorio de logs
mkdir -p logs

# Cambiar permisos
chmod 755 public_html logs
```

### PASO 3: Clonar el repositorio

```bash
# Navegar al directorio público
cd ~/public_html

# Si la carpeta está vacía, clonar
git clone https://github.com/JhonyAlex/bellas-glamour-3.git .

# Si ya tiene contenido, actualizar
cd ~/public_html
git fetch origin
git reset --hard origin/main
```

### PASO 4: Crear archivo .env.production

Este es el archivo más importante. Aquí van tus credenciales.

```bash
# En el servidor, crear el archivo
nano .env.production
```

Copia y pega lo siguiente, **reemplazando los valores con los tuyos**:

```env
# BASE DE DATOS - Reemplaza con tus credenciales de cPanel
DATABASE_URL="mysql://bellas_user:TU_CONTRASEÑA_REAL@localhost:3306/bellas_glamour_db"

# AUTENTICACIÓN - Genera valores seguros
NEXTAUTH_SECRET="GeneraUnString32CaracteresAquiUsando: openssl rand -base64 32"
NEXTAUTH_URL="https://bellasglamour.com"

# JWT
JWT_SECRET="OtroString32Caracteres"

# STRIPE (solo si usas pagos)
STRIPE_PUBLIC_KEY="pk_live_xxxxx"
STRIPE_SECRET_KEY="sk_live_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# ENTORNO
NODE_ENV="production"
PORT="3000"
DEBUG="false"
```

Para guardar en nano:
1. Presiona `Ctrl + X`
2. Presiona `Y` (yes)
3. Presiona `Enter`

**IMPORTANTE**: Protege este archivo
```bash
chmod 600 .env.production
```

### PASO 5: Instalar dependencias

```bash
cd ~/public_html

# Instalar todas las dependencias
npm ci --prefer-offline --no-audit

# Esto puede tardar 3-5 minutos
```

### PASO 6: Configurar Prisma

```bash
cd ~/public_html

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones en la base de datos
npx prisma db push

# Si te pide confirmación, escribe "y" y presiona Enter
```

### PASO 7: Compilar la aplicación

```bash
cd ~/public_html

# Build para producción
npm run build

# Esto genera la carpeta .next
```

### PASO 8: Instalar PM2 (Process Manager)

PM2 mantiene tu aplicación corriendo 24/7

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Crear archivo de configuración
nano ecosystem.config.js
```

Copia y pega esto:

```javascript
module.exports = {
  apps: [{
    name: 'bellas-glamour',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/otfidqlcuq/logs/pm2_error.log',
    out_file: '/home/otfidqlcuq/logs/pm2_out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    watch: false,
    ignore_watch: ['node_modules', '.next', '.git'],
    max_memory_restart: '500M',
    merge_logs: true,
  }]
};
```

Guarda con `Ctrl + X`, `Y`, `Enter`

### PASO 9: Iniciar la aplicación con PM2

```bash
cd ~/public_html

# Detener si hay proceso anterior
pm2 delete bellas-glamour 2>/dev/null || true

# Iniciar con PM2
pm2 start ecosystem.config.js --env production

# Ver estado
pm2 status

# Ver logs en tiempo real
pm2 logs bellas-glamour
```

Si ves logs sin errores, ¡estamos en buen camino!

### PASO 10: Configurar reinicio automático

```bash
# Guardar configuración de PM2
pm2 save

# Crear script de startup
pm2 startup

# Ejecuta el comando que te muestra PM2 (depende de tu sistema)
# Será algo como:
# sudo /home/otfidqlcuq/.pm2/bin/pm2 startup linux -u otfidqlcuq --hp /home/otfidqlcuq
```

### PASO 11: Configurar proxy en cPanel (IMPORTANTE)

Tu aplicación corre en el puerto 3000, pero cPanel necesita redirigir el tráfico HTTP/HTTPS.

En cPanel > **Setup Node.js App**:
1. Crea una nueva aplicación
2. Selecciona `/home/otfidqlcuq/public_html`
3. Puerto: `3000`
4. Script: `npm start`
5. Guarda

O si usas Apache, crea un `.htaccess` en la raíz:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
</IfModule>
```

### PASO 12: SSL/TLS

En cPanel > **SSL/TLS**:
1. Ve a "Manage SSL sites"
2. Selecciona tu dominio y SSL certificate
3. O usa Let's Encrypt (gratis) si no tienes SSL

---

## VERIFICACIÓN

### Probar que está corriendo

```bash
# En el servidor
curl http://localhost:3000

# Deberías ver HTML de la aplicación
```

### Ver logs

```bash
# Logs en tiempo real
pm2 logs bellas-glamour

# Últimas 100 líneas
pm2 logs bellas-glamour --lines 100

# Logs de errores
cat /home/otfidqlcuq/logs/pm2_error.log
```

### Probar en el navegador

Abre en tu navegador:
- https://bellasglamour.com

Debería cargar tu aplicación sin errores.

---

## COMANDOS ÚTILES

```bash
# Ver estado de la app
pm2 status

# Ver información detallada
pm2 show bellas-glamour

# Reiniciar la app
pm2 restart bellas-glamour

# Detener la app
pm2 stop bellas-glamour

# Iniciar la app
pm2 start bellas-glamour

# Ver todas las aplicaciones
pm2 list

# Monitoreo en tiempo real
pm2 monit

# Guardar estado
pm2 save

# Flush logs (borrar logs viejos)
pm2 flush

# Actualizar código (después de git push)
cd ~/public_html
git pull origin main
npm ci
npm run build
pm2 restart bellas-glamour
```

---

## ACTUALIZAR CÓDIGO

Cuando hagas cambios en GitHub:

```bash
# Conectar por SSH
ssh otfidqlcuq@bellasglamour.com

# Navegar a la carpeta
cd ~/public_html

# Actualizar código
git pull origin main

# Instalar dependencias nuevas (si las hay)
npm ci

# Compilar
npm run build

# Reiniciar aplicación
pm2 restart bellas-glamour

# Ver logs
pm2 logs bellas-glamour
```

---

## SOLUCIÓN DE PROBLEMAS

### La app no inicia
```bash
# Ver logs de error
pm2 logs bellas-glamour

# Revisar el archivo .env.production
cat ~/public_html/.env.production

# Verificar que MongoDB está accesible
npx prisma db execute --stdin < << 'EOF'
SELECT 1;
EOF
```

### Puerto ya en uso
```bash
# Buscar qué proceso está usando el puerto 3000
lsof -i :3000

# O matar el proceso (cuidado)
kill -9 <PID>

# Reiniciar PM2
pm2 restart bellas-glamour
```

### Memoria insuficiente
```bash
# Ver uso de memoria
free -h

# PM2 reinicia automáticamente si supera 500MB
# Puedes cambiar el límite en ecosystem.config.js
```

### SSL/HTTPS no funciona
- Verifica que el SSL esté activo en cPanel
- Revisa que NEXTAUTH_URL use https://

---

## SOPORTE

Si tienes problemas:
1. Revisa los logs: `pm2 logs bellas-glamour`
2. Verifica .env.production
3. Asegúrate que la base de datos está conectada
4. Revisa permisos de carpetas (755 para public_html)

---

## RESUMEN RÁPIDO

```bash
# 1. Conectar
ssh otfidqlcuq@bellasglamour.com

# 2. Ir a carpeta
cd ~/public_html

# 3. Clonar/actualizar
git clone https://github.com/JhonyAlex/bellas-glamour-3.git .

# 4. Crear .env.production (con tus credenciales)
nano .env.production

# 5. Instalar
npm ci

# 6. Setup DB
npx prisma generate && npx prisma db push

# 7. Build
npm run build

# 8. PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup

# 9. Verificar
curl http://localhost:3000
pm2 logs bellas-glamour

# 10. Abrir en navegador
# https://bellasglamour.com
```

---

**¡Listo! Tu aplicación debería estar en vivo.**
