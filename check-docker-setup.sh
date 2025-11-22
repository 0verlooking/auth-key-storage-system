#!/bin/bash

# ============================================================================
# Docker Setup Verification Script
# Auth Key Storage System
# ============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Auth Key Storage System - Docker Setup Verification${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ============================================================================
# Check Required Files
# ============================================================================

echo -e "${YELLOW}📋 Перевірка наявності файлів...${NC}"
echo ""

required_files=(
    "docker-compose.yml"
    "Makefile"
    ".env.docker"
    "backend/Dockerfile"
    "backend/.dockerignore"
    "frontend/Dockerfile"
    "frontend/nginx.conf"
    "frontend/.dockerignore"
    "docs/DOCKER_SETUP.md"
)

all_files_present=true

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file - NOT FOUND"
        all_files_present=false
    fi
done

echo ""

if [ "$all_files_present" = false ]; then
    echo -e "${RED}❌ Деякі файли відсутні!${NC}"
    exit 1
fi

# ============================================================================
# Check Docker Installation
# ============================================================================

echo -e "${YELLOW}🐳 Перевірка Docker...${NC}"
echo ""

if command -v docker &> /dev/null; then
    docker_version=$(docker --version | awk '{print $3}' | tr -d ',')
    echo -e "  ${GREEN}✓${NC} Docker встановлено: $docker_version"
else
    echo -e "  ${RED}✗${NC} Docker не встановлено"
    echo -e "  ${YELLOW}→${NC} Встановіть Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# ============================================================================
# Check Docker Compose Installation
# ============================================================================

if command -v docker-compose &> /dev/null; then
    compose_version=$(docker-compose --version | awk '{print $4}' | tr -d ',')
    echo -e "  ${GREEN}✓${NC} Docker Compose встановлено: $compose_version"
else
    echo -e "  ${RED}✗${NC} Docker Compose не встановлено"
    echo -e "  ${YELLOW}→${NC} Встановіть Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo ""

# ============================================================================
# Check Make Installation
# ============================================================================

echo -e "${YELLOW}🔧 Перевірка Make...${NC}"
echo ""

if command -v make &> /dev/null; then
    make_version=$(make --version | head -n1 | awk '{print $3}')
    echo -e "  ${GREEN}✓${NC} Make встановлено: $make_version"
else
    echo -e "  ${YELLOW}⚠${NC} Make не встановлено (опціонально)"
    echo -e "  ${YELLOW}→${NC} Можна використовувати docker-compose команди напряму"
fi

echo ""

# ============================================================================
# Check Ports Availability
# ============================================================================

echo -e "${YELLOW}🔌 Перевірка портів...${NC}"
echo ""

check_port() {
    local port=$1
    local service=$2

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 || netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo -e "  ${RED}✗${NC} Порт $port ($service) вже зайнятий"
        return 1
    else
        echo -e "  ${GREEN}✓${NC} Порт $port ($service) вільний"
        return 0
    fi
}

all_ports_free=true

check_port 80 "Frontend" || all_ports_free=false
check_port 8080 "Backend" || all_ports_free=false
check_port 5432 "PostgreSQL" || all_ports_free=false
check_port 6379 "Redis" || all_ports_free=false

echo ""

if [ "$all_ports_free" = false ]; then
    echo -e "${YELLOW}⚠ Деякі порти зайняті. Можна змінити порти в .env файлі${NC}"
fi

# ============================================================================
# Check Environment File
# ============================================================================

echo -e "${YELLOW}⚙️  Перевірка environment файлу...${NC}"
echo ""

if [ -f ".env" ]; then
    echo -e "  ${GREEN}✓${NC} .env файл існує"
else
    echo -e "  ${YELLOW}⚠${NC} .env файл не знайдено"
    echo -e "  ${YELLOW}→${NC} Створіть: cp .env.docker .env"
fi

echo ""

# ============================================================================
# Check System Resources
# ============================================================================

echo -e "${YELLOW}💻 Перевірка системних ресурсів...${NC}"
echo ""

# Check available memory (Linux)
if [ -f /proc/meminfo ]; then
    total_mem=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    total_mem_gb=$((total_mem / 1024 / 1024))

    if [ $total_mem_gb -ge 4 ]; then
        echo -e "  ${GREEN}✓${NC} RAM: ${total_mem_gb}GB (достатньо)"
    else
        echo -e "  ${YELLOW}⚠${NC} RAM: ${total_mem_gb}GB (рекомендується 4GB+)"
    fi
fi

# Check available disk space
if command -v df &> /dev/null; then
    available_space=$(df -BG . | tail -1 | awk '{print $4}' | tr -d 'G')

    if [ $available_space -ge 10 ]; then
        echo -e "  ${GREEN}✓${NC} Disk space: ${available_space}GB (достатньо)"
    else
        echo -e "  ${YELLOW}⚠${NC} Disk space: ${available_space}GB (рекомендується 10GB+)"
    fi
fi

echo ""

# ============================================================================
# Validate docker-compose.yml
# ============================================================================

echo -e "${YELLOW}🔍 Валідація docker-compose.yml...${NC}"
echo ""

if command -v docker-compose &> /dev/null; then
    if docker-compose config --quiet 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} docker-compose.yml валідний"
    else
        echo -e "  ${RED}✗${NC} Помилка в docker-compose.yml"
        docker-compose config 2>&1 | head -5
        exit 1
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Не можу перевірити (docker-compose не встановлено)"
fi

echo ""

# ============================================================================
# Summary
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Перевірка завершена!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${GREEN}✓ Всі необхідні файли присутні${NC}"
echo -e "${GREEN}✓ Docker та Docker Compose встановлені${NC}"

if [ "$all_ports_free" = true ]; then
    echo -e "${GREEN}✓ Всі порти вільні${NC}"
fi

echo ""
echo -e "${YELLOW}Наступні кроки:${NC}"
echo ""

if [ ! -f ".env" ]; then
    echo -e "  1. Створити .env файл:"
    echo -e "     ${BLUE}cp .env.docker .env${NC}"
    echo ""
fi

echo -e "  2. Запустити проект:"
if command -v make &> /dev/null; then
    echo -e "     ${BLUE}make build${NC}"
    echo -e "     ${BLUE}make up${NC}"
else
    echo -e "     ${BLUE}docker-compose build${NC}"
    echo -e "     ${BLUE}docker-compose up -d${NC}"
fi

echo ""
echo -e "  3. Перевірити статус:"
if command -v make &> /dev/null; then
    echo -e "     ${BLUE}make status${NC}"
    echo -e "     ${BLUE}make health${NC}"
else
    echo -e "     ${BLUE}docker-compose ps${NC}"
    echo -e "     ${BLUE}curl http://localhost:8080/actuator/health${NC}"
fi

echo ""
echo -e "${YELLOW}Документація:${NC}"
echo -e "  • Швидкий старт: ${BLUE}DOCKER_QUICKSTART.md${NC}"
echo -e "  • Повна документація: ${BLUE}docs/DOCKER_SETUP.md${NC}"
echo -e "  • Make команди: ${BLUE}make help${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
