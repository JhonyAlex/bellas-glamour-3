# Estado del Deployment - Bellas Glamour en Spaceship

**Fecha última actualización**: 2026-02-16
**Estado actual**: En proceso - Falta compilar y ejecutar

---

## ✅ COMPLETADO

### 1. Documentación de Deployment
- ✅ `DEPLOYMENT_GUIDE.md` - Guía completa paso a paso
- ✅ `DEPLOYMENT_CHECKLIST.md` - Checklist interactivo
- ✅ `MYSQL_SETUP.md` - Configuración de base de datos
- ✅ `QUICK_REFERENCE.txt` - Comandos rápidos
- ✅ `deploy.sh` - Script automatizado
- ✅ Documentación pusheada a GitHub

### 2. Base de Datos MySQL
- ✅ Base de datos creada en cPanel
  - **Nombre**: `otfidqlcuq_bellas_glamour`
  - **Usuario**: `otfidqlcuq_glamour2026`
  - **Contraseña**: `#EvfZNUJxY86pM`
- ✅ Migraciones de Prisma ejecutadas correctamente
- ✅ Schema MySQL sincronizado (con provider "mysql")

### 3. Acceso SSH y Repositorio
- ✅ Conexión SSH funcionando
  - **Usuario**: `otfidqlcuq`
  - **Servidor**: `bellasglamour.com`
  - **Clave SSH**: `id_rsa` con contraseña `Accesso.2025`
- ✅ Repositorio clonado en servidor
  - **Ubicación**: `/home/otfidqlcuq/bellasglamour.com/bellas-glamour-3`
- ✅ Archivo `.env.production` creado con credenciales correctas

### 4. Node.js y Dependencias
- ✅ Node.js 20.20.0 instalado en Spaceship
- ✅ npm install ejecutado
- ✅ Prisma Cliente generado
- ✅ Problemas de dependencias resueltos:
  - Agregado `bcryptjs`
  - Downgrade a Tailwind CSS 3 (de 4)
  - Agregado `autoprefixer`

### 5. Configuración de Aplicación
- ✅ `.env.production` con variables correctas
- ✅ `next.config.ts` limpiado (sin Turbopack)
- ✅ `postcss.config.mjs` actualizado para Tailwind 3
- ✅ `prisma/schema.prisma` configurado con provider "mysql"

---

## ⏳ EN PROGRESO / PENDIENTE

### 🔴 BLOQUEADOR ACTUAL: npm run build

**Problema**: El build de Next.js está fallando porque las dependencias en el symlink de cPanel no se actualizan automáticamente.

**Última acción**:
- Downgrade a Tailwind 3 completado en local
- Cambio a PostCSS config con `tailwindcss` + `autoprefixer`
- Pendiente: Ejecutar `npm run build` en el servidor con estas nuevas dependencias

**Próximo paso inmediato**:
```bash
cd /home/otfidqlcuq/bellasglamour.com/bellas-glamour-3
git pull origin main
rm -rf node_modules .next
npm install
npm run build
```

---

## 📋 PASOS RESTANTES (Después de resolver build)

### PASO 8: Verificar que npm run build compile correctamente
- [ ] El build debe generar `.next/standalone` sin errores
- Si falla, revisar logs en el servidor

### PASO 9: Instalar y configurar PM2
```bash
npm install -g pm2
nano ecosystem.config.js  # Crear archivo de config
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

**ecosystem.config.js debería contener:**
```javascript
module.exports = {
  apps: [{
    name: 'bellas-glamour',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'production', PORT: 3000 },
    error_file: '/home/otfidqlcuq/logs/pm2_error.log',
    out_file: '/home/otfidqlcuq/logs/pm2_out.log',
    watch: false,
    max_memory_restart: '500M',
  }]
};
```

### PASO 10: Configurar cPanel para proxy de Node.js
- [ ] En cPanel > "Setup Node.js App"
- [ ] Asegurarse que está configurado:
  - Application root: `/home/otfidqlcuq/bellasglamour.com/bellas-glamour-3`
  - Application URL: `bellasglamour.com`
  - Node.js version: `20.x`
  - Startup file: `npm start`

### PASO 11: Verificar SSL/TLS
- [ ] En cPanel > "SSL/TLS"
- [ ] Confirmar que `bellasglamour.com` tiene certificado válido
- [ ] Si no, crear con Let's Encrypt (gratuito)

### PASO 12: Pruebas finales
```bash
# En el servidor
pm2 status
pm2 logs bellas-glamour --lines 50
curl http://localhost:3000
```

- [ ] Verificar que la app responde en puerto 3000
- [ ] Abrir en navegador: https://bellasglamour.com
- [ ] Confirmar que carga sin errores

---

## 📊 ARQUITECTURA FINAL

```
bellasglamour.com (Dominio)
    ↓
