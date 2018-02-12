#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sh = require("shelljs");
var scripts = require("@snapperfish/build-scripts");
sh.echo('starting...');
var failed = false;
var libraryResults = scripts.test('@snapperfish/library-*');
var serviceResults = scripts.test('@snapperfish/service-*');
var processResults = function (result) {
    if (!result) {
        sh.echo('');
        sh.echo("No Results for");
        sh.echo('');
        return;
    }
    printResults(result);
    if (!result.success) {
        failed = true;
    }
};
var printResults = function (result) {
    sh.echo('');
    sh.echo("* ====== Test Results ====== *");
    sh.echo('');
    result.forEach(printResult);
    sh.echo('');
    sh.echo("* ====== /Test Results ====== *");
    sh.echo('');
};
var printResult = function (_a) {
    var name = _a.name, success = _a.success, totalTests = _a.totalTests, passedTests = _a.passedTests;
    if (success) {
        sh.echo(name + ": Tests ran successfully");
    }
    else if (passedTests === totalTests) {
        sh.echo(name + ": Coverage failed to meet minimum threshold");
    }
    else {
        sh.echo(name + ": Tests Failed");
    }
};
Promise.all([libraryResults, serviceResults]).then(function (results) {
    results.forEach(processResults);
    if (failed) {
        sh.echo('Some or all tests failed, please check report');
        return sh.exit(1);
    }
}).catch(function (err) {
    console.log(err);
});
//# sourceMappingURL=test.js.map