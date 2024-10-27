const fs = require('fs');

const createConfigFile = (rootdir, filename) => {
    var configFile = rootdir + '/' + filename;
    var configFileExists = fs.existsSync(configFile);
    if (!configFileExists) {
        fs.writeFileSync(configFile, JSON.stringify([]), (err) => {
            if (err) {
                throw err
            }
        });
    }
    return configFile;
}

const createRootDir = (root, dirname) => {
    var rootdir = `./${root}/env/${dirname}`;

    if (!fs.existsSync(rootdir)) {
        fs.mkdirSync(rootdir, { recursive: true })
    }
    return rootdir;
}

const writeToFileAsync = async (configFile, data) => {
    try {
        // Read existing file content and parse it
        const aliasFileContent = await fs.readFile(configFile, 'utf8');
        const aliases = JSON.parse(aliasFileContent);

        // Add new data and write back to the file
        aliases.push(data);
        await fs.writeFile(configFile, JSON.stringify(aliases, null, 4));
    } catch (err) {
        console.log("Error writing to file:", err);
        throw err;
    }
};

exports.createConfigFile = createConfigFile;
exports.createRootDir = createRootDir;
exports.writeToFileAsync = writeToFileAsync;
