"use strict";
const MIME = require("mime");
const methods = {};
const TransformCss = require("./TransformCss");



methods.updateAttributes = function (args) {
	let attributes = args.attributes;
	let styleProm;

	if ("style" in attributes) {
		styleProm = methods.updateStyles.call(this, attributes.style)
		.then(function(style){
			args.attributes.style = style;
		});
	}

	for (let entry of this.project.tagCallbacks) {
		if (args.tag !== entry.tag) continue;
		if (entry.filter && !entry.filter(attributes)) continue;
		if (entry.exec) {
			entry.exec(attributes,args,this);
			continue;
		}
		if (entry.target) {
			let key, value, fbmime;
			if (entry.target.call) key = entry.target(attributes,this);
			else key = entry.target;
			value = attributes[key];
			if (entry.mime.call) {
				fbmime = entry.mime(attributes,this);
			} else {
				fbmime = ""+entry.mime;
			}
			let mime = this.project.lookupMime(value, fbmime);
			attributes[key] = this.processResourceLink( value, mime );
			continue;
		}
	};

	if (styleProm) {
		return styleProm.then(function(){
			return args;
		});
	} else {
		return args;
	}
};

methods.updateStyles = function(text) {
	var ths = this;
	return TransformCss.replaceUrls( text, function( hook, url ){
		let defMime = hook === 'url' ? 'image/png' : 'text/css';
		let mime = MIME.getType( url, defMime );
		return Promise.resolve( ths.processResourceLink( url, mime ) );
	});
};

var getOptions = function(resource) {
	return {
		attributeHooks : [ methods.updateAttributes.bind(resource) ],
		styleHooks : [ methods.updateStyles.bind(resource) ]
	};
};

module.exports = getOptions;