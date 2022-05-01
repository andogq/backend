import fs from "fs/promises";
import path from "path";

// For a directory, return an array of paths for all of the files within that directory (included nested files)
export async function find_files(directory_path: string, accepted_extensions: string[] | null = null): Promise<string[]> {
    // Get a list of files in the current directory
    let directory_list = await fs.readdir(directory_path, { withFileTypes: true });

    let files: string[] = [];
    let promises = [];

    // Iterate through each file in the directory
    for (let file of directory_list) {
        // Determine the full path of the file
        let file_path = path.resolve(directory_path, file.name);

        // Test if the extension is an accepted extension
        let match = file_path.match(/\.(\w+)$/);
        let accepted_extension = (
            accepted_extensions === null ||
            match !== null && accepted_extensions.includes(match[1])
        );

        // If a file, add to the list, otherwise iterate again using the file's path as the directory
        if (file.isFile() && accepted_extension) files.push(file_path);
        else if (file.isDirectory()) promises.push(find_files(file_path, accepted_extensions));
    }

    files = [
        ...files,
        ...(await Promise.all(promises)).flat()
    ];

    return files;
}