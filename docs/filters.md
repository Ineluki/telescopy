# Filters

Filter-chains are used in the following places:

- filterByUrl - deciding if to download a resource or not, must return true or false
- mimeRules - deciding which mime a resource is, must return a mime identifying string (e.g. image/gif)

Filter chains always take a parsed URL as argument.

Tests can access the following URL keys, as defined by node: 'host','path','query','port','protocol','auth','hostname','pathname','hash' (see https://nodejs.org/dist/latest/docs/api/url.html) Be careful when using protocol, as the local storage path (and project known url index) does not take protocol into account.

## Options

The definition must be an array of objects.
Each object represents a stage the process must go through.
If the result of a stage is a return value, the other stages are ignored and the return value is the final result of the url.

The possible options are:

### type

The basic options that always has to exist. The given value is then tested.

Example:

```js
//url input: https://example.com/test
{
	//part of the url to compare against
	"type":"host",
	//value of comparison
	"value":"example.com",
	//action to take, will succeed and return true, ending the filter chain
	"match":true
}
```

### match

Match returns the value if the test is a success. If the test fails, no value is returned and the next test in the chain is run.

### nomatch

Nomatch returns the value if the test is a failure. If the test succeeds, no value is returnd and the next test in the stage runs.

```js
//url input: ftp://example.com/test
{
	//will compare against ftp
	"type":"protocol",
	//value of comparison
	"value":"http",
	//since http does NOT match ftp, false will be returned, ending the filter chain
	"nomatch":false
}
```

### value

A simple value to test against. Is superseeded by 'test' if it exists.

### test

A regular expression to test against. Can be given as a string or a RegExp object.
Cannot be used together with 'value'.

```js
//url input: https://www.example.com/media/app.js
{
	//will compare against /media/app.js
	"type":"pathname",
	//value of comparison
	"test":/^\/media\//i,
	//will match and return false
	"match":false
}
```

### comparison

Optional comparison operator, defaults to '==='
All options: '=','==','===','>','<','<=','>=','!=','!=='
= is shorthand for ===
If the comparison contains < or >, both sides are turned into a number first by multiplying them by 1.

```js
//url input: http://localhost:8080/
{
	//will compare against 8080
	"type":"port",
	//value of comparison
	"value":8000,
	//numerical greater-than comparison
	"comparison":">",
	//will match because 8080 > 8000
	"match":true
}
```

### key

In a query you can use 'key' to specify which part of the query to compare against. If the specified key does not exist in the target object, the test is skipped.
The value is optional in this case. If the value is omitted, the existance of the key is tested against.

```js
//url input: https://www.example.com/?v=12
{
	//will compare against {v:12}
	"type":"query",
	//compare against 12
	"key":"v",
	//value of comparison
	"value":11,
	//will not match
	"match":true
}
```

## Complete Examples

### Download site by domain

```js
{ "urlFilter" : [
  {
	"type": "host",
	"nomatch": false,
	"value": "www.domain.com"
  },
  true
] }
```

### Complex site rules 1

```js
{ "urlFilter" : [
{	//allow js and css from any domain
	"type" : "path",
	"test" : "/\\.(css)|(js)/i",
	"match" : true
},{	//then disallow anything else not on this host
	"type" : "host",
	"value" : "example.com",
	"nomatch" : false
},{	//filter out queries containing ?replytocom=*
	"type" : "query",
	"match" : false,
	"key" : "replytocom"
},{	//also filter out queries containing chapters=*
	"type" : "query",
	"match" : false,
	"key" : "chapters"
},{	//filter out several paths
	"type" : "path",
	"match" : false,
	"test" : "/(forum)|(wp\\-(register)|(login))/"
},	//allow the rest
true] }
```

### MimeRules 1

Forces the path 'bg' to be treated as image/jpeg.
Anything not covered here will be treated by normal mime-rules (by path ending).

```js
{ mimeRules : [{
	type : 'path',
	test : '/bg/',
	match : 'image/jpeg'
}] }
```