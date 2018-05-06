#!/usr/bin/env node

"use strict";
const Telescopy = require("../index.js");
const util = require("../Source/cli/util.js");
const Chalk = require('chalk');
const pad = require('pad');

/*
 * takes settings file
 */

if (process.argv.length < 3) {
	console.log("usage: telescopy-test-rules <optionsFile> <url>");
	process.exit(3);
}
const fileName = process.argv[ 2 ];
const options = util.loadOptions(fileName);
const url = process.argv.length === 4 ? process.argv[ 3 ] : options.remote;

function printResult(res) {
	let tl1 = 0;
	let tl3 = 0;
	res = res.sort((a,b) => {
		return a.url > b.url ? 1 : -1;
	});
	res.forEach(a => {
		tl1 = Math.max(tl1,a.url.length);
		tl3 = Math.max(tl3,a.mime ? a.mime.length : 0);
	});
	tl1 += 2;
	tl3 += 2;
	res.forEach(r => {
		let o = Chalk;
		let str = '';
		if (r.allowed) o = o.bgGreen.black;
		else o = o.bgYellow.black;
		str += pad( (r.url), tl1, { colors: true} );
		str += pad( 5, (r.found), { colors: true} );
		str += pad( tl3, (r.mime ? r.mime : ""), { colors: true} );
		console.log(o(str));
	});
}

options.cleanLocal = true;
options.localPath = '/tmp/telescopy';

const project = new Telescopy( options );

project.addResourceUrls = function(set) {
	let analysis = project.state.getUrlFilterAnalysis();
	let result = {};
	for (let row of set) {
		result[row[0]] = {
			url: row[0],
			allowed: true,
			mime: row[2],
			found: 0
		};
	}
	analysis.allowed.forEach(r => {
		if (!(r[0] in result)) {
			result[r[0]] = {
				url: r[0],
				allowed: true
			};
		}
		result[r[0]].found = r[1];
	});
	analysis.denied.forEach(r => {
		result[r[0]] = {
			url: r[0],
			allowed: false,
			found: r[1]
		};
	});
	printResult(Object.values(result));
	process.exit(0);
};
project.httpEntry = url;
project.start();