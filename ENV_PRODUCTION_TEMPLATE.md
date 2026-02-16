# ====================================
# Bellas Glamour - Environment Variables
# Copia este archivo a .env.production y completa los valores
# ====================================

# ====================================
# BASE DE DATOS
# ====================================
# Formato: mysql://usuario:contraseña@host:puerto/nombre_bd
# Obtén estos datos del cPanel > MySQL Databases
DATABASE_URL="mysql://bellas_user:TuContraseñaSegura123!@localhost:3306/bellas_glamour_db"

# ====================================
# NEXTAUTH - AUTENTICACIÓN
# ====================================
# Secret para firmar JWT tokens - GENERA UNO SEGURO
# Linux: openssl rand -base64 32
# Windows: [System.Convert]::ToBase64String((1..32|ForEach-Object{Get-Random -Max 256}))
NEXTAUTH_SECRET="GeneraUnStringSuperSeguroAquiMismoDe32Caracteres"

# URL de tu aplicación
NEXTAUTH_URL="https://bellasglamour.com"

# ====================================
# JWT CUSTOM
# ====================================
# Secret para JWT personalizado
JWT_SECRET="GeneraOtroStringSuperSeguroParaJWT"

# ====================================
# STRIPE (Si usas pagos)
# ====================================
# Obtén estos valores de tu dashboard de Stripe
STRIPE_PUBLIC_KEY="pk_live_tus_claves_aqui"
STRIPE_SECRET_KEY="sk_live_tus_claves_aqui"
STRIPE_WEBHOOK_SECRET="whsec_tus_claves_aqui"

# ====================================
# NODE ENVIRONMENT
# ====================================
NODE_ENV="production"

# ====================================
# PUERTO DE LA APLICACIÓN
# ====================================
# En Spaceship, suele ser 3000 o el que configures en cPanel
PORT="3000"

# ====================================
# LOGS Y DEBUG
# ====================================
# En producción, déjalo en false
DEBUG="false"

# ====================================
# NEXT.JS CONFIG
# ====================================
# Análisis de builds (opcional)
NEXT_PUBLIC_ANALYTICS_ID=""

# ====================================
# NOTAS DE SEGURIDAD
# ====================================
# ⚠️  NUNCA commits este archivo a Git
# ⚠️  Asegúrate que .env.production esté en .gitignore
# ⚠️  Usa contraseñas fuertes para la base de datos
# ⚠️  Genera secretos nuevos, NO uses los ejemplos
# ⚠️  Protege este archivo en el servidor (permisos 600)
