Simplistic backend API structure. See `/example` for an example usage.

# Overview of example

There are two main folders, `api` and `modules`. `api` contains all of the
endpoints for the API. The structure of the API is determined by the
filesystem, along with the path defined within each individual endpoint. The
`modules` folder contains any modules that may be required, such as
authentication. Modules are run on each request (where an endpoint has
specified) and are able to pass data (such as a user object) back to the
handler.

# Endpoint Structure

 - `path`: The path of the endpoint. Can be nested multiple layers within a
    single path (eg `/nested/endpoint`).
 - `method`: The method for the endpoint of type `Method`
 - `modules`: (optional) An object containing a key-value pair, where the key
    is the name of a module (which must be within the `modules` folder) and the
    value is some data that can be passed to the module, or `true` if nothing
    needs to be passed.
 - `handler`: The handler function for the endpoint. It can return a promise or
    directly return a value. The value returned from the promise or directly
    will be sent back to the user. It can have up to two parameters passed to
    it:
     - The first object is the parameters for the endpoint which are generated
       from the body, query and URL paramters, as described below.
     - The second object is the data that has been passed from the modules. It
       may or may not exist depending on whether any modules have been added to
       the endpoint.
 - `validation`: The validations for the endpoint, which can come from the
    body, query, or the URL parameters. A validation must exist for a parameter
    in order for it to be passed to the endpoint. This is an object with 3
    optional keys, `body`, `query` and `parameter`, each of which contains
    another object of key-value pairs, where the key is the parameter name and
    the value is either another such object, or a validation function. Any
    parameters passed to the handler are guaranteed to have passed the
    validator, so don't need to be tested further.

## Endpoint Errors

By default, returning from an endpoint handler will result in a 200 status
code and the value being sent to the user. To override this, `throw` an object
with the `status` property set to the desired status code and the `message`
property with a user-readable string describing what's happened. Such an object
is a `HandledError` and will be sent to the user.

If an object is thrown that isn't a `HandledError` it will be treated as an
unhandled error, and will be logged to the console with a generic 500 error
sent to the user.

# Modules

Modules are very similar to middleware in Express, and are executed before an
endpoint. They can intercept and respond to a request, or pass the request on
to the handler with some optional data passed on.

Modules must be a function that takes two parameters, an Express `Request`
object and an Express `Response` object. The request and response objects are
free to be used in any way.

Modules can return three different types of values:
 - falsey values indicate that the request has been responded to by the module,
   and will result in the endpoint not being called. Not ending the request
   from the module when returning a falsey value will result in the request
   hanging. **Not returning anything from the module is classed as a falsey
   value, and will result in the handler not being called.**
 - truthey values indicate that the request is ok and can be passed to the
   endpoint. Headers can be sent from such modules, as long as the response
   isn't sent.
 - The only exception to truthey values is objects that are returned by the
   module. The request will still be passed onto the endpoint, however the
   returned object will be merged with the results of all other modules, and
   passed to the endpoint handler in the second parameter.

Since modules use the same types as Express middleware, it shouldn't require
too much effort to bootstrap a middleware package into a module. A wrapper for
this might be provided at some point.
