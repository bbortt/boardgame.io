const {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
} = require('node:fs');
const { join } = require('node:path');

const esmTypesDir = join(__dirname, '../dist/esm/types');
const cjsTypesDir = join(__dirname, '../dist/cjs/types');
const targetDir = join(__dirname, '../dist/types');

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

const copyFiles = (sourceDir) => {
  if (existsSync(sourceDir)) {
    const files = readdirSync(sourceDir);
    files.forEach((file) => {
      const sourceFile = join(sourceDir, file);
      const targetFile = join(targetDir, file);

      if (statSync(sourceFile).isFile()) {
        copyFileSync(sourceFile, targetFile);
        console.log(`Copied: ${sourceFile} -> ${targetFile}`);
      }
    });
  } else {
    console.warn(`Directory not found: ${sourceDir}`);
  }
};

const deleteFolderRecursive = (folderPath) => {
  if (existsSync(folderPath)) {
    readdirSync(folderPath).forEach((file) => {
      const currentPath = join(folderPath, file);
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

copyFiles(esmTypesDir);
copyFiles(cjsTypesDir);

deleteFolderRecursive(esmTypesDir);
deleteFolderRecursive(cjsTypesDir);

console.log('Merged types and cleaned up original folders.');
