import { ValidationObject } from "../types";

export function validate(validation: ValidationObject, object: any) {
    if (!object || typeof object !== "object") throw new Error("Object for validation is invalid");

    let new_object: {[ key: string ]: any } = {}

    for (let key of Object.keys(validation)) {
        let o = object[key];

        let validator = validation[key];

        if (typeof validator === "function") new_object[key] = validator(o);
        else new_object[key] = validate(validator, o);
    }

    return new_object;
}
