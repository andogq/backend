export type ValidationFunction = (value: any) => any;

export type ValidationObject = {
    [key: string]: ValidationFunction | ValidationObject
}

export function is_validation_object(object: any): object is ValidationObject {
    return (
        object &&
        typeof object === "object" &&

        Object.values(object).reduce((valid, value) => (
            valid &&
            (
                typeof value === "function" ||
                is_validation_object(value)
            )
        ), true)
    );
}