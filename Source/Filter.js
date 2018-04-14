"use strict";
const debug = require("debug")("tcopy-filter");

const filterTypes = ['host','path','query','port','protocol','auth','hostname','pathname','hash'];
const compareTypes = ['=','==','===','>','<','<=','>=','!=','!=='];
const filterTrue = function(){ return true; };
const filterFalse = function(){ return false; };

/**
 * the filter container
 * @constructor
 * @param {array} filters
 **/
function Filter( filters ) {
    this.filters = filters.map( Filter.build );
}

/**
 * fn to run against a parsed url obj
 * @param {object} urlPart
 * @return {boolean} allowed
 **/
Filter.prototype.run = function(urlPart) {
    for (let i=0, ii=this.filters.length; i<ii; i++) {
        let fn = this.filters[i];
        let res = fn(urlPart);
        if (res !== null) {
            return res;
        }
    }
    debug("WARNING: no filter matched for "+JSON.stringify(urlPart));
    return false;
};


/**
 * builds a filter function from config
 * @param {object} filter
 * @return {Function}
 **/
Filter.build = function( filter ) {
    if (filter === true) return filterTrue;
    if (filter === false) return filterFalse;

    if (!filter.type || filterTypes.indexOf(filter.type) === -1) {
        throw new Error("invalid filter.type: "+JSON.stringify(filter.type));
    }
    if (filter.type === 'query' && typeof filter.key !== 'string') {
        throw new Error("filter.key must be a string, is "+(typeof filter.key));
    }
    if (typeof filter.match === 'undefined' && typeof filter.nomatch === 'undefined') {
        filter.match = true;
    }
	if (filter.test) {
		if (typeof filter.test === 'object') {
			if (!filter.test.toString) {
				throw new Error("filter.test must be a regex");
			} else {
				filter.test = filter.test.toString();
			}
		}
		if (typeof filter.test !== 'string') {
			throw new Error("filter.test must be a regex object or regex string");
		}
	}
    var numericalComparison = false;
    if (typeof filter.comparison !== 'undefined') {
        if (compareTypes.indexOf(filter.comparison) === -1) {
            throw new Error("invalid comparison operator:"+filter.comparison);
        }
        if (/<|>/.test(filter.comparison)) {
            numericalComparison = true;
        }
    }
    if (filter.comparison === '=') filter.comparison = '===';
    var fnBody = '"use strict";';
    fnBody += `\nif(typeof url['${filter.type}'] === 'undefined') return null;\n`;
    fnBody += `let value = url['${filter.type}'];\n`;
    if (filter.key) {
        fnBody += `if(typeof value['${filter.key}'] === 'undefined') return null;\n`;
        fnBody += `value = value['${filter.key}']\n`;
    }
    if (filter.test) {
        fnBody += 'let testResult = '+filter.test+".test(value);\n"
    } else {
        if (typeof filter.value !== 'undefined') {
            let comp = filter.comparison || '===';
            if (!numericalComparison) {
                fnBody += `let testResult = (value ${comp} '${filter.value}');\n`;
            } else {
                fnBody += `let testResult = (1*value ${comp} 1*${filter.value});\n`;
            }
        } else {
            fnBody += `let testResult = true;\n`;
        }
    }
    if (typeof filter.match !== 'undefined') {
		let res = typeof filter.match === 'boolean' ? filter.match : '"'+filter.match+'"';
        fnBody += `if(testResult===true) return ${res};\n`;
    } else {
		let res = typeof filter.nomatch === 'boolean' ? filter.nomatch : '"'+filter.nomatch+'"';
        fnBody += `if(testResult===false) return ${res};\n`;
    }
    fnBody += 'return null;';
    debug("BuiltFunction\n"+fnBody+"\n");
    return new Function('url',fnBody);
};

module.exports = Filter;