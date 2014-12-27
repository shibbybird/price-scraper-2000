

var Request = require("../src/phantom-request");

var request = new Request();


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

exports['request'] = {
  setUp: function(done) {

    done();



  },

  'Phantom Request Google Test': function( test ) {
    test.expect(2);

    var requestTimeout = setTimeout(function(){

      test.ok( false, "REQUEST TIMED OUT!" )

    }, 180000)

    request.getDomFromUrl( "https://www.google.com", {}, function( err, result ){

      clearTimeout(requestTimeout)

      if( !err ){
        //console.log(result)
        console.log("Google Finished!")
        test.equal( "Google", result.title );
        test.ok( result.body.innerHTML.length > 0, "BODY IS NULL" )

      } else {

        test.ok( false, err )

      }

      test.done();

    });

  },

  'Phantom Request Crate and Barrel Test': function(test) {
    test.expect(2);

    var requestTimeout = setTimeout(function(){

      test.ok( false, "REQUEST TIMED OUT!" )

    }, 180000)

    request.getDomFromUrl( "http://www.crateandbarrel.com/all-clad-d5-10-piece-cookware-set/f59165", {}, function( err, result ){

      clearTimeout(requestTimeout)

      if( !err ){
        //console.log(result)
        console.log("Crate and Barrel")
        test.equal( "All-Clad ® d5 10-Piece Cookware Set | Crate and Barrel", result.title );
        test.ok( result.body.innerHTML.length > 0, "BODY IS NULL" )

      } else {

        test.ok( false, err )

      }

      test.done();

    });

  }
};
