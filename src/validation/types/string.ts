export default (value: any) => {
    if (typeof value === "string") return value;
    else if (value && typeof value.toString === "function") return value.toString();
    else throw new Error("Value can't be converted to string");
}