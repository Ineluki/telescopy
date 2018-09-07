# TODO

List of possible future features

## High Prio

 * blacklist - making it easier to delete tags with certain html attribute criteria

## Low Prio

* find better way to compress querystring than base64 (must be deterministic)
* allow processResourceLink() call to skip url filter (allow filtering based on context, not url)
* add index link or getter for homepage file based on httpEntry
* save project state and use for resuming
 * use etags to limit bandwidth usage
* better stats
 * by mime
 * by status code
* improve run tool
 * fixed ui
 * log to file
 * verbosity toggle

## Possible problems

Edge cases, might make problems in theory, unknown if will be fixed

 * if tags are modified before the base-tag is discovered, the resulting absolute urls can be wrong
 * data is saved independent of schema. if different content exists for http and https then it will ignore one version
