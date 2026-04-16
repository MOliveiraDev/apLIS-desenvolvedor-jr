<?php

declare(strict_types=1);

class CustomApiException extends Exception
{
    public readonly string $apiCode;
    public readonly int $status;
    public readonly mixed $details;
    public readonly string $timestamp;

    public function __construct(
        string $message,
        int $status = 500,
        string $apiCode = 'INTERNAL_ERROR',
        mixed $details = null
    ) {
        parent::__construct($message);

        $this->apiCode = $apiCode;
        $this->status = $status;
        $this->details = $details;
        $this->timestamp = (new DateTimeImmutable())->format(DATE_ATOM);
    }

    public function toResponse(): array
    {
        $payload = [
            'message' => $this->getMessage(),
            'code' => $this->apiCode,
            'status' => $this->status,
            'timestamp' => $this->timestamp,
        ];

        if ($this->details !== null && $this->details !== '') {
            $payload['details'] = $this->details;
        }

        return $payload;
    }
}
