export type HandledError = {
    status: number,
    message: string
};

export function is_handled_error(error: any): error is HandledError {
    return (
        error &&
        typeof error === "object" &&

        typeof error.status === "number" &&
        !isNaN(error.status) &&

        typeof error.message === "string"
    );
}
