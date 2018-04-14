# Debugging

When mirroring does not work as expected, first check the rules. There is a cli-tool integrated that calls a url and shows what URLs are allowed and what mime types they got assigned. Usage:

```sh
node bin/test-rules.js Data/my-config.js <url>
```

If nothing is returned at all, it is likely that the webserver blocks all requests not containing a browser user-agent. In this case look up a current UA and set it in the config option 'userAgent'.

Otherwise check your network connection and DNS resolution.

## debug tcopy-*

When you need to dig deeper into debugging, you can use the debug console output. Use the ENV-var DEBUG to enable these. Example:

```sh
DEBUG=tcopy-project node bin/run.sh config.json
```

### Available Keys:

- tcopy-project - for project level, including errors. if your app does not listen to errors it may be displayed here
- tcopy-state - for new URLs
- tcopy-resource - for download and processing info
- tcopy-filter - building and executing filter chains
- tcopy-util - symlinking and other util info
- tcopy-transform-css - transform happening during css parsing
- tcopy-transform-html - html parsing

It is NOT recommended to listen to tcopy-* or tcopy-transform-* since these generate a huge amount of data.