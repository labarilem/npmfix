const chai = require('chai');
const fs = require('fs-extra');
const expect = chai.expect;
const fix = require('../lib/fix');
const path = require('path');
const recursiveReaddir = require('recursive-readdir');

const dataDir = './test/fixtures';
const testGroundDir = './test/temp';

function setup() {
  fs.copySync(dataDir, testGroundDir);
}

function clean() {
  fs.removeSync(testGroundDir);
}

describe('npmfix', () => {

  before(() => { clean(); setup(); });
  after(() => { clean() });

  it('Should correctly preserve files (NM + PkgLock)', (done) => {
    const workingDir = path.join(testGroundDir, 'nl');

    let filesBefore = [];
    let filesAfter = [];

    recursiveReaddir(workingDir)
      .then(files => {

        filesBefore = files;
        expect(filesBefore).to.exist;
        expect(filesBefore).to.have.length.greaterThan(0);
        fix.fixDirectory(workingDir, false, false, false);
        return recursiveReaddir(workingDir);

      }, err => { throw err })
      .then(files => {

        filesAfter = files;
        expect(filesAfter).to.exist;
        expect(filesAfter).to.have.length.greaterThan(0);
        expect(filesAfter).to.deep.equal(filesBefore);

        done();
      }, err => { throw err });
  });

  it('Should correctly delete and preserve files (NM + PkgLock + PkgJson)', (done) => {
    const workingDir = path.join(testGroundDir, 'npl');

    let filesBefore = [];
    let filesAfter = [];

    recursiveReaddir(workingDir)
      .then(files => {

        filesBefore = files;
        expect(filesBefore).to.exist;
        expect(filesBefore).to.have.length.greaterThan(0);
        fix.fixDirectory(workingDir, false, false, false);
        return recursiveReaddir(workingDir);

      }, err => { throw err })
      .then(files => {

        filesAfter = files;
        expect(filesAfter).to.exist;
        expect(filesAfter).to.have.length.greaterThan(0);
        expect(filesAfter).to.deep.equal(filesBefore.filter(f => f.indexOf('node_modules') < 0 && !f.endsWith('package-lock.json') ));

        done();
      }, err => { throw err });
  });

  it('Should correctly delete and preserve files (recursive)', (done) => {
    const workingDir = path.join(testGroundDir, 'recursive');
    const folderToTest = path.join(workingDir, 'nl', 'npl');

    let filesBefore = [];
    let filesAfter = [];

    recursiveReaddir(folderToTest)
      .then(files => {

        filesBefore = files;
        expect(filesBefore).to.exist;
        expect(filesBefore).to.have.length.greaterThan(0);
        fix.fixDirectory(workingDir, false, true, false);
        return recursiveReaddir(folderToTest);

      }, err => { throw err })
      .then(files => {

        filesAfter = files;
        expect(filesAfter).to.exist;
        expect(filesAfter).to.have.length.greaterThan(0);
        expect(filesAfter).to.have.length.lessThan(filesBefore.length);
        expect(filesAfter).to.not.deep.equal();

        done();
      }, err => { throw err });

  });

});
