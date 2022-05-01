import { Endpoint, Method, validation } from "../../../../";

const endpoints: Endpoint[] = [
    {
        path: "/",
        method: Method.GET,
        handler: ({ string }) => {
            return {
                message: `You sent ${string}`
            }
        },
        validation: {
            query: {
                string: validation.string
            }
        }
    },
    {
        path: "/:string",
        method: Method.GET,
        handler: ({ string }) => {
            return {
                message: `You sent ${string}`
            }
        },
        validation: {
            parameters: {
                string: validation.string
            }
        }
    },
    {
        path: "/",
        method: Method.POST,
        handler: ({ string }) => {
            return {
                message: `You sent ${string}`
            }
        },
        validation: {
            body: {
                string: validation.string
            }
        }
    }
];

export default endpoints;
