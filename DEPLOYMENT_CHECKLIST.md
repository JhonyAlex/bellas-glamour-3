# ✅ Checklist de Deployment - Bellas Glamour en Spaceship

## Información de tu servidor
- **Dominio**: bellasglamour.com
- **Hosting**: Spaceship (cPanel)
- **Usuario SSH**: otfidqlcuq
- **Repositorio**: https://github.com/JhonyAlex/bellas-glamour-3.git
- **Rama**: main
- **Memoria disponible**: 4 GB

---

## 📋 PRE-DEPLOYMENT (Hacer antes de empezar)

### En cPanel
- [ ] Verificar que Node.js 18+ está instalado
  - Ve a: **Software > Node.js Selector** o **Setup Node.js App**

- [ ] Crear Base de Datos MySQL
  - Ve a: **MySQL Databases**
  - Nombre de BD: `otfidqlcuq_bellas_glamour`
  - Anota el nombre completo

- [ ] Crear Usuario MySQL
  - Usuario: `otfidqlcuq_bellas_user`
  - Genera contraseña muy segura (16+ caracteres)
  - **GUARDA ESTA CONTRASEÑA**

- [ ] Asignar privilegios
  - Selecciona usuario y BD
  - Marca TODOS los privilegios
  - Haz clic en "Make Changes"

- [ ] Verificar acceso SSH
  - Ve a: **Security > SSH Access**
  - Asegúrate que esté habilitado

### En tu máquina local
- [ ] Revisar que tienes acceso a la clave SSH
  - Ubicación: `C:\Users\jhony\...\.ssh\id_rsa`
  - Contraseña de la clave: `Accesso.2025`

- [ ] Verificar git está actualizado
  ```bash
  git --version
  ```

- [ ] Clonar/actualizar tu repositorio localmente
  ```bash
  cd C:\Users\jhony\Desktop\Proyectos\bellas-glamour-3
  git status
  ```

---

## 🚀 DEPLOYMENT STEPS (Hacer en orden)

### PASO 1: Conectar por SSH
- [ ] Abrir terminal
- [ ] Ejecutar: `ssh otfidqlcuq@bellasglamour.com`
- [ ] Ingresar contraseña (o usar clave SSH)

### PASO 2: Preparar directorios
- [ ] Crear estructura de carpetas
  ```bash
  mkdir -p ~/public_html
  mkdir -p ~/logs
  chmod 755 ~/public_html ~/logs
  ```

### PASO 3: Clonar/actualizar repositorio
- [ ] Navegar a carpeta pública
  ```bash
  cd ~/public_html
  ```

- [ ] Clonar repositorio (si está vacío)
  ```bash
  git clone https://github.com/JhonyAlex/bellas-glamour-3.git .
  ```

- [ ] O actualizar (si ya tiene contenido)
  ```bash
  git fetch origin
  git reset --hard origin/main
  ```

### PASO 4: Crear archivo .env.production
- [ ] Crear archivo en servidor
  ```bash
  nano ~/public_html/.env.production
  ```

- [ ] Copiar este contenido (REEMPLAZA TUS VALORES):
  ```env
  DATABASE_URL="mysql://otfidqlcuq_bellas_user:TU_CONTRASEÑA_AQUI@localhost:3306/otfidqlcuq_bellas_glamour"

  NEXTAUTH_SECRET="[GENERA UN STRING DE 32 CARACTERES]"
  NEXTAUTH_URL="https://bellasglamour.com"

  JWT_SECRET="[GENERA OTRO STRING DE 32 CARACTERES]"

  STRIPE_PUBLIC_KEY="pk_live_xxxx"
  STRIPE_SECRET_KEY="sk_live_xxxx"
  STRIPE_WEBHOOK_SECRET="whsec_xxxx"

  NODE_ENV="production"
  PORT="3000"
  DEBUG="false"
  ```

- [ ] Guardar: `Ctrl + X`, `Y`, `Enter`
- [ ] Proteger archivo: `chmod 600 .env.production`

### PASO 5: Instalar dependencias
- [ ] Ejecutar en servidor
  ```bash
  cd ~/public_html
  npm ci --prefer-offline --no-audit
  ```

- [ ] Esperar a que termine (3-5 minutos)
- [ ] Verificar que no hay errores críticos

### PASO 6: Configurar Prisma
- [ ] Generar cliente
  ```bash
  npx prisma generate
  ```

- [ ] Ejecutar migraciones
  ```bash
  npx prisma db push
  ```

- [ ] Confirmar con `y` si te pide

### PASO 7: Compilar aplicación
- [ ] Ejecutar build
  ```bash
  npm run build
  ```

- [ ] Esperar a que termine (5-10 minutos)
- [ ] Verificar que se creó la carpeta `.next`

### PASO 8: Configurar PM2
- [ ] Instalar PM2
  ```bash
  npm install -g pm2
  ```

- [ ] Crear `ecosystem.config.js`
  ```bash
  nano ~/public_html/ecosystem.config.js
  ```

