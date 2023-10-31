
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

(() => {
    const path = getEnvFilePath();

    const result = dotenv.config({ path });

    if (result.error) {
        throw result.error;
    }
})();

function getEnvFilePath() {
    const env = process.env.NODE_ENV || 'development';

    if (!env) {
        throw new Error("No environment variable provided");
    }

    let envPath: string = path.join(__dirname, `./${env}.env`);

    if (!fs.existsSync(envPath)) {
        envPath = path.join(__dirname, `./production.env`)
    }

    if (!fs.existsSync(envPath)) {
        throw new Error('No env file exists...');
    }

    return envPath;
}
