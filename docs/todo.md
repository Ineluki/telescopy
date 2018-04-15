# TODO

List of possible future features

## High Prio

 * project state must exclude protocol in its index since that mirrors the local file storage, OR file storage must include protocol
 * make html attribute filters extensible

## Low Prio

* find better way to compress querystring than base64 (must be deterministic)
* traffic stats, by mime
* allow processResourceLink() call to skip url filter (allow filtering based on context, not url)
* add index link or getter for homepage file based on httpEntry
* fix encoding bug
* include 404 and other error status codes in stats
* save project state and use for resuming
* custom handling of http status codes via config
* use etags to limit bandwidth usage
* redirect handling via meta html tag

## Possible problems

Edge cases, might make problems in theory, unknown if will be fixed

 * if tags are modified before the base-tag is discovered, the resulting absolute urls can be wrong
 * data is saved independent of schema. if different content exists for http and https then it might get ignored.
