var _ = require('underscore'),
  phantom = require('phantom'),
  Promise = Promise || require('promise');

if( !global.currentPort ){
  global.currentPort = 49152;
}


var Request = (function(){

  var request = function(){};

  var proto = {

    constructor: function(){


    },

    /**
    *
    * getDomFromUrl
    *
    * Parameters:
    *  url: URL of site you want to get dom of
    *  options:
    *   ( See this.defaultRequestOptions )
    *  callback:
    *     returns:
    *        err: Any err string that occured while pulling dom
    *        result = {
    *
    *          title: document.title,
    *
    *          body: document.body,
    *
    *          images: document.images,
    *
    *          scripts: document.scripts
    *
    *        }
    *
    **/

    getDomFromUrl: function( url, options, callback ){

      var _this = this, phant = null, page = null, port, opt;

      options = _.extend( this.defaultRequestOptions, options );

      port = this.getPort();

      opt = {

        port: port

      };

      _this._phantomCreate(opt).then(function( ph ){

        phant = ph;
        return _this._createPage( ph );

      }).then( function( pages ){

        page = pages;
        page.set( 'userAgent', options.userAgent );
        page.set( 'viewportSize', {

          width: options.viewport.width,

          height: options.viewport.height

        });
        page.set( 'settings.resourceTimeout', options.timeout );

        return _this._open( url, page );

      }).then( function( status ){

        return _this._evaluate( status );

      }).then( function( dom ){

        page.close();
        phant.exit();

        if ( !dom.indexOf || dom.indexOf("ERROR") !== 0 ){
          try {
            callback( null, dom );
          } catch(e){
            console.error("ERROR: " + err.stack);
          }
        }


        return null;

      }).catch( function(err){
        console.error(err.stack);
        page.close();
        phant.exit();
        callback( err, null );

      });

    },

    /**
    *
    * _phantomCreate
    * ( Promise )
    *
    * Resolves:
    *  phantom object
    *
    * Rejects:
    *  Err Message
    *
    **/

    _phantomCreate: function(){

      return new Promise( function( resolve, reject ){

        phantom.create("--web-security=no",
        "--ignore-ssl-errors=yes",
        "--load-images=false",
        function( ph ){

          if( ph ){

            resolve( ph );

          } else {

            reject( "ERROR: Could not build Phantom Object" );

          }

        });

      });

    },

    /**
    *
    * _createPage
    * ( Promise )
    *
    * Resolves:
    *  phantom page
    *
    * Rejects:
    *  Err Message
    *
    **/

    _createPage: function( ph ){

      return (new Promise( function( resolve, reject ){

        ph.createPage( function( page ){

          if( page ){

            resolve( page );

          } else {

            reject( "ERROR: Page was not created!" );

          }

        });

      })).then(function( page ){

        return page;

      });

    },

    /**
    *
    * _open
    * ( Promise )
    *
    * Resolves:
    *  phantom page status
    *
    * Rejects:
    *  Err Message
    *
    **/

    _open: function( url, page ){

      return (new Promise( function( resolve, reject ){

        page.open( url , function ( status ) {


          if( status ){

            resolve( page );

          } else {

            reject( "ERROR: Status failed with: " + status );

          }

        });

      })).then(function( status ){

        return status;

      });

    },

    /**
    *
    * _evaluate
    * ( Promise )
    *
    * Resolves:
    *  DOM Document
    *
    * Rejects:
    *  Err Message
    *
    **/

    _evaluate: function( page ){

      return (new Promise(function( resolve, reject ){

          page.evaluate( function () {

            var result = {

              title: document.title,

              body: document.body,

              images: document.images,

              scripts: document.scripts

            };

            return result;

          }, function ( result ) {

            if( result ){

              resolve( result );

            } else {

              reject( "ERROR: Failed to Evaluate" );

            }

          });

      })).then(function( result ){

        return result;

      });

    },

    getPort: function(){
      if( global.currentPort < 65535 ){

        global.currentPort++;
        return global.currentPort;

      } else {

        global.currentPort = 49152;
        return global.currentPort;

      }

    },

    defaultRequestOptions: {

      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",

      viewport: {

        width: 1280,

        height: 650

      },

      timeout: 5000

    }

  };


  request.prototype = _.extend( request.prototype, proto );

  return request;


})();


module.exports = Request;
