 # Override Console Log
- `Author: Shammi Hans | Smi0001` `https://github.com/orgs/IYAHU/people/Smi0001`
- `Dependency: JavaScript (ES06)`
- `Description: Overriding console.log to customize the log with current time along with passed log arguments`
- `License: GPL-3.0`
__________
 ```sh
    ___                      _     _       
   / _ \__   _____ _ __ _ __(_) __| | ___  
  | | | \ \ / / _ \ '__| '__| |/ _` |/ _ \
  | |_| |\ V /  __/ |  | |  | | (_| |  __/
   \___/  \_/ \___|_|  |_|  |_|\__,_|\___|  

   ____                      _         _                
  / ___|___  _ __  ___  ___ | | ___   | |    ___   __ _
 | |   / _ \| '_ \/ __|/ _ \| |/ _ \  | |   / _ \ / _` |
 | |__| (_) | | | \__ \ (_) | |  __/  | |__| (_) | (_| |
  \____\___/|_| |_|___/\___/|_|\___|  |_____\___/ \__, |
                                                  |___/

 ```
__________
## NEW FEATURES
- Shorthand names available, just use log / logD / logE / logI
- Stop all Fns from executing, there is no need of finding & commenting / deleting each Fn calls
``` configure 'stopLogging' ```
- Enable / disable any particular Fn or all Fns
``` configure 'enableAll' / 'enableLog' / 'enableLogI', 'enableLogD' / 'enableLogE' ```
- Enable or disable date-time logging
``` configure 'logDate' ```
- Customize log-type tag (replace INFO/DEBUG/ERROR with your own custom string as prefix)
``` configure 'logDateThenPrefix' ```
- set the order of appearance for date-time and prefix-tag
``` configure 'logDateThenPrefix' ```
- Customize Date/Time format
- New 14 configurable options

#### HOW TO IMPORT
```javascript
var { log, logI, logD, logE, logConfig } = require(<url_path_of_overide-console-log-package>);
```
OR
```javascript
import { log, logI, logD, logE, logConfig } from <url_path_of_overide-console-log-package>;
```


### HOW TO USE
```javascript
console.log('Original logging');     // [2018-4-5 16:43:23] Original logging
console.logI('info format');         // [2018-4-5 16:43:23] INFO info format
console.logD('debug fromat');        // [2018-4-5 16:43:23] DEBUG debug fromat
console.logE('Error format');        // [2018-4-5 16:43:23] ERROR Error format
```
OR
```javascript
log('Original logging');     // [2018-4-5 16:43:23] Original logging
logI('info format');         // [2018-4-5 16:43:23] INFO info format
logD('debug fromat');        // [2018-4-5 16:43:23] DEBUG debug fromat
logE('Error format');        // [2018-4-5 16:43:23] ERROR Error format
```

### Configurable options
1. ```javascript 
    logDate: true
    // set 'true' or 'false' to enable or disable logging of date-time
    ```
2.  ```javascript
    logDateFormat: 'toLocaleString'
    // set date format with the format-function-name in which user wants to convert the date
    // Use 'toLocaleString' => '12/07/2018, 22:47:23',
    // 'toDateString'  => 'Thu Jul 12 2018',
    // 'toGMTString'  => 'Thu, 12 Jul 2018 17:17:23 GMT',
    // 'toISOString'  => '2018-07-12T17:17:23.031Z',
    // 'toJSON' => '2018-07-12T17:17:23.031Z',
    // 'toLocaleDateString'  => '12/07/2018',
    // 'toLocaleTimeString'  => '22:47:23',
    // 'toString'  => 'Thu Jul 12 2018 22:47:23 GMT+0530 (India Standard Time)',
    // 'toTimeString'  => '22:47:23 GMT+0530 (India Standard Time)',
    // 'toUTCString' => 'Thu, 12 Jul 2018 17:17:23 GMT'
    ```
3.  ```javascript
    enableAll: true
    // set 'true' or 'false' to enable or disable all logging Fns, if disabled all Fns will behave like simple console.log Fn
    ```
4.  ```javascript
    enableLog: true
    // set 'true' or 'false' to enable or disable 'log' Fn, if disabled it will behave like simple console.log Fn
    ```
5.  ```javascript
    enableLogI: true
    // set 'true' or 'false' to enable or disable 'logI' Fn, if disabled it will behave like simple console.log Fn
    ```
6.  ```javascript
    enableLogD: true
    // set 'true' or 'false' to enable or disable 'logD' Fn, if disabled it will behave like simple console.log Fn
    ```
7.  ```javascript
    enableLogE: true
    // set 'true' or 'false' to enable or disable 'logE' Fn, if disabled it will behave like simple console.log Fn
    ```
8.  ```javascript
    logCustomPrefix: ''
    // accepts any string of length < 1000, to log with custom prefix
    //configuration:
    //     logConfig.logCustomPrefix =
    //    `
    //      ********* LOG ***********
    //    `;
    //
    // use:
    //      log('Hello world');
    //
    //output:
    //      <date_prefix>
    //      ********* LOG ***********
    //      Hello world
    ```
 9. ```javascript
    logDateThenPrefix: true,
    // use 'true' to set order of date first then prefix, or false to set order of prefix first then date
    ```
10. ```javascript
    debugPrefix: 'DEBUG'
    // set any string for all debug logging
    //configuration:
    //      logConfig.debugPrefix = 'debugger-mode';
    //
    // use:
    //      logD('value:', val);
    //
    //output:
    //      <date_prefix> debugger-mode value: <value_of_val_variable>
    ```
11. ```javascript
    infoPrefix: 'INFO'
    // set any string for all debug logging
    //configuration:
    //      logConfig.infoPrefix = 'information-mode';
    //
    // use:
    //      logI('Value:', val);
    //
    //output:
    //      <date_prefix> information-mode Value: <value_of_val_variable>
    ```
12. ```javascript
    errorPrefix: 'ERROR'
    // set any string for all debug logging
    //configuration:
    //      logConfig.errorPrefix = 'FOUND ERROR-->';
    //
    // use:
    //      logE(error.message);
    //
    //output:
    //      <date_prefix> FOUND ERROR--> <value_of_error.message_variable>
    ```
13. ```javascript
    stopLogging: false
    // set 'true' to stop all logging Fns to execute, set 'false' to let all logging Fns to execute
    //configuration:
    //      logConfig.stopLogging = true;
    //
    //output:
    //      <no_output>
    ```
14. ```javascript
    resetLogger(); // reset logger to default options
    ```
    OR
    ```javascript
    console.resetLogger(); // reset logger to default options
    ```

### Live Sample
> See **logger.js** for functionalities examples.
> Execute ```npm run dev``` or ```node logger.js```

__________
## Test Cases
> Unit test-cases are written using _Mocha_. Few test-cases are pending.

### Test Command
```
npm test
```

### Test Logic Story
> It took me 4 months to figure out the logic to carry out executing test-cases properly.
>
> _First attempt_: Initially the logic was to create log file, then redirect stdout logging to that file, then execute log funcationality, then read the output, and then check for correct assertions. But practically it was not possible because once the stdout was bound to the file it writes all the test-cases & execution details of mocha, hence it was complex to read the output texts of file for relevant assertions.
> 
> _Second attempt_: Totally wrong attempt. I tried creating file, executing functions & reading file in setTimeOut function. I thought that may be the creating file function is under progress & the execution of log functionalities executes before hand. I tried variations in setTimeOut & the steps combinations, like sometimes creating file in timeout, sometimes execution in timeout to delay it, sometimes reading file in timeout to delay even more to assure file is created & log functionality is executed. But then the mocha test cases finishes execution before all those executions.
> 
> _Final attempt_: I figured out that there should be one test-case for each of the log functionalities, and each should have separate file created. So in this way, when test-cases are executed for assertions then the files with logs to be read would be available before hand, and no setTimeout would be needed to delay any execution.

__________
## FEATURES COMING SOON 
- Possible edge case error check
- Update mocha test

### Give feedback and feel free to contribute on https://github.com/IYAHU/override-console-log

__________
## References
[Refering docs to publish / update the NPM package](https://docs.npmjs.com/getting-started/publishing-npm-packages)

[Took help from MDN Docs](https://developer.mozilla.org/en-US/)

[Took help from Stackoverflow Forum](https://stackoverflow.com/)

[Test-cases written using Mocha Docs](https://mochajs.org/)
__________
