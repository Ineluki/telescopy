"use strict";
const Telescopy = require("../index.js");
const FS = require("fs");
const Path = require("path");

/*
 * takes a json file as last argument and runs it as project settings
 */

let fileName = process.argv[ process.argv.length - 1 ];
const ext = Path.extname(fileName);
let options;
switch (ext) {
	case '.js':
		//make relative paths absolute for require
		if (['.','/'].indexOf(fileName.substr(0,1)) === -1) {
			fileName = Path.join(process.cwd(),fileName);
		}
		options = require(fileName);
	break;

	case '.json':
		options = JSON.parse( FS.readFileSync( fileName ) );
	break;

	default:
		throw new Error("invalid options file given, must be .js or .json");
}
if (!(options instanceof Object)) {
	throw new Error("did not get options-object from "+fileName);
}

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
