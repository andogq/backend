import { Endpoint, Method, validation } from "../../../../";

const endpoints: Endpoint[] = [
    {
        path: "/",
        method: Method.POST,
        handler: ({ numbers }: { numbers: number[] }) => {
            return {
                message: "Numbers received",
                numbers
            }
        },
        validation: {
            body: {
                numbers: validation.array(validation.number)
            }
        }
    },
    {
        path: "/sized",
        method: Method.POST,
        handler: ({ numbers }: { numbers: number[] }) => {
            return {
                message: "Numbers received",
                numbers
            }
        },
        validation: {
            body: {
                numbers: validation.array(validation.number, { min: 1, max: 3 })
            }
        }
    }
];

export default endpoints;
