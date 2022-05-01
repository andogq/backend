import path from "path";
import express from "express";

import {
    Endpoint,
    is_endpoint,
    
    is_handled_error,
    
    Module
} from "./types";

import {
    find_files
} from "./util";

import validate from "./validation";

const INDEX_PATH = "index";
const ACCEPTED_EXTENSIONS = [
    "js"
];

export default async ({ api_directory, module_directory, port }: { api_directory: string, module_directory: string, port: number }) => {
    // Resolve the full API directory
    let parent_module_path = require.main?.path || null;
    if (parent_module_path === null) throw new Error("Unable to determine path of parent module");
    let full_api_directory = path.resolve(parent_module_path, api_directory);
    let full_module_directory = path.resolve(parent_module_path, module_directory);

    // Load modules
    let module_files = await find_files(full_module_directory, ACCEPTED_EXTENSIONS);
    let modules: {[ key: string ]: Module } = {};

    // Get a list of all the files
    let files = await find_files(full_api_directory, ACCEPTED_EXTENSIONS);

    // Import the files and add them to the router
    let app = express();
    app.use(express.json());

    await Promise.all([
        ...module_files.map(async module_file => {
            let default_export = (await import(module_file)).default;
            let module_name = path.basename(module_file).replace(/\.\w+$/, "");

            if (typeof default_export !== "function") throw new Error(`Module ${module_name} default export is not a function`);
            if (modules[module_name] !== undefined) throw new Error(`Duplicate modules found: ${module_name}`);

            modules[module_name] = default_export as Module;
        }),
        ...files.map(async file => {
            let default_export = (await import(file)).default;
            let endpoints_valid = (
                Array.isArray(default_export) &&
                default_export.reduce((valid: boolean, endpoint: any) => (
                    valid && is_endpoint(endpoint)
                ), true)
            );

            if (endpoints_valid) {
                let endpoints: Endpoint[] = default_export;

                // Determine the base for the file
                let file_base = "/" + path.relative(full_api_directory, file).replace(/\.\w+$/, "");
                // If index file disregard the file name
                if (path.basename(file_base) === INDEX_PATH) file_base = path.resolve(file_base, "../");

                for (let endpoint of endpoints) {
                    let endpoint_path = path.join(file_base, endpoint.path);
                    
                    app[endpoint.method](endpoint_path, async (req, res) => {
                        let status = 200;
                        let response: any = "";
                        let module_data = {};
                        let valid = false;
                        let modules_passed = false;

                        // Call modules
                        if (endpoint.modules) {
                            for (let module_name of Object.keys(endpoint.modules)) {
                                let module = modules[module_name];

                                if (module) {
                                    let result = await Promise.resolve(module(req, res));

                                    if (result) {
                                        modules_passed = true;

                                        if (typeof result === "object") module_data = {...module_data, ...result};
                                    } else modules_passed = false;
                                } else console.error(`Unknown module requested ${module_name} from ${endpoint_path}`);
                            }
                        } else modules_passed = true;

                        if (modules_passed) {
                            // Perform validation
                            let { body, params: parameters, query } = req;

                            let args: {[ key: string ]: any } = {};

                            if (endpoint.validation !== undefined) {
                                try {
                                    if (endpoint.validation.body !== undefined) args = {
                                        ...args,
                                        ...validate(endpoint.validation.body, body)
                                    }
                                    if (endpoint.validation.parameters !== undefined) args = {
                                        ...args,
                                        ...validate(endpoint.validation.parameters, parameters)
                                    }
                                    if (endpoint.validation.query !== undefined) args = {
                                        ...args,
                                        ...validate(endpoint.validation.query, query)
                                    }

                                    valid = true;
                                } catch (e) {
                                    console.error("Problem validating arguments:", e);

                                    status = 400;
                                    response = {
                                        status: 400,
                                        message: "Invalid arguments provided"
                                    }
                                }
                            } else valid = true;

                            if (valid) {
                                // Call handler
                                try {
                                    response = await Promise.resolve(endpoint.handler(args, module_data));
                                } catch (e) {
                                    if (is_handled_error(e)) {
                                        status = e.status;
                                        response = {
                                            status: e.status,
                                            message: e.message
                                        };
                                    } else {
                                        console.error(`Unhandled internal error in endpoint ${endpoint_path}`);
                                        console.error(e);

                                        status = 500;
                                        response = {
                                            status: 500,
                                            message: "Internal error"
                                        }
                                    }
                                }
                            }

                            // Return response
                            res.status(status).send(response);
                        }
                    });
                }
            } else throw new Error(`Invalid endpoint file ${file}`);
        })
    ]);

    app.listen(port);
}

export * from "./types";
export * from "./validation";
