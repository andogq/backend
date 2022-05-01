import { Endpoint, Method, validation } from "../../../../dist";

const endpoints: Endpoint[] = [
    {
        path: "/",
        method: Method.GET,
        handler: ({ number }) => {
            return {
                message: `You sent ${number}`
            }
        },
        validation: {
            query: {
                number: validation.number
            }
        }
    },
    {
        path: "/",
        method: Method.POST,
        handler: ({ number }) => {
            return {
                message: `You sent ${number}`
            }
        },
        validation: {
            body: {
                number: validation.number
            }
        }
    },
    {
        path: "/range",
        method: Method.GET,
        handler: ({ number }) => {
            return {
                message: `You sent ${number}`
            }
        },
        validation: {
            query: {
                number: validation.number_range({ min: -10, max: 10 })
            }
        }
    },
    {
        path: "/:number",
        method: Method.GET,
        handler: ({ number }) => {
            return {
                message: `You sent ${number}`
            }
        },
        validation: {
            parameters: {
                number: validation.number
            }
        }
    },
];

export default endpoints;
