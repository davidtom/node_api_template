// Create custom AppError class by extending Error
module.exports = class AppError extends Error {
    constructor(message, status) {
        // Call parent constructor of base Error class
        super(message);

        // Capture the stack trace, excluding constructor call from it
        Error.captureStackTrace(this, this.constructor);

        // Assign HTTP status for the error; Default to 500 if not specified
        this.status = status || 500;
    }
};
