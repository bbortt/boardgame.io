import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  copyFileSync,
  unlinkSync,
  rmdirSync,
} from 'fs';
import path from 'path';

const esmTypesDir = path.join(
  new URL('../dist/esm/types', import.meta.url).pathname
);
const cjsTypesDir = path.join(
  new URL('../dist/cjs/types', import.meta.url).pathname
);
const targetDir = path.join(new URL('../dist/types', import.meta.url).pathname);

// Ensure the target directory exists
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

// Function to copy files from source to target
const copyFiles = (sourceDir) => {
  if (existsSync(sourceDir)) {
    const files = readdirSync(sourceDir);
    files.forEach((file) => {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);

      if (statSync(sourceFile).isFile()) {
        copyFileSync(sourceFile, targetFile);
        console.log(`Copied: ${sourceFile} -> ${targetFile}`);
      }
    });
  } else {
    console.warn(`Directory not found: ${sourceDir}`);
  }
};

// Function to delete a directory recursively
const deleteFolderRecursive = (folderPath) => {
  if (existsSync(folderPath)) {
    readdirSync(folderPath).forEach((file) => {
      const currentPath = path.join(folderPath, file);
      if (statSync(currentPath).isDirectory()) {
        deleteFolderRecursive(currentPath);
      } else {
        unlinkSync(currentPath);
      }
    });
    rmdirSync(folderPath);
    console.log(`Deleted: ${folderPath}`);
  }
};

// Copy types from both directories
copyFiles(esmTypesDir);
copyFiles(cjsTypesDir);

// Delete the original folders
deleteFolderRecursive(esmTypesDir);
deleteFolderRecursive(cjsTypesDir);

console.log('Merged types and cleaned up original folders.');
