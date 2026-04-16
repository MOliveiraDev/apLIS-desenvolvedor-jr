<?php

declare(strict_types=1);

require_once __DIR__ . '/CustomApiException.php';

final class ValidationException extends CustomApiException
{
    public function __construct(string $message, mixed $details = null)
    {
        parent::__construct($message, 422, 'VALIDATION_ERROR', $details);
    }
}

final class MethodNotAllowedException extends CustomApiException
{
    public function __construct(string $message = 'Metodo nao permitido.', mixed $details = null)
    {
        parent::__construct($message, 405, 'METHOD_NOT_ALLOWED', $details);
    }
}

final class DuplicateResourceException extends CustomApiException
{
    public function __construct(string $message, mixed $details = null)
    {
        parent::__construct($message, 409, 'DUPLICATE_RESOURCE', $details);
    }
}

final class NotFoundException extends CustomApiException
{
    public function __construct(string $message = 'Rota nao encontrada.', mixed $details = null)
    {
        parent::__construct($message, 404, 'NOT_FOUND', $details);
    }
}

final class StartupConfigurationException extends CustomApiException
{
    public function __construct(string $message, mixed $details = null)
    {
        parent::__construct($message, 500, 'STARTUP_CONFIGURATION_ERROR', $details);
    }
}

final class InternalServerException extends CustomApiException
{
    public function __construct(string $message = 'Erro interno no servidor.', mixed $details = null)
    {
        parent::__construct($message, 500, 'INTERNAL_ERROR', $details);
    }
}
