var arc = require('../arc');
var log = arc.log;
log.error = arc.error;

log("foo", "error");
log("bar", "FATAL");
log("baz", "WARN");

function foo() {
	console.log("I ran!");
}
arc.setErrorHandler(foo);

log({'anObject':'can you see me?'}, "warn");

log.error("oh noes it errored!", new Error("Im ded"));

arc.set("log_to_file", true);
arc.set("path", "./test.log");

log("This should be logged", "warn");
