import { number } from "./";

// Number between a range (inclusive)
export default ({ min, max }: { min?: number, max?: number }) => (
    (value: any) => {
        value = number(value);

        if (min !== undefined && value < min) throw new Error("Number too small");
        if (max !== undefined && value > max) throw new Error("Number too large");

        return value;
    }
);
