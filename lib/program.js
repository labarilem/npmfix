const program = require('commander');
const fix = require('./fix');
const asciify = require('asciify');
const chalk = require('chalk');

asciify('npmfix', { color: 'green', font: 'colossal' }, onReady);

function onReady(err, title) {
  console.log(title);
  console.log(chalk.green('Did someone call for a doctor?'));

  program
    .version('1.0.0')
    .description('Fixes weird issues in projects using NPM as package manager.')
    .option('-s, --serious', 'Serious fix mode: performs time consuming operations to fix more reliably your project(s).', false)
    .option('-r, --recursive', 'Recursively fix projects. Useful when there are subprojects in the current folder.', false)
    .parse(process.argv);

  try {
    fix.fixDirectory(process.cwd(), program.serious, program.recursive, false);
    console.log(chalk.green('Fixed.'));
  } catch(err) {
    console.log(chalk.red('An error occurred:\n' + err.message));
  }
}
