# Integration


### Events

#### end (`boolean: finished`)

Called when the queue is empty or when paused has been called and the procedure stopped.

#### startresource (`Resource: res`)

Called before a resource is started. Useful for logging.

#### finishresource (`Error: err, Resource: res`)

When a resource has completed processing or proessing was aborted.
If an error exists, resource may be requeued or marked as skipped.

#### error (`Error: err`)

At an unexpected error condition, usually at the end of a promise chain.

### API

The public API methods. Use other methods with care.

#### new Telescopy(options)
Creates a new project.

#### project.start()
Starts the procedure if the option *remote* was set. Otherwise it just prepares the project and you need to call addUrl()

#### project.stop()
Stops the procedure. After finishing the current resource the *end*-event will be called.

#### project.addUrl(url)
Adds a single URL to the queue. Will start the procedure, if it is not already running.
Returns true, if the URL was added. Will not add the URL if it is already queued or has already been processed.

#### project.getUrlStats()
Compiles a quick update on the progress of the project.
Returns an object with:
 * allowed - number of urls allowed by the filter
 * denied - number of urls denies by the filter
 * skipped - number of resources skipped because of errors
 * downloaded - number of urls downloaded (is bigger than allowed because it contains redirected urls and canonical urls)
 * queued - number of urls queued to download

#### project.getUrlFilterAnalysis()
Compile a complete analysis of the url filter.
Returns an object with allowedUrls[] and deniedUrls[].
Each entry containing the URL itself and the number of times it was referenced, sorted decending.
This helps in improving the filter settings.
