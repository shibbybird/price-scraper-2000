var fs = require('fs')
var path = require('path')
var Request = require("../src/phantom-request");
var request = new Request();

var PriceScrapper = require("../src/price-scrapper");
var priceScrapper = new PriceScrapper();


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['scrapper'] = {

  setUp: function(done) {

    done();

  },
  'Test Crate and Barrel Price Scrapping': function(test) {
    test.expect(2);

    fs.readFile(path.resolve(__dirname, 'createbarrelbody.txt'), 'UTF-8', function( err, data ){

      console.log("SCRAPPER: Crate and Barrel")
      prices = priceScrapper.getPricesFromBody( data );
      test.ok( prices != null, "Prices Not Returned" )
      test.ok( priceScrapper.getPriceFromBody( prices["899.95"].selector, data ) == "899.95", "Price Doesn't Match Scrapped Pricee $899.95")

      test.done();

    });


  }
};
