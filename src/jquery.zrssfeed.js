/**
 * Plugin: jquery.zRSSFeed
 *
 * Version: 1.0.1
 * (c) Copyright 2010, Zazar Ltd
 *
 * Description: jQuery plugin for display of RSS feeds via Google Feed API
 *              (Based on original plugin jGFeed by jQuery HowTo)
 *
 * History:
 * 1.0.1 - Corrected issue with multiple instances
 *
 **/

(function($){

  var current = null;

  $.fn.rssfeed = function(url, options) {

    // Set plugin defaults
    var defaults = {
      limit: 10,
      header: true,
      headerClass: 'rssHeader',
      bodyClass: 'rssBody',
      rowClass: 'rssRow',
      titletag: 'h4',
      headerHtml: '<div class="{headerClass}">\
                    <a href="{feedLink}" title="{feedDescription}">{feedTitle}</a>\
                   </div>\
                   <div class="{bodyClass}"><ul>',
      date: true,
      content: true,
      snippet: true,
      showerror: true,
      errormsg: '',
      key: null
    };
    var options = $.extend(defaults, options);

    // Functions
    return this.each(function(i, e) {
      var $e = $(e);

      // Add feed class to user div
      if (!$e.hasClass('rssFeed')) $e.addClass('rssFeed');

      // Check for valid url
      if(url == null) return false;

      // Create Google Feed API address
      var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + url;
      if (options.limit != null) api += "&num=" + options.limit;
      if (options.key != null) api += "&key=" + options.key;

      // Send request
      $.getJSON(api, function(data){

        // Check for error
        if (data.responseStatus == 200) {

          // Process the feeds
          _callback(e, data.responseData.feed, options);
        } else {

          // Handle error if required
          if (options.showerror)
            if (options.errormsg != '') {
              var msg = options.errormsg;
            } else {
              var msg = data.responseDetails;
            };
            $(e).html('<div class="rssError"><p>'+ msg +'</p></div>');
        };
      });
    });
  };

  // Callback function to create HTML result
  var _callback = function(e, feeds, options) {
    if (!feeds) {
      return false;
    }
    var html = '';
    
    // Abstract Feed args from (http://code.google.com/apis/ajaxfeeds/documentation/reference.html#JSON)
    var feedObj = {
      feedURL: feeds.feedURL,
      feedTitle: feeds.title,
      feedLink: feeds.link,
      feedDescription: feeds.description,
      feedAuthor: feeds.author,
      feedEntries: feeds.entries
    };
    
    var feedOptions = $.extend(options,feedObj);
    
    // Add header if required
    if (options.header)
      html += options.headerHtml.interpret(feedOptions);
      console.log(feedOptions);

    // Add body
    // html += '<div class="{bodyClass}"><ul>'.interpret(feedOptions);

    // CONTINUE here, add the feed block parser...
    // Add feeds
    for (var i=0; i<feeds.entries.length; i++) {

      // Get individual feed
      var entry = feeds.entries[i];

      // Format published date
      var entryDate = new Date(entry.publishedDate);
      var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();

      // Add feed row
      html += '<li class="'+options.rowClass+'">'+
        '<'+ options.titletag +'><a href="'+ entry.link +'" title="View this feed at '+ feeds.title +'">'+ entry.title +'</a></'+ options.titletag +'>'
      if (options.date) html += '<div>'+ pubDate +'</div>'
      
      if (options.content) {

        // Use feed snippet if available and optioned
        if (options.snippet && entry.contentSnippet != '') {
          var content = entry.contentSnippet;
        } else {
          var content = entry.content;
        }

        html += '<p>'+ content +'</p>'
      }

      html += '</li>';

    }

    html += '</ul>' +
      '</div>'

    $(e).html(html);
    
  };
})(jQuery);


// Borrowed from : http://javascript.crockford.com/remedial.html and
// http://stackoverflow.com/questions/1408289/best-way-to-do-variable-interpolation-in-javascript
String.prototype.interpret = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};
