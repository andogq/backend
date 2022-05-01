import { Endpoint, Method, validation } from "../../../../dist";

const endpoints: Endpoint[] = [
    {
        path: "/",
        method: Method.GET,
        handler: ({ number }: { number: number }) => {
            return {
                message: "Number received",
                number
            }
        },
        validation: {
            query: {
                number: validation.optional(validation.number, 12345)
            }
        }
    }
];

export default endpoints;
