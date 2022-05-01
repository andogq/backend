export default (value: any) => {
    let converted_value = Number(value);

    if (value !== null && value !== undefined && !isNaN(converted_value)) return converted_value;
    else  throw new Error("Value isn't number");
}