cPanel > SSL/TLS (HTTPS)
    ↓
cPanel > Setup Node.js App (Proxy)
    ↓
http://localhost:3000 (PM2)
    ↓
Next.js 15.5.12 App
    ↓
Prisma ORM
    ↓
MySQL Database (otfidqlcuq_bellas_glamour)
```

---

## 🔑 CREDENCIALES CRÍTICAS (Guardar seguro)

**SSH**
- Usuario: `otfidqlcuq`
- Servidor: `bellasglamour.com`
- Clave: `~/.ssh/id_rsa`
- Contraseña clave: `Accesso.2025`

**MySQL**
- Host: `localhost`
- Usuario: `otfidqlcuq_glamour2026`
- Contraseña: `#EvfZNUJxY86pM`
- Base de datos: `otfidqlcuq_bellas_glamour`

**cPanel**
- Usuario: `otfidqlcuq`
- URL: `https://bellasglamour.com:2083`
- (Usa misma contraseña que SSH)

---

## 📁 ARCHIVOS IMPORTANTES EN SERVIDOR

```
/home/otfidqlcuq/bellasglamour.com/bellas-glamour-3/
├── .env.production          ← SECRETO - no commitear
├── .next/                   ← Se genera con npm run build
├── node_modules/            ← Se genera con npm install
├── prisma/
│   ├── schema.prisma        ← Schema (MySQL provider)
│   └── migrations/          ← Migraciones
├── src/                     ← Código fuente
├── public/                  ← Archivos estáticos
├── ecosystem.config.js      ← Config PM2 (por crear)
├── next.config.ts           ← Config Next.js
├── postcss.config.mjs       ← Config PostCSS
└── package.json             ← Dependencias

/home/otfidqlcuq/logs/       ← Logs de PM2
├── pm2_error.log
└── pm2_out.log
```

---

## 🚨 PROBLEMAS CONOCIDOS Y SOLUCIONES

### Problema: npm run build falla con dependencias
**Causa**: CloudLinux (Spaceship) usa symlinks de cPanel que no se actualizan automáticamente
**Solución**:
- Usar Tailwind 3 en lugar de 4
- Versiones compatibles de dependencias
- Ejecutar npm install después de cada git pull

### Problema: node_modules es symlink
**Causa**: CloudLinux requiere node_modules como symlink
**Solución**: Es normal y esperado. Dejar que cPanel lo maneje.

### Problema: Puerto 3000 en uso
**Causa**: Proceso anterior no se detuvo
**Solución**: `pm2 delete bellas-glamour && pm2 start ecosystem.config.js`

---

## 📞 COMANDOS ÚTILES PARA PRÓXIMA SESIÓN

```bash
# Conectar al servidor
ssh otfidqlcuq@bellasglamour.com

# Navegar a la app
cd /home/otfidqlcuq/bellasglamour.com/bellas-glamour-3

# Activar Node.js 20
source /home/otfidqlcuq/nodevenv/bellasglamour.com/bellas-glamour-3/20/bin/activate

# Actualizar código
git pull origin main

# Instalar deps
npm install

# Compilar
npm run build

# Iniciar con PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production

# Ver logs
pm2 logs bellas-glamour

# Verificar status
pm2 status
```

---

## ✅ CHECKLIST PARA PRÓXIMA SESIÓN

- [ ] Conectar SSH
- [ ] `npm run build` - debe compilar sin errores
- [ ] Crear `ecosystem.config.js`
- [ ] `pm2 start ecosystem.config.js`
- [ ] Verificar `pm2 status` = "online"
- [ ] Ver logs: `pm2 logs bellas-glamour`
- [ ] Probar en navegador: `https://bellasglamour.com`
- [ ] Registrar usuario de prueba
- [ ] Verificar que se guarda en BD MySQL

---

**Última persona trabajando**: Claude Haiku 4.5
**Último commit**: "Update PostCSS config for Tailwind CSS 3 compatibility"
**Repositorio**: https://github.com/JhonyAlex/bellas-glamour-3
