var fs = require('fs');
var path = require('path');
var Request = require("../src/phantom-request");
var request = new Request();

var PriceScrapper = require("../src/price-scrapper");
var priceScrapper = new PriceScrapper();
var testCount = 0;


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

exports.scrapper = {

  setUp: function(done) {

    done();

  },

  'Test Crate and Barrel Price Scrapping': function( test ) {
    test.expect( 56 );

    fs.readFile( path.resolve(__dirname, 'createbarrelbody.txt' ), 'UTF-8', function( err, data ){
      var p, price, prices;

      console.log( "Scrapping Crate and Barrel" );
      prices = priceScrapper.getPricesFromBodyInnerHTML( data );

      test.ok( prices !== null, "Prices Not Returned" );

      for( var i = 0; i < prices.length; i++ ){

        p = prices[i];
        price = priceScrapper.getPriceFromBodyInnerHTML( p.selector, data, p.index );
        console.log("Validate - Actual:" + price + " Expected: " + p.price );
        test.ok( price == p.price,
          "Price Doesn't Match: Actual" + price + " Expected: " + p.price );

      }

      test.done();

    });


  },

  'Test Dicks Sporting Goods Price Scrapping': function( test ) {
    var  p, price, url;
    url = "http://www.dickssportinggoods.com/product/index.jsp?productId=46722916&ab=TopNav_Footwear_MensFootwear_Basketball&cp=4413987.4417989";
    console.log( "Scrapping Dick's Sporting Goods" );
    priceScrapper.getPricesFromURL( url, function( err, prices ) {

      if( !err ){

        test.expect(prices.length);
        testCount = 0;


        for( var i = 0; i < prices.length; i++ ){

          p = prices[i];
          confirmPrices( p.selector, p.index, url, p.price, test, prices.length );

        }

      } else {

        test.expect(1);

        test.ok( false, "Error Retrieving Price from Page: " + err);

      }

    });

  }

};

function confirmPrices( selector, index, url, pricey, test, length ){

  priceScrapper.getPriceFromURL( selector, index, url, function( err, price ){
    console.log("Validate - Actual:" + price + " Expected: " + pricey );
    test.ok( price == pricey,
      "Price Doesn't Match - Actual:" + price + " Expected: " + pricey );

    testCount++;
    if(testCount === length){
      test.done();
    }

  });

}
