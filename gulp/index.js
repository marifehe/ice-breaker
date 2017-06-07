'use strict';

const fs = require('fs');
const path = require('path');
const gulp = require('gulp-help')(require('gulp'));
const HELP_TABLE = {
  lint: { description: 'Lint files',
    options: { fail: 'fail process if lint errors exist' } },
  'test-unit': { description: 'Run unit tests',
    options: { f: 'Test specific module' } }
};

/**
 * Iterate through the array of tasks and create the actual
 * Gulp task for it.
 */
module.exports = () => {
  const tasks = fs.readdirSync(path.join(__dirname, './tasks'));

  for (const task of tasks) {
    const name = task.split('.js')[0];
    // eslint-disable-next-line global-require
    const taskObj = require(`./tasks/${task}`);
    if (typeof taskObj === 'function') {
      gulp.task(name, HELP_TABLE[name].description, taskObj, { options: HELP_TABLE[name].options });
    } else {
      gulp.task(name, HELP_TABLE[name].description, taskObj.dependencies, taskObj.func,
                { options: HELP_TABLE[name].options });
    }
  }
};
