import { Method, Endpoint } from "../../../";
import { User } from "../modules/authenticate";

const endpoints: Endpoint[] = [
    {
        path: "/",
        method: Method.GET,
        handler: async () => {
            return {
                hello: "world"
            }
        }
    },
    {
        path: "/user",
        method: Method.GET,
        modules: {
            authenticate: true
        },
        handler: async (_, { user }: { user: User }) => {
            return {
                logged_in: true,
                user
            }
        }
    },
    {
        path: "/error",
        method: Method.GET,
        handler: async () => {
            throw {
                status: 418,
                message: "Something went wrong :("
            }
        }
    }
];

export default endpoints;