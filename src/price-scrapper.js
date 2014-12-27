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

      var $ = cheerio.load( "<body>" + bodyStr + "</body>" );

      var bodyEl = $('body');

      var prices = {}

      this._getPrices( $, bodyEl, prices, [] )

      return prices;

    },

    getPriceFromBody: function( selector, bodyStr ){

      var $ = cheerio.load("<body>" + bodyStr + "</body>");
      var bodyEl = $('body');
      return this._findPrices( bodyEl( selector ) )[0]

    },

    _getPrices: function( $, element, prices, selectors, index ){

      var selector, el, sels
      , _this = this;

      if( element.children && element.children().length > 0 ){

        element.children().each( function( i, ele ) {

          var el = $(ele);

          selector = _this._getSelectorAttribute( el );

          if( selector ){

            selectors.push( selector )

          }


          sels = _this._clone( selectors )

          _this._getPrices( $, el, prices, sels, i )

        })


      } else {
        p = this._findPrices(element.html())
        if( p.length > 0 ){
          prices[p[0]] = {

            selector: this._createSelectorFromArray( selectors ),

            index : index

          }
        }

      }

    },

    _getSelectorAttribute: function( element ){
      var sel = element.attr( "class" ) ? this._getClass( element.attr( "class" )) : null;

      if(sel && sel.indexOf("undefined") >= 0){
        sel = null;
      }

      return sel

    },

    _createSelectorFromArray: function( selArray ){
      console.log(selArray)

      var count = 0
      , selector = "";
      for( var i = (selArray.length-1); i >= 0; i-- ){

        if( count >= 0 ){
          selector += " ";
        }

        if( count < 3 ){

          selector += selArray[i]
          count++;

        } else {

          break;

        }

      }

      return selector
    },

    _getClass: function( clss ){

      var c, cArray;

      cArray = clss.split(" ")

      if( cArray.length > 1 ){

        c = cArray[0];

      }

      return c

    },

    _clone: function( object ){

      return JSON.parse( JSON.stringify( object ) )

    },

    _findPrices: function( text ){

      var priceArray = /([$€£][0-9,]+(\.[0-9]{2})?)/g.exec(text)

      return _.uniq( priceArray, false )

    }



  };


  scrapper.prototype = _.extend( scrapper.prototype, proto );

  return scrapper;


})()


module.exports = PriceScrapper;
