import {AxiosError} from "axios";
import {ApiException, BadRequestError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError, UnsupportedMediaTypeError} from "./CustomErrors.ts";

export const handleError = (error: unknown): void => {
    if (error instanceof AxiosError) {
        const { status, data } = error.response || {};
        const message = data?.message || `API Error (Status: ${status})`;

        switch (status) {
            case 400:
                console.error("Bad Request:", message, error);
                throw new BadRequestError(message, error.response);
            case 401:
                console.error("Unauthorized:", message, error);
                throw new UnauthorizedError(message, error.response);
            case 403:
                console.error("Forbidden:", message, error);
                throw new ForbiddenError(message, error.response);
            case 404:
                console.error("Not Found:", message, error);
                throw new NotFoundError(message, error.response);
            case 415:
                console.error("Unsupported Media Type:", message, error);
                throw new UnsupportedMediaTypeError(message, error.response);
            case 500:
                console.error("Internal Server Error:", message, error);
                throw new InternalServerError(message, error.response);
            default:
                console.error(`Other API Error (Status: ${status}):`, message, error);
                throw new ApiException(message, error.response);
        }
    } else if (error instanceof Error) {
        console.error("Request Failed:", error.message, error);
        throw new ApiException("Request failed: " + error.message, undefined);
    } else {
        console.error("Unexpected Error:", error);
        throw new ApiException("An unexpected error occurred.", undefined);
    }
};