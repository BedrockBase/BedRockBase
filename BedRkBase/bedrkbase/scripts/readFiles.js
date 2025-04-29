const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\calvi\\Desktop\\PrimeiroCodigoemProdução\\';

function readFiles(dir) {
    console.log(`========================================`);
    console.log(`Reading files from: ${dir}`);
    console.log(`========================================`);

    try {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
                console.log(`\nā Directory: ${item}`);
                console.log(`------------------------------`);
                readFiles(fullPath); // Recursively read subdirectories
            } else {
                console.log(`\nā File: ${item}`);
                console.log(`------------------------------`);
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    console.log(content);
                } catch (err) {
                    console.log(`Error reading file: ${err.message}`);
                }
            }
        }
    } catch (err) {
        console.error(`Error reading directory: ${err.message}`);
    }
}

// Start reading files from the target directory
readFiles(targetDir);