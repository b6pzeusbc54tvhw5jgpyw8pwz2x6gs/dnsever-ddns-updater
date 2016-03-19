var Jasmine = require('jasmine');
var SpecReporter = require('jasmine-spec-reporter');

var jasmine = new Jasmine();

var noop = function() {};

jasmine.loadConfig({
	spec_dir: 'spec',
	spec_files: [
		'**/*.js'
	],
	helpers: [
		'helpers/**/*.js'
	]
});

jasmine.onComplete(function(passed) {
	if(passed) {
		console.log('All specs have passed');
	}
	else {
		console.log('At least one spec has failed');
	}
});

jasmine.configureDefaultReporter({print: noop});    // remove default reporter logs
jasmine.addReporter(new SpecReporter());   // add jasmine-spec-reporter

jasmine.execute();
