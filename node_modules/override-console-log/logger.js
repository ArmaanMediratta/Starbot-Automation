/**
 * This file is to test Log functionalities manually
 * 
 * Execute command 'npm run dev' OR 'node logger.js'
 * 
 */

const { log, logI, logD, logE, logConfig, resetLogger } = require('./index');

// logConfig = {
//     logDate: false,
//     logDateFormat: 'toLocaleString', // Date format is actually the format-function-name in which user wants to convert the date
//     enableAll: true,
//     enableLog: true,
//     enableLogI: true,
//     enableLogD: true,
//     enableLogE: true,
//     logCustomPrefix: '', // accepts any string of length < 1000
//     logDateThenPrefix: true,
//     debugPrefix: 'DEBUG',
//     infoPrefix: 'INFO',
//     errorPrefix: 'ERROR',
//     stopLogging: false
// };

log('simple text');
logI('info text');
logD('debug text');
logE('error text');

logConfig.logDate = false;
log('checking for logDate = false');

logConfig.logDate = true;
logI('checking for logDate = true');

logConfig.logDateFormat = 'toString';
logI('checking for logDateFormat = toString');

logConfig.logDateFormat = 'toISOString';
logI('checking for logDateFormat = toISOString');

logConfig.enableLog = false;
log('checking for enableLog = false', ' for log');

logConfig.enableLogI = false;
logI('checking for enableLogI = false', ' for logI');

logConfig.enableLogD = false;
logD('checking for enableLogD = false', ' for logD');

logConfig.enableLogE = false;
logE('checking for enableLogE = false', ' for logE');

logConfig.enableLog = true;
log('checking for enableLog = true', ' for log');

logConfig.enableLogI = true;
logI('checking for enableLogI = true', ' for logI');

logConfig.enableLogD = true;
logD('checking for enableLogD = true', ' for logD');

logConfig.enableLogE = true;
logE('checking for enableLogE = true', ' for logE');

logConfig.enableAll = false;
log('checking for enableAll = false', ' for log');
logI('checking for enableAll = false', ' for logI');
logD('checking for enableAll = false', ' for logD');
logE('checking for enableAll = false', ' for logE');

logConfig.enableAll = true;
log('checking for enableAll = true' + ' for log');
logI('checking for enableAll = true' + ' for logI');
logD('checking for enableAll = true' + ' for logD');
logE('checking for enableAll = true' + ' for logE');

logConfig.logCustomPrefix = '******CUSTOM TEXT******\n';
log('checking for logCustomPrefix');

logConfig.logDateThenPrefix = false;
log('checking for logDateThenPrefix = false');

logConfig.debugPrefix = '<<Debugging>>';
logD('checking for debugPrefix');

logConfig.infoPrefix = '<<info>>';
logI('checking for infoPrefix');

logConfig.errorPrefix = '<<error>>';
logE('checking for errorPrefix');

logConfig.stopLogging = true;
log('checking for stopLogging = true', ' for log');
logI('checking for stopLogging = true', ' for logI');
logD('checking for stopLogging = true', ' for logD');
logE('checking for stopLogging = true', ' for logE');

resetLogger();
log('resetLogger()', ' for log');
logI('resetLogger()', ' for logI');
logD('resetLogger()', ' for logD');
logE('resetLogger()', ' for logE');

