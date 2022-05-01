import { Request, Response } from "express";
import { Module } from "../../../";

const SUPER_SECRET_PASSWORD = "my_password";

export type User = {
    id: number,
    name: string,
    email: string
}

const authenticate: Module = async (req: Request, res: Response) => {
    let auth_header = req.headers.authorization;

    if (auth_header && auth_header === SUPER_SECRET_PASSWORD) return {
        // Get from DB
        user: {
            id: 103,
            name: "Some Person",
            email: "example@email.com"
        }
    };
    else {
        res.status(403).json({
            status: 403,
            message: "Invalid credentials"
        });
    }
}

export default authenticate;