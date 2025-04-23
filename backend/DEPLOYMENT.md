# Инструкция по развертыванию NAbai Education System

## Требования к системе

### Минимальные требования
- CPU: 4 ядра
- RAM: 8 GB
- Disk: 50 GB SSD
- OS: Ubuntu 22.04 LTS или новее

### Рекомендуемые требования
- CPU: 8 ядер
- RAM: 16 GB
- Disk: 100 GB SSD
- OS: Ubuntu 22.04 LTS или новее

## Подготовка системы

1. Обновление системы:
```bash
sudo apt update && sudo apt upgrade -y
```

2. Установка Docker и Docker Compose:
```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo apt install docker-compose-plugin
```

3. Настройка прав:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

## Настройка окружения

1. Клонирование репозитория:
```bash
git clone https://github.com/your-org/nabai.git
cd nabai/backend
```

2. Создание файла окружения:
```bash
cp .env.example .env
```

3. Настройка переменных окружения в файле .env:
```bash
# Генерация секретных ключей
JWT_SECRET_KEY=$(openssl rand -hex 32)
SECURITY_PASSWORD_SALT=$(openssl rand -hex 32)

# Настройка этих значений в .env файле
sed -i "s/your_jwt_secret_key/$JWT_SECRET_KEY/" .env
sed -i "s/your_password_salt/$SECURITY_PASSWORD_SALT/" .env
```

## Развертывание

1. Создание сети Docker:
```bash
docker network create nabai_network
```

2. Запуск сервисов:
```bash
docker-compose up -d
```

3. Применение миграций базы данных:
```bash
docker-compose exec api alembic upgrade head
```

4. Создание первого администратора:
```bash
docker-compose exec api python -m scripts.create_admin
```

## Проверка работоспособности

1. API:
```bash
curl http://localhost:8000/health
```

2. PostgreSQL:
```bash
docker-compose exec postgres psql -U nabai_user -d nabai_db -c "\l"
```

3. Redis:
```bash
docker-compose exec redis redis-cli ping
```

4. RabbitMQ:
```bash
curl http://localhost:15672
```

5. Prometheus:
```bash
curl http://localhost:9090/-/healthy
```

6. Grafana:
```bash
curl http://localhost:3000/api/health
```

## Мониторинг

1. Доступ к Grafana:
- URL: http://localhost:3000
- Login: admin
- Password: admin (измените при первом входе)

2. Настройка дашбордов:
- Импортируйте дашборды из папки grafana/dashboards
- Настройте источники данных (Prometheus)

3. Проверка алертов:
```bash
curl http://localhost:9090/api/v1/alerts
```

## Логирование

1. Просмотр логов API:
```bash
docker-compose logs -f api
```

2. Просмотр логов базы данных:
```bash
docker-compose logs -f postgres
```

3. Все логи хранятся в директории logs/

## Резервное копирование

1. База данных:
```bash
# Создание бэкапа
docker-compose exec postgres pg_dump -U nabai_user nabai_db > backup.sql

# Восстановление из бэкапа
cat backup.sql | docker-compose exec -T postgres psql -U nabai_user -d nabai_db
```

2. Файлы:
```bash
# Бэкап загруженных файлов
tar -czf uploads_backup.tar.gz uploads/
```

## Обновление

1. Обновление кода:
```bash
git pull origin main
```

2. Пересборка и перезапуск контейнеров:
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

3. Применение миграций:
```bash
docker-compose exec api alembic upgrade head
```

## Масштабирование

1. Горизонтальное масштабирование API:
```bash
docker-compose up -d --scale api=3
```

2. Настройка Nginx для балансировки нагрузки:
```bash
# Установка Nginx
sudo apt install nginx

# Настройка конфигурации
sudo nano /etc/nginx/sites-available/nabai
```

## Безопасность

1. Настройка файрвола:
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. Настройка SSL:
```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com
```

3. Регулярное обновление системы:
```bash
sudo apt update && sudo apt upgrade -y
```

## Устранение неполадок

1. Проверка статуса сервисов:
```bash
docker-compose ps
```

2. Проверка использования ресурсов:
```bash
docker stats
```

3. Очистка неиспользуемых ресурсов:
```bash
docker system prune -a
```

## Контакты поддержки

- Email: support@nabai.edu
- Telegram: @nabai_support
- GitHub Issues: https://github.com/your-org/nabai/issues 