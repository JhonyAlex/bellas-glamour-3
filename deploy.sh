#!/bin/bash

# ====================================
# Bellas Glamour - Deployment Script
# Para: Spaceship/cPanel con Node.js
# ====================================

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_step() {
    echo -e "\n${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Variables de configuración
APP_NAME="bellas-glamour"
APP_DIR="/home/otfidqlcuq/public_html"
REPO_URL="https://github.com/JhonyAlex/bellas-glamour-3.git"
BRANCH="main"
NODE_VERSION="20"

# ====================================
# PASO 1: Actualizar sistema
# ====================================
print_step "Paso 1: Verificar Node.js y npm"
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    print_info "Por favor instala Node.js 18+ desde cPanel o usando nvm"
    exit 1
fi

NODE_V=$(node --version)
NPM_V=$(npm --version)
print_success "Node.js: $NODE_V"
print_success "npm: $NPM_V"

# ====================================
# PASO 2: Clonar o actualizar repositorio
# ====================================
print_step "Paso 2: Clonando/actualizando repositorio"

if [ -d "$APP_DIR/.git" ]; then
    print_info "Repositorio existente, actualizando..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard origin/$BRANCH
else
    print_info "Clonando repositorio..."
    cd /home/otfidqlcuq
    git clone -b $BRANCH $REPO_URL public_html
    cd "$APP_DIR"
fi

print_success "Repositorio actualizado"

# ====================================
# PASO 3: Crear archivo .env.production
# ====================================
print_step "Paso 3: Verificando archivo .env.production"

if [ ! -f "$APP_DIR/.env.production" ]; then
    print_error "Archivo .env.production no existe"
    print_info "Por favor crea el archivo con las siguientes variables:"
    echo ""
    echo "DATABASE_URL=\"mysql://usuario:contraseña@localhost:3306/bellasglamour_db\""
    echo "NEXTAUTH_SECRET=\"$(openssl rand -base64 32)\""
    echo "NEXTAUTH_URL=\"https://bellasglamour.com\""
    echo "JWT_SECRET=\"$(openssl rand -base64 32)\""
    echo "STRIPE_WEBHOOK_SECRET=\"whsec_test\""
    echo ""
    exit 1
fi

print_success "Archivo .env.production encontrado"

# ====================================
# PASO 4: Instalar dependencias
# ====================================
print_step "Paso 4: Instalando dependencias"

npm ci --prefer-offline --no-audit 2>&1 | grep -E "added|up to date|npm warn"

print_success "Dependencias instaladas"

# ====================================
# PASO 5: Generar Prisma Client
# ====================================
print_step "Paso 5: Generando Prisma Client"

npx prisma generate

print_success "Prisma Client generado"

# ====================================
# PASO 6: Ejecutar migraciones
# ====================================
print_step "Paso 6: Ejecutando migraciones de base de datos"

npx prisma db push --skip-generate

print_success "Migraciones ejecutadas"

# ====================================
# PASO 7: Compilar aplicación
# ====================================
print_step "Paso 7: Compilando aplicación"

npm run build

print_success "Aplicación compilada"

# ====================================
# PASO 8: Instalar y configurar PM2
# ====================================
print_step "Paso 8: Configurando PM2"

if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Crear archivo de configuración de PM2
cat > "$APP_DIR/ecosystem.config.js" << 'EOF'
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
EOF

# Crear directorio de logs si no existe
mkdir -p /home/otfidqlcuq/logs

# Detener proceso anterior si existe
pm2 delete $APP_NAME 2>/dev/null || true

# Iniciar con PM2
pm2 start ecosystem.config.js --env production

# Guardar configuración de PM2 para reinicio automático
pm2 save
pm2 startup

print_success "PM2 configurado y ejecutando"

# ====================================
# PASO 9: Información final
# ====================================
print_step "Deployment completado"
echo ""
print_success "Tu aplicación está corriendo en:"
echo "  ${BLUE}https://bellasglamour.com${NC}"
echo ""
echo "Comandos útiles PM2:"
echo "  ${YELLOW}pm2 logs bellas-glamour${NC}              - Ver logs en tiempo real"
echo "  ${YELLOW}pm2 status${NC}                           - Estado de la aplicación"
echo "  ${YELLOW}pm2 restart bellas-glamour${NC}          - Reiniciar aplicación"
echo "  ${YELLOW}pm2 stop bellas-glamour${NC}             - Detener aplicación"
echo "  ${YELLOW}pm2 delete bellas-glamour${NC}           - Eliminar del control de PM2"
echo ""

print_info "Próximos pasos:"
echo "  1. Verificar SSL/TLS en cPanel"
echo "  2. Configurar DNS si es necesario"
echo "  3. Probar la aplicación en https://bellasglamour.com"
echo "  4. Monitorear logs: pm2 logs"
echo ""
