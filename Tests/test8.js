"use strict";
const Telescopy = require("../index.js");
const exec = require("child_process").execSync;
const StaticServer = require("static-server");
const Path = require("path");

/*
 * Tests linking to non-html resources such as image
 */

var remote = Path.normalize(__dirname+"/Fixtures/Remote8");
var mirror = Path.normalize(__dirname+"/../Data/Mirror8");
var server;
var prepare = function() {
	server = new StaticServer({
		rootPath : remote,
		port : 8080,
		followSymlink : true,
		templates: {
			index : 'index.html'
		}
	});
	server.start(runTest);
};

var finish = function() {
	var remoteFiles = exec("du -a "+remote).toString();
	var mirrorFiles = exec("du -a "+mirror).toString();
	console.log("\nREMOTE\n",remoteFiles);
	console.log("\nMIRROR\n",mirrorFiles);
	server.stop();
	process.exit(0);
};

var runTest = function(){
	var project = new Telescopy({
		remote : 'http://localhost:8080/',
		local : mirror,
		cleanLocal : true,
		mimeRules : [{
			type : 'path',
			test : '/bg/',
			match : 'image/jpeg'
		}]
	});
	project.on("finishresource",function(err,res){
		console.log("Resource Finished", err ? err : '', res.getUrls(), res.bytes, res.bps);
	});
	project.on("error",function(err){
		console.log(err, err.stack ? err.stack.split("\n") : '');
	});
	project.on("end",function(){
		console.log( project.getUrlStats() );
		console.log( project.getUrlFilterAnalysis() );
		finish();
	});
	project.start();
};

prepare();