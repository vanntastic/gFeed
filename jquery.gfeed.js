(function(b){var c=null;b.fn.rssfeed=function(e,d){var f={limit:10,header:true,entriesHead:'<h1 class="rssHeader">                        <a href="{feedLink}" title="{feedDescription}">{feedTitle}</a>                        <span style="font-size:10px;color:#ccc">                          ({feedCount} feeds)                        </span>                      </h1>                    <div class="rssBody">                    <ul>',entriesBody:'<li class="rssRow">                      <h4>                        <a href="{link}" title="View this feed at {title}">                          {title}                         </a>                      </h4>                      <div style="font-size:10px;color:#ccc">{pubDate}</div>                      <p>{contentSnippet}</p>                      </li>',entriesFooter:"</ul></div>",rowSnippet:false,displayHeadingAt:false,showerror:true,errormsg:"",key:null};var d=b.extend(f,d);return this.each(function(h,k){var g=b(k);if(!g.hasClass("rssFeed")){g.addClass("rssFeed")}if(e==null){return false}var j="http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q="+e;if(d.limit!=null){j+="&num="+d.limit}if(d.key!=null){j+="&key="+d.key}b.getJSON(j,function(i){if(i.responseStatus==200){a(k,i.responseData.feed,d)}else{if(d.showerror){if(d.errormsg!=""){var l=d.errormsg}else{var l=i.responseDetails}}b(k).html('<div class="rssError"><p>'+l+"</p></div>")}})})};var a=function(k,q,r){if(!q){return false}var h="";var p={feedURL:q.feedURL,feedTitle:q.title,feedLink:q.link,feedDescription:q.description,feedAuthor:q.author,feedEntries:q.entries,feedCount:q.entries.length};var d=b.extend(r,p);if(r.rowSnippet){if(r.displayHeadingAt){var m=b(r.displayHeadingAt).html().interpret(d);b(r.displayHeadingAt).html(m)}for(var g=0;g<q.entries.length;g++){var n=q.entries[g];var o=new Date(n.publishedDate);var l=o.toLocaleDateString()+" "+o.toLocaleTimeString();var f=b.extend(d,n,{pubDate:l});var j="";h+=r.rowSnippet.head+b(k).children(r.rowSnippet.body).html().interpret(f)+r.rowSnippet.foot}}else{if(r.header){h+=r.entriesHead.interpret(d)}for(var g=0;g<q.entries.length;g++){var n=q.entries[g];var o=new Date(n.publishedDate);var l=o.toLocaleDateString()+" "+o.toLocaleTimeString();var f=b.extend(d,n,{pubDate:l});h+=r.entriesBody.interpret(f)}if(r.header&&!r.inline){h+=r.entriesFooter.interpret(f)}}b(k).show();b(k).html(h)}})(jQuery);String.prototype.interpret=function(a){return this.replace(/{([^{}]*)}/g,function(d,c){var e=a[c];return typeof e==="string"||typeof e==="number"?e:d})};