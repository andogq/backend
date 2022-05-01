import { Request, Response } from "express";

export type ModuleReturnValue = undefined | true | {[ key: string ]: any };

export type Module = (req: Request, res: Response, data?: any) => Promise<ModuleReturnValue> | ModuleReturnValue;
