const fs = require('fs-extra');
const path = require('path');

/**
 * Fixes a project using NPM.
 * @param {string} dirPath The project directory.
 * @param {boolean} cleanCache Cleans the NPM global cache.
 */
function fixProject(dirPath, cleanCache) {
  // Removing node_modules.
  const nodeModulesPath = path.join(dirPath, 'node_modules');
  console.log('Removing node modules...');
  fs.removeSync(nodeModulesPath);
  console.log('Node modules removed');

  // Removing package.lock
  const pkgLockPath = path.join(dirPath, 'package-lock.json');
  console.log('Removing package-lock file...');
  fs.removeSync(pkgLockPath);
  console.log('Package-lock removed');

  // Cleaning NPM global cache if requested
  if(cleanCache) {

  }
}

/**
 * Fixes the specified directory.
 * @param {string} dirPath The directory to fix.
 * @param {boolean} serious Performs an NPM cache clean action if true.
 * @param {boolean} recursive Recursively fixes directories if true.
 */
function fixDirectory(dirPath, serious, recursive) {
  return new Promise((resolve, reject) => {

    try {

    } catch(err) {
      reject(err);
    }

    const allPathsInDir = fs.readdirSync(dirPath);
    const allSubdirs = [];
    const allFilesInDir = [];

    allPathsInDir.forEach(p => {
      const stat = fs.statSync(p);
      if(stat.isDirectory()) {
        allSubdirs.push(p);
      } else {
        allFilesInDir.push(p);
      }
    });

    const hasPackageJson = allFilesInDir.findIndex(p => p.endsWith('package.json')) >= 0;

    if(hasPackageJson) {
      fixProject(dirPath, serious);
    }

    if(recursive) {
      allSubdirs.forEach(p => {
        fixDirectory(p, serious, recursive);
      });
    }

    resolve();

  });
}

exports.fixDirectory = fixDirectory;
