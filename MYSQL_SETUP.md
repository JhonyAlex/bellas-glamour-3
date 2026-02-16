# Guía de Configuración MySQL en Spaceship cPanel

## PASO 1: Acceder a cPanel

1. Ve a tu panel de control Spaceship
2. Usa tu usuario: `otfidqlcuq` y contraseña
3. O accede directamente a: `https://bellasglamour.com:2083` (cPanel)

---

## PASO 2: Crear Base de Datos MySQL

### Opción A: Desde cPanel (recomendado)

1. En cPanel, busca **"MySQL Databases"** o **"Bases de Datos MySQL"**
2. Haz clic en **"New Database"** o **"Crear base de datos"**
3. **Database Name**: Completa el nombre
   - El sistema prefijará con tu usuario: `otfidqlcuq_bellas_glamour`
   - **Anota el nombre completo que veas**
   - Ejemplo: `otfidqlcuq_bellas_glamour`
4. Haz clic en **"Create Database"** o **"Crear base de datos"**

**IMPORTANTE**: El nombre de la BD será: `otfidqlcuq_bellas_glamour`

---

## PASO 3: Crear Usuario MySQL

### En cPanel

1. En **MySQL Databases**, baja a la sección **"MySQL Users"** o **"Usuarios MySQL"**
2. Haz clic en **"Add New User"** o **"Añadir nuevo usuario"**
3. **Username**:
   - El sistema prefijará: `otfidqlcuq_` + tu nombre de usuario
   - Escribe: `bellas_user`
   - Resultado: `otfidqlcuq_bellas_user`
4. **Password**:
   - Genera una contraseña **muy segura** (mínimo 16 caracteres)
   - Usa: mayúsculas, minúsculas, números, símbolos
   - Ejemplo: `Kq7#mP2$vL9@xR4wZ8!bN6` ← NO USES ESTE
   - **GUARDA ESTA CONTRASEÑA EN UN LUGAR SEGURO**
5. Haz clic en **"Create User"** o **"Crear usuario"**

**IMPORTANTE**:
- Usuario MySQL: `otfidqlcuq_bellas_user`
- Contraseña: `[LA_QUE_ACABAS_DE_CREAR]`

---

## PASO 4: Asignar Privilegios

### En cPanel

1. De vuelta en **MySQL Databases**
2. Baja a **"Add User to Database"** o **"Agregar usuario a base de datos"**
3. **User**: Selecciona `otfidqlcuq_bellas_user`
4. **Database**: Selecciona `otfidqlcuq_bellas_glamour`
5. Haz clic en **"Add"** o **"Agregar"**
6. En la siguiente pantalla, **marca TODOS los privilegios**:
   - ✓ SELECT
   - ✓ INSERT
   - ✓ UPDATE
   - ✓ DELETE
   - ✓ CREATE
   - ✓ DROP
   - ✓ INDEX
   - ✓ ALTER
   - Y el resto...
7. Haz clic en **"Make Changes"** o **"Hacer cambios"**

---

## PASO 5: Verificar Conexión

### Desde cPanel

En **MySQL Databases**, hay una sección de **"MySQL Hosts"** o similar
- El host será: `localhost`

---

## PASO 6: Obtener String de Conexión

Con la información que recopilaste, tu string de conexión será:

```
mysql://otfidqlcuq_bellas_user:TU_CONTRASEÑA_AQUI@localhost:3306/otfidqlcuq_bellas_glamour
```

### Ejemplo real:
```
mysql://otfidqlcuq_bellas_user:Kq7#mP2$vL9@xR4wZ8!bN6@localhost:3306/otfidqlcuq_bellas_glamour
```

**NOTA**: Si tu contraseña tiene caracteres especiales como `@`, `#`, `:`, etc.,
necesitas codificarlos en la URL. Por ejemplo:
- `@` → `%40`
- `#` → `%23`
- `:` → `%3A`
- `?` → `%3F`
- `&` → `%26`

Usa [este codificador](https://www.urlencoder.org/) si lo necesitas.

---

## DATOS FINALES PARA TU .env.production

Copia exactamente esto en tu archivo `.env.production`:

```env
DATABASE_URL="mysql://otfidqlcuq_bellas_user:TU_CONTRASEÑA_REAL@localhost:3306/otfidqlcuq_bellas_glamour"
```

Reemplaza `TU_CONTRASEÑA_REAL` con la contraseña que creaste.

---

## VERIFICAR CONEXIÓN DESDE SSH

### Desde el servidor, verificar que la BD existe

```bash
# Conectar por SSH
ssh otfidqlcuq@bellasglamour.com

# Listar bases de datos
mysql -u otfidqlcuq_bellas_user -p
# Escribe tu contraseña

# Una vez dentro, escribe:
SHOW DATABASES;

# Deberías ver "otfidqlcuq_bellas_glamour" en la lista

# Para salir:
EXIT;
```

---

## TABLA DE REFERENCIA

| Concepto | Valor |
|----------|-------|
| **Host MySQL** | `localhost` |
| **Usuario MySQL** | `otfidqlcuq_bellas_user` |
| **Contraseña MySQL** | `[TU_CONTRASEÑA_SEGURA]` |
| **Base de datos** | `otfidqlcuq_bellas_glamour` |
| **Puerto** | `3306` (default) |
| **DATABASE_URL** | `mysql://otfidqlcuq_bellas_user:PASSWORD@localhost:3306/otfidqlcuq_bellas_glamour` |

---

## NOTAS DE SEGURIDAD

⚠️ **IMPORTANTE**:
1. **NUNCA compartas** tu contraseña MySQL
2. **NUNCA hagas commit** del .env.production a Git
3. **Usa una contraseña fuerte** (no "admin123" o "bellas123")
4. **Guarda la contraseña** en un lugar seguro (gestor de contraseñas)
5. **Verifica que solo tú** tengas acceso al servidor
6. **Respalda tu base de datos** regularmente

---

## SOPORTE

Si tienes problemas:
1. Verifica que el usuario y BD tienen los mismos prefijos
2. Asegúrate que el usuario tiene ALL PRIVILEGES
3. Prueba la conexión manualmente desde SSH
4. Revisa que `localhost` es el host correcto (no una IP diferente)

¡Una vez completado, usa el string de conexión en tu `.env.production` en el servidor!
