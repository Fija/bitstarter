#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var rest = require('restler');
var program = require('commander');
var cheerio = require('cheerio');
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://peaceful-bastion-8722.herokuapp.com";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1);
    }
    return instr;
};

var assertURLExists = function(infile) {
    var instr = infile.toString();
    return instr;
};


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};


var checkURL = function(url, checksfile) {
    $ = cheerio.load(url);
    var checks = loadChecks(checksfile).sort();
//    console.log(checks);
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    return fn.bind({});
};

if(require.main == module) {
    program
	.option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
	.option('-u, --url <url_address>', 'Address of url', clone(assertURLExists), URL_DEFAULT)
	.parse(process.argv);
    rest.get(program.url).on('complete', function(data) {
	if (data instanceof Error) {
	console.log("Error: %s", data.message);
	process.exit(1);
	}else {
	var checkJsonURL = checkURL(data,program.checks);
	var outJson = JSON.stringify(checkURL(data,program.checks), null,4);
	console.log(outJson);
	}
	});
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
