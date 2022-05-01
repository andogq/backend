import backend from "../../";

async function init() {
    await backend({
        api_directory: "./api",
        module_directory: "./modules",
        port: 8000
    });
}

init();
