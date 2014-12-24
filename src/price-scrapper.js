var _ = require('underscore')
, cheerio = require('cheerio');


var PriceScrapper = (function(){

  var scrapper = function(){



  }


  var proto = {

    constructor: function(){


    },

    /**
    *
    * getPricesFromBody
    *
    * Parameters:
    *  url: URL of site you want to get dom of
    *  options:
    *   ( See this.defaultRequestOptions )
    *  callback:
    *     returns:
    *        err: Any err string that occured while pulling dom
    *        prices: JSON object of prices key and the corresponding selector
    *
    **/

    getPricesFromBody: function( bodyStr ){

      var $ = cheerio.load(bodyStr);

      var bodyEl = $('body');

      var prices = {}

      this._getPrices( bodyEl, prices, [] )

      return

    },

    getPricesFromBody: function( xpathSelector ){



    },

    _getPrices: function( element, prices, selectors ){
      var selector, el, sels;

      if( element.children().length > 0 ){

        for( var i = 0; i < element.children().length; i++ ){

          el = element.children().get( i )

          selector = this._getSelector(el);

          if( selector ){

            selectors.push( selector )

          }


          sels = this._clone( selectors )

          this.getPrices( el, prices, sel )

        }


      } else {



      }

    },

    _getSelector: function( element ){

      return element.attr( "id" ) ? ( "#" + element.attr( "id" ) )
        : element.attr( "class" ) ? ("."+ this._getClass( element.attr( "class" ) ) ) : null;

    },

    _getClass: function( class ){

      var c, cArray;

      cArray = class.split(" ")

      if( cArray.length > 1 ){

        c = cArray;

      }

      return c

    },

    _clone: function( object ){

      return JSON.parse( JSON.stringify( object ) )

    }



  };


  request.prototype = _.extend( scrapper.prototype, proto );

  return scrapper;


})()


module.exports = PriceScrapper;
