var _ = require('underscore'),
  cheerio = require('cheerio'),
  request = new (require( './phantom-request' ))();


var PriceScrapper = ( function(){

  var scrapper = function(){};


  var proto = {

    constructor: function(){},

    /**
    *
    * getPricesFromURL
    *
    * Parameters:
    *  url: URL of site you want to get dom of
    *  options:
    *   ( See this.defaultRequestOptions )
    *  callback:
    *     returns:
    *        err: Any err string that occured while pulling dom
    *        pricesArray: [{ price: "$400.00", index: 0, selector: ".class"}]
    *
    **/

    getPricesFromURL: function( url, callback ){
      var _this = this, prices = null;

      request.getDomFromUrl( url, {}, function( err, result ){

        if( !err ){

          prices = _this.getPricesFromBodyInnerHTML( result.body.innerHTML );

          callback( null, prices );

        } else {

          callback( err, prices );

        }

      });

    },

    getPriceFromURL: function( selector, index, url, callback ){
      var _this = this, price = null;

      request.getDomFromUrl( url, {}, function( err, result ){

        if( !err ){

          price = _this.getPriceFromBodyInnerHTML( selector, result.body.innerHTML, index );

          callback( null, price );

        } else {

          callback( err, price );

        }

      });

    },

    /**
    *
    * getPricesFromBodyInnerHTML
    *
    * Parameters:
    *  bodyStr: body.innerHTML <- use this
    *  options:
    *   ( See this.defaultRequestOptions )
    *  callback:
    *     returns:
    *        err: Any err string that occured while pulling dom
    *        pricesArray: [{ price: "$400.00", index: 0, selector: ".class"}]
    *
    **/

    getPricesFromBodyInnerHTML: function( bodyStr ){

      var $ = cheerio.load( "<body>" + bodyStr + "</body>" ),
        bodyEl = $('body'), prices = [], el = null,
        price = null, idxPrice = null,
        _this = this;

      this._getPrices( $, bodyEl, prices, [] );

      /* This loop is used to get indexes for selectors collected*/
      /* TODO: Probably should clean this up */
      /*jshint loopfunc: true */
      for( var i = 0; i < prices.length; i++ ){

        price = prices[i];
        el = $( price.selector );
        el.each( function( n, ele ) {

          element = $( ele );
          idxPrice = _this._findPrices( element.html() );

          if( idxPrice !== null && idxPrice[0] === price.price ){

            price.index = n;

          }

        });

      }

      return prices;

    },

    getPriceFromBodyInnerHTML: function( selector, bodyStr, idx ){

      var $ = cheerio.load( "<body>" + bodyStr + "</body>" ),
        bodyEl = $(selector),
        price = null,
        index = idx ? idx : 0;

      try {

        price = this._findPrices( $(bodyEl[index]).html() )[0];

      } catch (e) {

        return false;

      }

      return price;

    },

    _getPrices: function( $, element, prices, selectors, index ){

      var selector, el, sels, _this = this;

      if( element.children && element.children().length > 0 ){

        element.children().each( function( i, ele ) {

          var el = $( ele );

          selector = _this._getSelectorAttribute( el );

          sels = _this._clone( selectors );

          if( selector ){

            sels.push( selector );

          } else if ( el.children().length <= 0 ) {

            sels.push( el[0].name );

          }

          _this._getPrices( $, el, prices, sels, i );

        });


      } else {

        var p = this._findPrices( element.html() );

        if( p && p.length > 0 ){

          prices.push({

            price: p[0],

            selector: this._createSelectorFromArray( selectors )

          });

        }

      }

    },

    _getSelectorAttribute: function( element ){
      var sel = element.attr( "id" ) ? ( "#" + ( element.attr( "id" ) ? this._getClass( element.attr( "id" ) ) : null) )
        : ( "." + (element.attr( "class" ) ? this._getClass( element.attr( "class" ) ) : null ) );

      if(sel && (sel.indexOf("undefined") >= 0 || sel.indexOf("null") >= 0) ){
        sel = null;
      }

      return sel;

    },

    _createSelectorFromArray: function( selArray ){

      var selector = "";

      for( var i = 0; i < selArray.length; i++ ){

        if( i > 0 ){
          selector += " ";
        }

        selector += selArray[i];

      }

      return selector;
    },

    _getClass: function( clss ){

      var c, cArray;

      cArray = clss.split(" ");

      if( cArray.length > 0 ){

        c = cArray[0];

      } else {

        c = clss;

      }

      return c;

    },

    _clone: function( object ){

      return JSON.parse( JSON.stringify( object ) );

    },

    _findPrices: function( text ){

      var priceArray = text.match(/([$€£][0-9,]+(\.[0-9]{2})?)/g);
      return priceArray;

    }

  };

  scrapper.prototype = _.extend( scrapper.prototype, proto );

  return scrapper;


})();


module.exports = PriceScrapper;
