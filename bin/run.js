"use strict";
const Telescopy = require("../index.js");
const util = require("../Source/cli/util.js");

/*
 * takes a json file as last argument and runs it as project settings
 */

let fileName = process.argv[ process.argv.length - 1 ];
const options = util.loadOptions(fileName);

var project;
var checker;
var run = function(){
	project = new Telescopy( options );
	project.on("error",function(err){
		console.log(err, err.stack ? err.stack.split("\n") : '');
	});
	project.on("end",function(finished){
		console.log( project.getUrlStats() );
		console.log( project.getUrlFilterAnalysis() );
		process.exit();
	});
	project.on("finishresource",function(err,res){
		console.log("Resource Finished", err ? err : '', res.getUrls(), res.bytes, ~~(res.bps));
	});
	project.start();
	var check = function() {
		let stats = project.getUrlStats();
		console.log( "~~~ STATS ~~~\n", stats );
		if (stats.queued === 0) {
			clearTimeout(checker);
		}
	};
	checker = setInterval(check,4000);
};

var shutdown = function(){
	console.log("Shutdown started");
	clearTimeout(checker);
	project.stop();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

run();
