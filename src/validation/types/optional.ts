import { ValidationFunction, ValidationObject } from "../../types";
import { validate } from "../validate";

export default (validation: ValidationFunction | ValidationObject, default_value: any) => (
    (value: any) => {
        try {
            if (typeof validation === "function") return validation(value);
            else return validate(validation, value);
        } catch {
            return default_value;
        }
    }
);