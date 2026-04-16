class CustomApiException extends Error {
  constructor({ message, details = '', status = 500, code = 'INTERNAL_ERROR' }) {
    super(message);
    this.name = 'CustomApiException';
    this.message = message;
    this.details = details;
    this.status = status;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }

  toResponse() {
    const payload = {
      message: this.message,
      code: this.code,
      status: this.status,
      timestamp: this.timestamp,
    };

    if (this.details) {
      payload.details = this.details;
    }

    return payload;
  }
}

module.exports = CustomApiException;
