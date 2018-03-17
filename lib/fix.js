const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Fixes a project using NPM.
 * @param {string} dirPath The project directory.
 * @param {boolean} cleanCache Cleans the NPM global cache.
 * @param {boolean} alreadyFixed Pass true if a project has already been fixed.
 */
function fixProject(dirPath, cleanCache, alreadyFixed) {
  // Removing node_modules.
  const nodeModulesPath = path.join(dirPath, 'node_modules');
  console.log('(' + dirPath + ') Removing node modules...');
  fs.removeSync(nodeModulesPath);
  console.log('(' + dirPath + ') Node modules removed');

  // Removing package.lock
  const pkgLockPath = path.join(dirPath, 'package-lock.json');
  console.log('(' + dirPath + ') Removing package-lock file...');
  fs.removeSync(pkgLockPath);
  console.log('(' + dirPath + ') Package-lock removed');

  // Cleaning NPM global cache if requested
  if (cleanCache && !alreadyFixed) {
    console.log('Cleaning global NPM cache...');
    let stdout = execSync('npm cache clean --force', { stdio: [] });
    console.log('Global NPM cache cleaned');
  }
}

/**
 * Fixes the specified directory.
 * @param {string} dirPath The directory to fix.
 * @param {boolean} serious Performs an NPM cache clean action if true.
 * @param {boolean} recursive Recursively fixes directories if true.
 * @param {boolean} alreadyFixed Pass true if a project has already been fixed during the execution stack.
 */
function fixDirectory(dirPath, serious, recursive, alreadyFixed) {
  const allPathsInDir = fs.readdirSync(dirPath);
  const allSubdirs = [];
  const allFilesInDir = [];

  allPathsInDir.forEach(p => {
    const stat = fs.statSync(path.join(dirPath, p));
    if (stat.isDirectory()) {
      allSubdirs.push(p);
    } else {
      allFilesInDir.push(p);
    }
  });

  const hasPackageJson = allFilesInDir.findIndex(p => p.endsWith('package.json')) >= 0;

  if (hasPackageJson) {
    fixProject(dirPath, serious, alreadyFixed);
  }

  if (recursive) {
    allSubdirs.filter(p => p !== 'node_modules').forEach(p => {
      fixDirectory(path.join(dirPath, p), serious, recursive, alreadyFixed || hasPackageJson);
    });
  }
}

exports.fixDirectory = fixDirectory;
