/* global describe, it, expect */

var core = require('../core');

describe("A suite", function() {

	it("just jasmine describe test.", function() {
		expect(true).toBe(true);
	});

	it("set env, get env", function() {

		var key = 'hello';
		var val = 'world';
		core.setEnv( key, val );
		expect( core.getEnv( key ) === val ).toBe( true );
	});
});
