

const builtIn = {

	'a.href': {
		tag: 'a',
		filter: a => a.href && a.href.length,
		target: 'href',
		mime: 'text/html'
	},

	'area.href': {
		tag: 'area',
		filter: a => a.href && a.href.length,
		target: 'href',
		mime: 'text/html'
	},

	'link.canonical': {
		tag: 'link',
		filter: a => a.rel && a.rel.toLowerCase() === 'canonical' && a.href && a.href.length,
		exec: (attributes,args,resource) => {
			let absolute = resource.makeUrlAbsolute( attributes.href );
			resource.setCanonicalUrl( absolute );
			args.delete = true;
		}
	},

	'link.stylesheet': {
		tag: 'link',
		filter: a => a.rel && a.rel.toLowerCase() === 'stylesheet' && a.href && a.href.length,
		target: 'href',
		mime: 'text/css'
	},

	'img.src': {
		tag: 'img',
		filter: a => a.src && a.src.length,
		target: 'src',
		mime: 'image/jpeg'
	},

	'script.src': {
		tag: 'script',
		filter: a => a.src && a.src.length,
		target: 'src',
		mime: a => {
			return a.type ? 'application/'+a.type : 'application/javascript'
		}
	},

	'base.href': {
		tag: 'base',
		filter: a => a.href && a.href.length,
		exec: (attributes,args,resource) => {
			resource.baseUrl = attributes.href;
			args.delete = true;
		}
	},

	'form.action': {
		tag: 'form',
		filter: a => a.action && a.action.length,
		target: 'action',
		mime: 'text/html'
	},

	'button.formaction': {
		tag: 'button',
		filter: a => a.formaction && a.formaction.length,
		target: 'formaction',
		mime: 'text/html'
	},

	'meta.http': {
		tag: 'meta',
		filter: a => a['http-equiv'] && a['http-equiv'].toLowerCase() === 'refresh' && a.content,
		exec: (attributes,args,resource) => {
			attributes.content.replace( /^(\d+);url=(.+)$/i, function(all,time,url) {
				url = resource.processResourceLink( url, 'text/html' );
				return `${time};url=${url}`;
			});
		}
	},

	'option.value': {
		tag: 'option',
		filter: a => a.value && a.value.match(/https?\:/),
		target: 'value',
		mime: 'text/html'
	}
};

function build(userRules) {
	let index = {};
	for (let k in builtIn) {
		index[k] = builtIn[k];
	}
	if (userRules) {
		for (let k in userRules) {
			index[k] = userRules[k];
		}
	}
	return Object.values(index).filter(entry => {
		if (typeof entry !== 'object') return false;
		if (!(entry.tag && ((entry.target && entry.mime) || entry.exec))) {
			throw new Error("invalidly configured html-attribute-filter: "+JSON.stringify(entry));
		}
		return true;
	});
}

module.exports = { build };