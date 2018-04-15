# HTML Parsing

Every HTML resource is parsed, edited in-stream and then written to disk. TelesCOPY features a system that lets you hook into this process and optionally replace the parser for html or css (but that part is not covered by the docs, you'd need to dive into the code).

## Attribute Filters

Deciding which attributes to process and how is the core part of HTML parsing. See [the built-in filters](../Source/HtmlAttributeFilters.js) for examples.

These are mainly useful to add unusual attributes to resource processing. (i.e. an img tag with the attribute data-src containing the actual image path)

Every filter has a name so you can override/disable built-in filters in the options. Alternatively add your own, using the following schema:

### Filter Options

Your own options must be an object following this schema:

 * tag - string, enable filter for this tag. must be used
 * filter - function(object:attributes): bool, optional filtering, return if you want your entry to be applied to the tag
 * target - string or function(attributes, resource): string, specifies the attribute you want to process
 * mime - string or function(attributes, resource): string, specify the fallback mime, that is used if no other mime is found based on the url
 * exec - function(attributes,context,resource), an alternative to target+mime, this lets you execute any code pieces. see the built-in examples for some uses


### Diabling

Example to disable form action parsing. Consult the [the built-in filters](../Source/HtmlAttributeFilters.js) for the right names.

```js
htmlAttributeFilters: {
	'form.action': false
}
```