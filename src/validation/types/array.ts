import { ValidationFunction, ValidationObject } from "../../types";
import { validate } from "../validate";

export default (validation: ValidationObject | ValidationFunction, { min, max}: { min?: number, max?: number } = {}) => (
    (value: any) => {
        if (value && Array.isArray(value)) {
            if (min !== undefined && value.length < min) throw new Error("Array is too short");
            if (max !== undefined && value.length > max) throw new Error("Array is too long");

            return value.map(v => {
                if (typeof validation === "function") return validation(v);
                else return validate(validation, v);
            })
        } else throw new Error("Value isn't an array");
    }
);
