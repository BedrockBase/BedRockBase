import * as fs from 'fs';
import * as path from 'path';
import { logMessage } from '../lib/terminalLogger';

const targetDirectory = 'C:\\Users\\calvi\\Desktop\\PrimeiroCodigoemProdução';

function readFilesInDirectory(directory: string) {
  try {
    // Read all files in the directory
    const files = fs.readdirSync(directory);
    
    logMessage('='.repeat(50));
    logMessage(`Reading files from: ${directory}`);
    logMessage('='.repeat(50));

    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        // If it's a directory, recursively read its contents
        logMessage(`\n📁 Directory: ${file}`);
        logMessage('-'.repeat(30));
        readFilesInDirectory(filePath);
      } else {
        // If it's a file, read and display its contents
        logMessage(`\n📄 File: ${file}`);
        logMessage('-'.repeat(30));
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          logMessage(content);
        } catch (err: any) {
          logMessage(`Error reading file ${file}: ${(err as Error).message}`);
        }
      }
    });
  } catch (err: any) {
    logMessage(`Error accessing directory: ${(err as Error).message}`);
  }
}

// Execute the function
readFilesInDirectory(targetDirectory);
