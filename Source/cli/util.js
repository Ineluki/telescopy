
const FS = require("fs");
const Path = require("path");

module.exports = {
	loadOptions: function(fileName) {
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
		return options;
	}
};