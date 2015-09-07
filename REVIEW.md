# Review of Kevin Liu by Jason Xiong

## Overview

Example: This code uses the reactor-pattern to dispatch service events to a series of service handlers. The service handler interface is specified as a Java interface allowing users of the application to extend the available services by creating a Java object that implements this interface. An event pre-processor is used to extract the “service type” header from events and then lookup the appropriate service handler using the type name. Service handlers are stored in a central HandlerRegistry and bound to service types, which are strings. 

The code’s unit testing methodology is to create one unit test per concrete class. No unit tests are provided for classes that are primarily simple data structures with getters/setters. The unit tests are designed to call each of the methods on the test subject. No apparent boundary value analysis or other approach was used to devise the unit tests.

## Suggested Improvements

1. Should probably add .idea to .gitignore in order to keep commit history free from dev configs.
2. fs.readFileSync() only needs the 'utf8' flag to specify reading as a string, no need for toString()
3. makeX(numCopies) isn't implemented or used anywhere, so it can be removed
