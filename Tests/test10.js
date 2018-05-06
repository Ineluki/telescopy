"use strict";
const Telescopy = require("../index.js");
const exec = require("child_process").execSync;
const Path = require("path");
const HTTP = require("http");

/*
 * tests incoming headers and cookies
 */

var mirror = Path.normalize(__dirname+"/../Data/Mirror1");
var temp = Path.normalize(__dirname+"/../Data/Temp1");
var server;
var prepare = function() {
	server = HTTP.createServer();
	var wait = 1000;
	var times = 2;
	var t = 0;
	server.on("request",function(req,res){
		res.writeHead(200,{
			'Content-Type': 'application/json'
		});
		let data = JSON.stringify(req.headers);
		console.log("sending back headers",data);
		res.end(data,"utf8");
	});
	server.listen(8080, runTest);
};

var finish = function() {
	server.close();
};

var runTest = function(){
	var project = new Telescopy({
		remote : 'http://localhost:8080/',
		local : mirror,
		cleanLocal : true,
		maxRetries : 3,
		fetchCookies: [
			"cook1=somevalue"
		],
		fetchHeaders: {
			"X-Custom-Stuff":"abc"
		}
	});
	project.on("end",finish);
	project.start();
};

prepare();