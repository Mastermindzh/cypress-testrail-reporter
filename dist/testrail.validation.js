"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRailValidation = void 0;
var glob = require("glob");
var TestRailLogger = require("./testrail.logger");
var TestRailValidation = /** @class */ (function () {
    function TestRailValidation(options) {
        this.options = options;
    }
    TestRailValidation.prototype.validateReporterOptions = function (reporterOptions) {
        if (!reporterOptions) {
            throw new Error("Missing reporterOptions in cypress.json");
        }
        this.validate(reporterOptions, "host");
        this.validate(reporterOptions, "username");
        this.validate(reporterOptions, "password");
        this.validate(reporterOptions, "projectId");
        if (this.options.suiteId) {
            this.validate(reporterOptions, "suiteId");
        }
        return reporterOptions;
    };
    TestRailValidation.prototype.validate = function (options, name) {
        if (options[name] == null) {
            throw new Error("Missing " + name + " value. Please update options in cypress.json");
        }
    };
    /**
     * This function will validate do we pass suiteId as a CLI argument as a part of command line execution
     * Example:
     * CYPRESS_ENV="testRailSuiteId=1"
     * npx cypress run --env="${CYPRESS_ENV}"
     */
    TestRailValidation.prototype.validateCLIArguments = function () {
        // Read and store cli arguments into array
        var cliArgs = process.argv.slice(2);
        // Search array for a specific string and store into variable
        var index, value, result;
        for (index = 0; index < cliArgs.length; ++index) {
            value = cliArgs[index];
            if (value.includes("testRailSuiteId") === true) {
                result = value;
                break;
            }
        }
        if (result != undefined) {
            /**
             * Search for specific variable in case that previous command contains multiple results
             * Split variables
             */
            var resultArrayArgs = result.split(/,/);
            for (index = 0; index < resultArrayArgs.length; ++index) {
                value = resultArrayArgs[index];
                if (value.includes("testRailSuiteId") === true) {
                    result = value;
                    break;
                }
            }
            // Split variable and value
            var resultArray = result.split(/=/);
            // Find value of suiteId and store it in envVariable
            var suiteId = resultArray.find(function (el) { return el.length < 15; });
            if (suiteId.length != 0) {
                TestRailLogger.log("Following suiteId has been set in runtime environment variables: " + suiteId);
            }
            return suiteId;
        }
    };
    /**
     * This function will count how many test spec files do we have during execution
     * and based on that we will wait until last one is executed to close active test run in TestRail
     */
    TestRailValidation.prototype.countTestSpecFiles = function () {
        // Read and store cli arguments into array
        var cliArgs = process.argv.slice(2);
        /**
         * Count how many test files will be included in the run
         * to be able to close test run after last one
         */
        var index, value, result, directory;
        var workingDirectory = [];
        var specFiles = [];
        var specFilesArray = [];
        for (index = 0; index < cliArgs.length; ++index) {
            value = cliArgs[index];
            if (value.includes("cypress/integration") === true ||
                value.includes("cypress/e2e") === true ||
                value.includes("cypress/tests") === true) {
                result = value;
                break;
            }
        }
        var specArg = result.split(/,/);
        for (index = 0; index < specArg.length; ++index) {
            value = specArg[index];
            result = value.replace(/(?:\.(?![^.]+$)|[^\w])+/g, "/");
            directory = result.replace(/\b(js|ts|feature)\b/, "");
            workingDirectory.push(directory);
        }
        for (index = 0; index < workingDirectory.length; ++index) {
            value = workingDirectory[index];
            var options = {
                cwd: value,
                nodir: true,
            };
            // this needs to match spec, cy, test, etc
            var cyResults = glob.sync("**/*.cy.*", options);
            var testResults = glob.sync("**/*.test.*", options);
            var specResults = glob.sync("**/*.spec.*", options);
            result = __spreadArray(__spreadArray(__spreadArray([], cyResults, true), testResults, true), specResults, true);
            specFiles.push(result);
        }
        /**
         * Since in previous steps we create 2D array,
         * we need to covert it to 1D in order to get desired length
         */
        for (index = 0; index < specFiles.length; ++index) {
            specFilesArray = specFilesArray.concat(specFiles[index]);
        }
        return specFilesArray;
    };
    return TestRailValidation;
}());
exports.TestRailValidation = TestRailValidation;
//# sourceMappingURL=testrail.validation.js.map