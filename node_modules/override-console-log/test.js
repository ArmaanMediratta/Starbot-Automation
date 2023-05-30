var chai = require('chai');
var assert = chai.assert;
const fs = require('fs');
var { log, logI, logD, logE, logConfig } = require('./index');

const logDirectory = './log/';
const terminalLogFileName = 'terminal.log';
const errorLogFileName = 'error.log';
const terminalLogFilePath = logDirectory + terminalLogFileName;

const deleteFile = function (filePath) {
  fs.unlink(filePath, function(error) {
    if (error) throw error;
    console.log(filePath + ' deleted !!');
  });
};

const createLogFile = function(filename) {
    const fileName = filename ? filename : terminalLogFileName;
    const filePath = logDirectory + fileName;
    if (fs.existsSync(logDirectory)) {
      if (fs.existsSync(filePath)) {
        deleteFile(filePath);
      } 
    } else {
      fs.mkdirSync(logDirectory);
    }
    const access = fs.createWriteStream(logDirectory + fileName); // always create a new file on server start
    process.stdout.write = process.stderr.write = access.write.bind(access);
};
var rebindLogsToTerminal = function() {
  // re-bind logs to terminal
  var tty = fs.createWriteStream('/dev/tty');
  process.stdout.write = process.stderr.write = tty.write.bind(tty);
};

const currentDateRegex = /(\d{4}):(\d{1,2}):(\d{1,2})/;
const currentTimeRegex = /(\d{2}):(\d{2}):(\d{2})/;
const infoKeyword = 'INFO';
const debugKeyword = 'DEBUG';
const errorKeyword = 'ERROR';
const logKeyword = 'LOG';
const infoText = 'sample info text';
const welcomeText = 'Log begins';
const debugText = 'debug text';
const errorText = 'error text';

const defaultLocalDateTime = new Date().toLocaleString(); // 2018-7-27 13:47:49
const currentDate = defaultLocalDateTime.split(' ')[0];
const readFile = function(fileName, assertFn) {
  const validateFn = function(err, data) {
    if (err) throw err;
    const lines = data.split('\n');
    assertFn(lines);
  };
  fs.readFile(logDirectory + fileName, 'utf8', validateFn);
};

const getLastLine = function(lines) {
  const lastLineIndex = lines.length - 2;
  return lines[lastLineIndex];
};
const getLoggedDate = function(lines) {
  return lines[0].substr(0, currentDate.length);
};

// Creating separate files for each test-cases to read the logs written by Log functionalities
const shorthand_Fn = 'shorthand_log_fn.log';
createLogFile(shorthand_Fn);
log(welcomeText);

const logI_Fn = 'logI_fn.log';
createLogFile(logI_Fn);
logI(infoText);

const logD_Fn = 'logD_fn.log';
createLogFile(logD_Fn);
logD(debugText);

const logE_Fn = 'logE_fn.log';
createLogFile(logE_Fn);
logE(errorText);




// tests begins
describe('Testing Override Console Log', function() {
  
  rebindLogsToTerminal();

  it('console should exist as an object', function() {
    assert.equal(typeof(console), 'object');
  });

  it('console.log/logI/logD/logE should exist as a Fn', function() {
    assert.equal(typeof(console.log), 'function');
    assert.equal(typeof(console.logI), 'function');
    assert.equal(typeof(console.logD), 'function');
    assert.equal(typeof(console.logE), 'function');
  });

  it('checking for existence of the shorthand functions', function() {
    assert.equal(typeof(log), 'function');
    assert.equal(typeof(logI), 'function');
    assert.equal(typeof(logD), 'function');
    assert.equal(typeof(logE), 'function');
  });

  // log()
  it(shorthand_Fn, function() {
    const assertFn = function(lines) {
      const lastLine = getLastLine(lines);
      const loggedDate = getLoggedDate(lines);
      assert.equal(currentDate, loggedDate);
      assert.equal(lastLine.indexOf(welcomeText) > -1, true);
    };
    readFile(shorthand_Fn, assertFn);
  });

  // logI()
  it(logI_Fn, function() {
    const assertFn = function(lines) {
      const lastLine = getLastLine(lines);
      const loggedDate = getLoggedDate(lines);
      assert.equal(currentDate, loggedDate);
      assert.equal(lastLine.indexOf(infoKeyword) > -1, true);
      assert.equal(lastLine.indexOf(infoText) > -1, true);
    };
    readFile(logI_Fn, assertFn);
  });

  // logD()
  it(logD_Fn, function() { // Fn title/filename changes
    const assertFn = function(lines) {
      const lastLine = getLastLine(lines);
      const loggedDate = getLoggedDate(lines);
      assert.equal(currentDate, loggedDate);
      // actual relevant assertions
      assert.equal(lastLine.indexOf(debugKeyword) > -1, true);
      assert.equal(lastLine.indexOf(debugText) > -1, true);
    };
    readFile(logD_Fn, assertFn); // Fn title/filename changes
  });

  // logE()
  it(logE_Fn, function() {
    const assertFn = function(lines) {
      const lastLine = getLastLine(lines);
      const loggedDate = getLoggedDate(lines);
      assert.equal(currentDate, loggedDate);
      // actual relevant assertions
      assert.equal(lastLine.indexOf(errorKeyword) > -1, true);
      assert.equal(lastLine.indexOf(errorText) > -1, true);
    };
    readFile(logE_Fn, assertFn); // Fn title/filename changes
  });

  // logConfig.logCustomPrefix = `***LOG*** `; // 10 chars
});