- [ ] Copiar contenido del archivo proporcionado
- [ ] Guardar: `Ctrl + X`, `Y`, `Enter`

### PASO 9: Iniciar con PM2
- [ ] Verificar logs de PM2 no estén corriendo
  ```bash
  pm2 list
  ```

- [ ] Iniciar aplicación
  ```bash
  cd ~/public_html
  pm2 start ecosystem.config.js --env production
  ```

- [ ] Verificar estado
  ```bash
  pm2 status
  ```

- [ ] Ver logs (Ctrl + C para salir)
  ```bash
  pm2 logs bellas-glamour --lines 50
  ```

### PASO 10: Configurar reinicio automático
- [ ] Guardar estado de PM2
  ```bash
  pm2 save
  ```

- [ ] Crear script de startup
  ```bash
  pm2 startup
  ```

- [ ] Ejecutar el comando que PM2 sugiere (depende del SO)

### PASO 11: Configurar cPanel para proxy
- [ ] En cPanel, ir a **Setup Node.js App**
- [ ] Crear nueva aplicación o seleccionar la existente
- [ ] Directorio: `/home/otfidqlcuq/public_html`
- [ ] Puerto: `3000`
- [ ] Script: `npm start`
- [ ] Guardar cambios

### PASO 12: Verificar SSL/TLS
- [ ] En cPanel, ir a **SSL/TLS**
- [ ] Verificar que bellasglamour.com tiene certificado
- [ ] Si no, crear con Let's Encrypt (gratuito)

---

## 🧪 PRUEBAS (Hacer después de deployment)

### Prueba 1: Conexión local
- [ ] Conectar por SSH
- [ ] Ejecutar
  ```bash
  curl http://localhost:3000
  ```
- [ ] Verificar que devuelve HTML

### Prueba 2: Conexión externa
- [ ] Abrir navegador
- [ ] Ir a `https://bellasglamour.com`
- [ ] Verificar que carga la página
- [ ] Revisar que no hay errores en consola

### Prueba 3: Base de datos
- [ ] Registrar un nuevo usuario
- [ ] Verificar que se guarda en BD
- [ ] Intentar login
- [ ] Verificar que funciona

### Prueba 4: Logs
- [ ] Conectar por SSH
- [ ] Ver logs
  ```bash
  pm2 logs bellas-glamour --lines 100
  ```
- [ ] Verificar que no hay errores rojos

---

## 🔧 TROUBLESHOOTING RÁPIDO

### Si algo no funciona

**La app no inicia:**
```bash
pm2 logs bellas-glamour
# Busca mensajes de error rojo
```

**Error de base de datos:**
```bash
# Verificar que DATABASE_URL es correcto
cat ~/public_html/.env.production | grep DATABASE

# Probar conexión manual
mysql -u otfidqlcuq_bellas_user -p -h localhost -D otfidqlcuq_bellas_glamour
```

**Puerto 3000 en uso:**
```bash
lsof -i :3000
# Busca el PID y mata el proceso
kill -9 [PID]
pm2 restart bellas-glamour
```

**Memoria insuficiente:**
```bash
free -h
# PM2 reinicia automáticamente si supera 500MB
```

---

## 📝 INFORMACIÓN IMPORTANTE (Guardar en lugar seguro)

### Credenciales de BD
```
Host: localhost
Usuario: otfidqlcuq_bellas_user
Contraseña: [TU_CONTRASEÑA]
Base de datos: otfidqlcuq_bellas_glamour
Puerto: 3306
```

### Acceso SSH
```
Usuario: otfidqlcuq
Servidor: bellasglamour.com
Clave: id_rsa (ubicación: ~/.ssh/id_rsa)
```

### URL de aplicación
```
https://bellasglamour.com
```

---

## 🔄 MANTENER LA APLICACIÓN

### Actualizar código (después de push a GitHub)
```bash
ssh otfidqlcuq@bellasglamour.com
cd ~/public_html
git pull origin main
npm ci
npm run build
pm2 restart bellas-glamour
pm2 logs bellas-glamour
```

### Monitorear aplicación
```bash
# Ver estado
pm2 status

# Ver logs
pm2 logs bellas-glamour

# Monitoreo en tiempo real
pm2 monit
```

### Respaldar base de datos
```bash
ssh otfidqlcuq@bellasglamour.com
mysqldump -u otfidqlcuq_bellas_user -p otfidqlcuq_bellas_glamour > ~/backup_$(date +%Y%m%d).sql
```

---

## 📞 AYUDA

Si necesitas ayuda:
1. Revisa los logs: `pm2 logs bellas-glamour`
2. Verifica `.env.production`
3. Asegúrate que la BD está conectada
4. Revisa permisos de carpetas
5. Contacta a Spaceship support si hay problemas de servidor

---

**¡IMPORTANTE!**:
- ✅ Completa TODOS los pasos en orden
- ✅ No saltes pasos
- ✅ Verifica cada paso antes de continuar
- ✅ Guarda este documento como referencia

**Última actualización**: 2026-02-16
