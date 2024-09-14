import * as shell from 'shelljs';
shell.cp('-R', 'src/emails', 'build/src/');
// -- or --
// import fs from 'fs-extra';
// fs.copySync('src/emails', 'build/src/emails');
// -- or --
// import * as fse from 'fs-extra';
// fse.copySync('src/emails', 'build/src/emails');