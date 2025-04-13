import {AxiosResponse} from "axios";

export class ApiException extends Error {
    constructor(message: string, public response: AxiosResponse | undefined) {
        super(message);
        this.name = "ApiException";
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
//400
export class BadRequestError extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "BadRequestError";
    }
}

//401
export class UnauthorizedError extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "UnauthorizedError";
    }
}

//403
export class ForbiddenError extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "ForbiddenError";
    }
}

//404
export class NotFoundError extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "NotFoundError";
    }
}

//405
export class MethodNotAllowedError extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "MethodNotAllowedError";
    }
}

//415
export class UnsupportedMediaTypeError extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "UnsupportedMediaTypeError";
    }
}

//422
export class UnprocessableEntityError extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "UnprocessableEntityError";
    }
}

//500
export class InternalServerError extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "InternalServerError";
    }
}

//413
export class PayloadTooLarge extends ApiException {
    constructor(message: string, response: AxiosResponse | undefined) {
        super(message, response);
        this.name = "PayloadTooLarge";
    }
}