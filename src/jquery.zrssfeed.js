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
      entriesHead: '<h1 class="rssHeader">\
                        <a href="{feedLink}" title="{feedDescription}">{feedTitle}</a>\
                        <span style="font-size:10px;color:#ccc">\
                          ({feedCount} feeds)\
                        </span>\
                      </h1>\
                    <div class="rssBody">\
                    <ul>',
      entriesBody:  '<li class="rssRow">\
                      <h4>\
                        <a href="{link}" title="View this feed at {title}">\
                          {title}\
                         </a>\
                      </h4>\
                      <div style="font-size:10px;color:#ccc">{pubDate}</div>\
                      <p>{contentSnippet}</p>\
                      </li>',
      entriesFooter: '</ul></div>',
      rowSnippet: false,     
      displayHeadingAt: false,
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
      feedEntries: feeds.entries,
      feedCount: feeds.entries.length
    };
    
    var feedOptions = $.extend(options,feedObj);
    
    if (options.rowSnippet) {
      // display the heading if it's enabled
      if (options.displayHeadingAt){
        var newContent = $(options.displayHeadingAt).html().interpret(feedOptions);
        $(options.displayHeadingAt).html(newContent);
      }
        
      // Parse feeds
      for (var i=0; i<feeds.entries.length; i++) {
        var entry = feeds.entries[i];
        // Format published date
        var entryDate = new Date(entry.publishedDate);
        // this is available as pubDate
        var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
        var entryOptions = $.extend(feedOptions,entry,{pubDate: pubDate});
        
        html += $(e).children(options.rowSnippet).html().interpret(entryOptions);
      }
      
    }else{
      // Add header if required
      if (options.header)
        html += options.entriesHead.interpret(feedOptions);

      // Add feeds
      for (var i=0; i<feeds.entries.length; i++) {

        // Get individual feed
        var entry = feeds.entries[i];

        // Format published date
        var entryDate = new Date(entry.publishedDate);
        // this is available as pubDate
        var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
        var entryOptions = $.extend(feedOptions,entry,{pubDate: pubDate});

        // Combine the objects and parse
        html += options.entriesBody.interpret(entryOptions);

      }

      // Setup the footer if the header exists
      if (options.header && !options.inline)
        html += options.entriesFooter.interpret(entryOptions);
    };
    
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
