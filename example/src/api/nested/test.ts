import { Method, Endpoint } from "../../../../";

const endpoints: Endpoint[] = [
    {
        path: "/endpoint",
        method: Method.GET,
        handler: async () => {
            return {
                yeet: true
            }
        }
    },
    {
        path: "/square",
        method: Method.POST,
        handler: async({ value }: { value: number }) => {
            return {
                new: value * value
            }
        },
        validation: {
            body: {
                value: (value: any) => typeof value === "number" && !isNaN(value)
            }
        }
    }
];

export default endpoints;