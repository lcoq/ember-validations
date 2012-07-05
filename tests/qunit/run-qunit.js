var system = require('system');

// Developed by louis.coquio
// forked from http://joseoncode.com/2011/08/08/javascript-continuous-testing-with-qunit-phantomjs-and-powershell/

/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
      } else {
        if(!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          console.log("'waitFor()' timeout");
          phantom.exit(1);
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          //console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
          typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 1000); //< repeat check every 250ms
};


if (phantom.args.length === 0 || phantom.args.length > 2) {
  console.log('Usage: run-qunit.js URL');
  phantom.exit(1);
}

var page = new WebPage();

// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.open(phantom.args[0], function(status){
  if (status !== "success") {
    console.log("Unable to access network");
    phantom.exit(1);
  } else {
    waitFor(function(){
      return page.evaluate(function(){
        var el = document.getElementById('qunit-testresult');
        if (el && el.innerText.match('completed')) {
          return true;
        }
        return false;
      });
    }, function(){
      var failedNum = page.evaluate(function(){

        var tests = document.getElementById("qunit-tests").childNodes;
        console.log('');

          var moduleName = null;
          for (var i in tests) {
              var text = tests[i].innerText, failed, status, testName, assertCounts;
              if (text != undefined) {
                  var newModuleName = tests[i].getElementsByClassName('module-name')[0].innerText;
                  if (moduleName !== newModuleName) {
                      moduleName = newModuleName;
                      console.log("\n" + moduleName);
                  }
                  testName = tests[i].getElementsByClassName('test-name')[0].innerText;

                  assertCounts = tests[i].getElementsByClassName('counts')[0].innerText;
                  assertCounts = assertCounts.split(',');
                  assertCounts[0] = "(\033[31m" + assertCounts[0].substr(1, assertCounts[0].length) + "\033[0m";
                  assertCounts[1] = "\033[32m" + assertCounts[1] + "\033[0m";
                  assertCounts = assertCounts.join(',');

                  failed = tests[i].getElementsByClassName('fail').length;
                  status = failed ? "\033[31mFAIL" : "\033[32mPASS";
                  status += "\033[0m";

                  console.log("     " + status + " test: " + testName + " " + assertCounts);

                  if (failed) {
                      var failedList = tests[i].getElementsByTagName('li');
                      if (failedList) {
                          for (var r = 0, k = failedList.length; r < k; r++) {
                              var assertStatus = (failedList[r].className == 'fail') ? "\033[31mKO" : "\33[32mOK";
                              assertStatus += "\033[0m";
                              console.log("\t\t" + assertStatus + "  " + failedList[r].innerText);
                          }
                      }
                  }
              }
          }
          console.log("\n");

        var el = document.getElementById('qunit-testresult');
        var counts = el.innerText;
        var failedContent = counts.match(new RegExp("([0-9]+) failed.$"));
        var failedCount = 1; // set to 1 for return error
          if (failedContent && failedContent.length) {
              failedContent = failedContent[0];
              failedCount = failedContent[1];
              counts = counts.replace(failedContent, "");
              failedContent = failedContent.substring(0, failedContent.length-1);
              counts += "\033[31m" + failedContent + "\033[0m.";
          }
          console.log(counts);

        try {
          return el.getElementsByClassName('fail')[0].innerHTML;
        } catch (e) { }

          return parseInt(failedCount);
      });
      phantom.exit((parseInt(failedNum, 1) > 0) ? 1 : 0);
    });
  }
});