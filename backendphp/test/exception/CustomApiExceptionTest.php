<?php

declare(strict_types=1);

use PHPUnit\Framework\TestCase;

final class CustomApiExceptionTest extends TestCase
{
    public function testToResponseIncludesExpectedFields(): void
    {
        $exception = new CustomApiException(
            'Erro interno no servidor.',
            500,
            'INTERNAL_ERROR',
            ['reason' => 'Falha de teste']
        );

        $payload = $exception->toResponse();

        $this->assertSame('Erro interno no servidor.', $payload['message']);
        $this->assertSame('INTERNAL_ERROR', $payload['code']);
        $this->assertSame(500, $payload['status']);
        $this->assertArrayHasKey('timestamp', $payload);
        $this->assertSame(['reason' => 'Falha de teste'], $payload['details']);
    }

    public function testValidationExceptionCarriesExpectedStatusAndCode(): void
    {
        $exception = new ValidationException('Payload invalido.');
        $payload = $exception->toResponse();

        $this->assertSame('Payload invalido.', $payload['message']);
        $this->assertSame('VALIDATION_ERROR', $payload['code']);
        $this->assertSame(422, $payload['status']);
    }
}
