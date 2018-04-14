"use strict";
const Telescopy = require("../index.js");
const util = require("../Source/cli/util.js");
const Chalk = require('chalk');
const stringify = (o) => { return JSON.stringify(o,null,' '); };
const pad = require('pad');
const byteman = require("byteman");

/*
 * takes a json file as last argument and runs it as project settings
 */

let fileName = process.argv[ process.argv.length - 1 ];
const options = util.loadOptions(fileName);

const statColors = {
	allowed: Chalk.bgGreen.black,
	denied: Chalk.bgRed.black,
	skipped: Chalk.bgYellow.black,
	downloaded: Chalk.bgBlue.green,
	queued:  Chalk.bgBlue.yellow,
	bytes: Chalk.bgCyan.black,
	speed: Chalk.bgCyan.black,
	mem: Chalk.bgWhite.black,
	default: Chalk.bgBlue.black
};
const padOpts = { colors: true };

function printUrlStats(stats) {
	stats.mem = byteman(process.memoryUsage().rss,2,true);
	stats.bytes = byteman(stats.bytes,2,true);
	stats.speed = stats.speed+"bps";
	let str = '';
	str += statColors.default('##########################');
	for (let k in stats) {
		str += "\n" + statColors.default('#') + statColors[k]( pad(""+k,12,padOpts) + pad(""+stats[k],12,padOpts) ) + statColors.default('#');
	}
	str += "\n" + statColors.default('##########################');
	console.log(str);
}

let project;
let checker;
const run = function(){
	project = new Telescopy( options );
	project.on("error",function(err){
		console.log(Chalk.bgRed.black(err), err.stack ? err.stack.split("\n") : '');
	});
	project.on("end",function(finished){
		let stats = project.getUrlStats();
		printUrlStats(stats);
		console.log( project.getUrlFilterAnalysis() );
		process.exit();
	});
	project.on("finishresource",function(err,res){
		let o = Chalk;
		if (err) o = o.bgRed.white;
		else o = o.bgGreen.black;
		console.log(o("Resource Finished"), err ? o(stringify(err)) : '', JSON.stringify(res.getUrls()), byteman(res.bytes,3,true));
	});
	project.start();
	var check = function() {
		let stats = project.getUrlStats();
		printUrlStats(stats);
		if (stats.queued === 0) {
			clearTimeout(checker);
		}
	};
	checker = setInterval(check,9000);
};

var shutdown = function(){
	console.log("\n"+Chalk.bgYellow.blue("Shutdown started\n"));
	clearTimeout(checker);
	project.stop();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

run();
