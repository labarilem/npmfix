const { exec } = require('child_process');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

const defaultOraConfig = {
  color: 'green',
  spinner: 'dots'
};

/**
 * Handles errors.
 * @param {any} err
 */
function handleError(err) {
  console.error(err);
}

/**
 * Fixes a project using NPM (async).
 * @param {string} dirPath The project directory.
 * @param {boolean} cleanCache Cleans the NPM global cache.
 * @param {boolean} install Runs \'npm i\' after fixing a project.
 * @param {boolean} alreadyFixed Pass true if a project has already been fixed.
 */
function fixProject(dirPath, cleanCache, install, alreadyFixed) {
  // reusable local data
  const dirLog = '(' + dirPath + ')';

  console.log('Detected NPM project to fix at ' + dirLog);

  // Removing node_modules
  const nodeModulesPath = path.join(dirPath, 'node_modules');
  const removeNMPromise = fs.remove(nodeModulesPath);
  ora.promise(removeNMPromise, Object.assign({ text: 'Removing node modules' }, defaultOraConfig));
  return removeNMPromise
    .then(() => {
      // Removing package.lock
      const pkgLockPath = path.join(dirPath, 'package-lock.json');
      const removePkgLockPromise = fs.remove(pkgLockPath);
      ora.promise(removePkgLockPromise, Object.assign({ text: 'Removing package-lock file' }, defaultOraConfig));
      return removePkgLockPromise;
    }, handleError)
    .then(() => {
      // Cleaning NPM global cache if requested
      // cache is cleaned at most once in a program run, even if 'install' is enabled
      if (cleanCache && !alreadyFixed) {
        const cleanCachePromise = new Promise((resolve, reject) => {
          let stdout = exec('npm cache clean --force', { stdio: [] }, (err, stdOut, stdErr) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
        ora.promise(cleanCachePromise, Object.assign({ text: 'Cleaning global NPM cache' }, defaultOraConfig));
        return cleanCachePromise;
      }
    }, handleError)
    .then(() => {
      // Running installation command ('npm install' or 'npm run setup') if requested
      if (install) {
        return fs.readJSON(path.join(dirPath, 'package.json'))
          .then((packageJson) => {
            let command = 'npm install';
            if (packageJson && packageJson.scripts && packageJson.scripts.setup && typeof packageJson.scripts.setup === 'string') {
              command = 'npm run setup';
            }
            const installPromise = new Promise((resolve, reject) => {
              let stdout = exec(command, { stdio: [], cwd: dirPath }, (err, stdOut, stdErr) => {
                if (err) {
                  return reject(err);
                }
                resolve();
              });
            });
            ora.promise(installPromise, Object.assign({ text: 'Installing NPM packages' }, defaultOraConfig));
            return installPromise;
          }, handleError);
      }
    }, handleError);
}

/**
 * Fixes the specified directory.
 * @param {string} dirPath The directory to fix.
 * @param {boolean} serious Performs an NPM cache clean action if true.
 * @param {boolean} install Runs \'npm i\' after fixing a project.
 * @param {boolean} recursive Recursively fixes directories if true.
 * @param {boolean} alreadyFixed Pass true if a project has already been fixed during the execution stack.
 */
function fixDirectory(dirPath, serious, install, recursive, alreadyFixed = false) {
  return new Promise((resolve, reject) => {
    let allPathsInDir = [];
    const allSubdirs = [];
    const allFilesInDir = [];

    try {
      allPathsInDir = fs.readdirSync(dirPath);

      allPathsInDir.forEach(p => {
        const stat = fs.statSync(path.join(dirPath, p));
        if (stat.isDirectory()) {
          allSubdirs.push(p);
        } else {
          allFilesInDir.push(p);
        }
      });
    } catch (err) {
      return reject(err);
    }

    const hasPackageJson = allFilesInDir.findIndex(p => p.endsWith('package.json')) >= 0;

    const fixPromise = hasPackageJson ? fixProject(dirPath, serious, install, alreadyFixed) : new Promise((resolve) => { resolve() });

    fixPromise
      .then(() => {
        let lastPromise = new Promise((resolve) => { resolve() });
        if (recursive) {
          const subDirsWithoutNM = allSubdirs.filter(p => p !== 'node_modules');
          subDirsWithoutNM.forEach(p => {
            lastPromise = lastPromise.then(() => {
              return fixDirectory(path.join(dirPath, p), serious, install, recursive, alreadyFixed || hasPackageJson);
            }, handleError);
          });
        }
        lastPromise
          .then(() => {
            resolve()
          }, handleError);
      }, handleError);
  });

}

exports.fixDirectory = fixDirectory;
