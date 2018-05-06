# Configuration Guide



## Options

### local

**string, mandatory**

The local path to save to. Directory will be created if neccessary.

### skipExistingFiles

*boolean, optional, default: false*

If true, existing files will not be checked again. If false, they will be downloaded and parsed, and overridden if the content differs. There is an exclusion filter to exclude specific files, see below.

### skipExistingFilesExclusion

*object, optional*

If set, it will be checked for mime-keys. If true, this file will not be skipped. Useful to update a mirror without re-downloading media. Example to re-download html files even if they exist locally:

```js
{ "text/html" : true }
```

### maxRetries

*int, default: 3*

The maximum number a resource is re-queued if there is a timeout during download.

### timeoutToHeaders

*int, default: 6000*

millisec until headers must be received before resource is timed out

### timeoutToDownload

*int, default: 12000*

millisec until the full download must be complete before resource counts as a timeout

### linkRedirects

*bool, default: true*

How to handle redirects and canonical urls. If true, symlinks are created from redirect-urls and canonical urls to the path where the resource was first encountered. If false, other urls are ignored, and the resource may be downloaded multiple times in different locations.

### defaultIndex

*string, default: index*

The expected index-path. Added when paths end in '/'.

### userAgent

*string, optional, default: Telescopy website mirror*

http user agent set for all requests

### urlFilter

*array, optional*

Rules must return a boolean value to determine if url is allowed to be downloaded or not.

For detailed usage on filter chains, see [Filters](filters.md).

### filterByUrl

*function, optional, interface: function(object: parsedUrl): boolean*

Hook for filtering URLs. Must return true if the URL should be downloaded or false if not. This is the most low-level option for filtering urls. Most cases can be covered by using urlFilter, but if you need to use substr or other string functions, filterByUrl is the solution.

If no filter is given (neither filterByUrl nor urlFilter), this defaults to download everything with the same host as the entry-url.

### mimeDefinitions

*object, optional, scheme: {mime : [endings]}*

List of mime values that can override default mime lookup. Lookup determins the local file name and servers might reply with non-standard mime-types. If static lookup is not enough or resources without ending exist, use mimeRules (see below)

The default rules are set in the [mime package](https://www.npmjs.com/package/mime).

### mimeRules

*array, optional*

Rules must return a string that defines the mime type, e.g. 'image/jpeg';

For detailed usage on filter chains, see [Filters](filters.md).

### defaultMimeType

*string, optional, default: bin*

Fallback mime type, if no other could be determined via mimeRules or mime definitions

### proxy

*string, optional*

Set a proxy-URL. Currently only socks5 is supported. Can be a local tor node, e.g. "socks5://localhost:9050" to access onion urls

### baseWaitTime

*int, default: 0*

Sets a base wait time in ms between requests. Can be randomized by adding randWaitTime (see below)

### randWaitTime

*int, default: 0*

Sets a random wait time in ms, which is added to the base wait time.
Example: that sets 1-3sec wait time:

```js
{ baseWaitTime: 1000, randWaitTime: 2000 }
```

### normalizeUrl

*function, optional, interface: (string: url): string url*

Can override url sanitation/normalization. The default function removes the #hash part of the url.


### decideOnHeaders

*function, optional, interface: (int: httpStatus, object: headers, string: url): bool continue*

Can override the decision if a download continues after the headers have been received. The default behavior is to return false if statusCode >= 400.
Using this option enables making fine-grained decisions based on url and all headers.

### htmlAttributeFilters

*object, optional*

Can enhance or override behavior on how html tags/attributes are handled. See [HTML Parsing](html.md) for full details.

### fetchHeaders

*object, optional*

Can define additional headers sent with each request. These will be passed directly to [fetch](https://www.npmjs.com/package/fetch#headers). Format should be: { "key": "value" }. Telescopy only sets the referer header automatically. To set cookies, see below.

### fetchCookies

*array, optional*

Can define cookies to be sent with every request, useful for simulating logins. These will be passed directly to [fetch](https://www.npmjs.com/package/fetch#cookies). Format should be: ["name=value", "key=value; path=/; secure"]
