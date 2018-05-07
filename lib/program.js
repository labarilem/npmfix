const program = require('commander');
const fix = require('./fix');
const asciify = require('asciify');
const chalk = require('chalk');

asciify('npmfix', { color: 'green', font: 'colossal' }, onReady);

function onReady(err, title) {
  console.log(title);
  console.log(chalk.green('Did someone call for a doctor?'));

  program
    .version('1.1.2')
    .description('Fixes weird issues in projects using NPM as package manager.')
    .option('-s, --serious', 'Serious fix mode: performs time-consuming operations to fix more reliably your projects.', false)
    .option('-i, --install', 'Runs \'npm install\' (or the \'setup\' script, if available) after fixing a project.', false)
    .option('-r, --recursive', 'Recursively fix projects. Useful when there are sub-projects in the current folder.', false)
    .parse(process.argv);

  fix.fixDirectory(process.cwd(), program.serious, program.install, program.recursive, false)
    .then(() => {
      console.log(chalk.green('Fixed.'));
    })
    .catch((err) => {
      console.error('An error occurred:\n' + err.message);
    });

}
