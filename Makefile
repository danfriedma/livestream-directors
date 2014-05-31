TESTS =	lib/tests.js
REPORTER = spec

test: 
	mocha --reporter $(REPORTER) $(TESTS)
   
   .PHONY: test
