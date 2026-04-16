FROM php:8.3-cli-alpine

WORKDIR /var/www/backendphp

RUN docker-php-ext-install pdo pdo_mysql

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "php database/migrate.php && php -S 0.0.0.0:8000 src/index.php"]
