import {
    Method,

    ValidationObject,
    is_validation_object
} from "./";

export type Endpoint = {
    path: string,
    method: Method,
    modules?: {[ key: string ]: any },
    handler: (args: any, module_data: any) => any,
    validation?: {
        body?: ValidationObject,
        parameters?: ValidationObject,
        query?: ValidationObject
    }
}

export function is_endpoint(endpoint: any): endpoint is Endpoint {
    return (
        endpoint &&
        typeof endpoint === "object" &&

        typeof endpoint.path === "string" &&
        endpoint.path.length > 0 &&

        typeof endpoint.method === "string" &&
        Object.values(Method).includes(endpoint.method) &&

        (
            !endpoint.modules ||
            typeof endpoint.modules === "object"
        ) &&

        typeof endpoint.handler === "function" &&

        (
            !endpoint.validation ||
            (
                typeof endpoint.validation === "object" &&
                ["body", "parameters", "query"].reduce((valid: boolean, key: string) => (
                    valid &&
                    (
                        !endpoint.validation[key] ||
                        is_validation_object(endpoint.validation[key])
                    )
                ), true)
            )
        )
    );
}