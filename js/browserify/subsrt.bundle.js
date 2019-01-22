/******************************************************************************************
 * subsrt 1.0.0
 * https://github.com/papnkukn/subsrt
 * browserify -r ./subsrt.js:subsrt -r ./format/vtt.js -r ./format/lrc.js -r ./format/smi.js -r ./format/ssa.js -r ./format/ass.js -r ./format/sub.js -r ./format/srt.js -r ./format/sbv.js -r ./format/json.js > subsrtbundle.js
 * var subsrt = require("subsrt");
 * subsrt.convert(sub, { format: 'srt' });
 ******************************************************************************************/
require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/format/ass.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "ass";

//Compatible format
var ssa = require('./ssa.js');

module.exports = {
  name: FORMAT_NAME,
  helper: ssa.helper,
  detect: ssa.detect,
  parse: ssa.parse,
  build: ssa.build
};
},{"./ssa.js":"/format/ssa.js"}],"/format/json.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "json";

/******************************************************************************************
 * Parses captions in JSON format
 ******************************************************************************************/
function parse(content, options) {
  return JSON.parse(content);
};

/******************************************************************************************
 * Builds captions in JSON format
 ******************************************************************************************/
function build(captions, options) {
  return JSON.stringify(captions, " ", 2);
}

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect(content) {
  if (typeof content === "string") {
    if (/^\[[\s\r\n]*\{[\s\S]*\}[\s\r\n]*\]$/g.test(content)) {
      /*
      [
        { ... }
      ]
      */
      return "json";
    }
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
module.exports = {
  name: FORMAT_NAME,
  detect: detect,
  parse: parse,
  build: build
};
},{}],"/format/lrc.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "lrc";

var helper = {
  toMilliseconds: function(s) {
    var match = /^\s*(\d+):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(s);
    var mm = parseInt(match[1]);
    var ss = parseInt(match[2]);
    var ff = match[4] ? parseInt(match[4]) : 0;
    var ms = mm * 60 * 1000 + ss * 1000 + ff * 10;
    return ms;
  },
  toTimeString: function(ms) {
    var mm = Math.floor(ms / 1000 / 60);
    var ss = Math.floor(ms / 1000 % 60);
    var ff = Math.floor(ms % 1000);
    var time = (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss + "." + (ff < 100 ? "0" : "") + (ff < 10 ? "0" : Math.floor(ff / 10));
    return time;
  }
};

/******************************************************************************************
 * Parses captions in LRC format: https://en.wikipedia.org/wiki/LRC_%28file_format%29
 ******************************************************************************************/
function parse(content, options) {
  var prev = null;
  var captions = [ ];
  var eol = options.eol || "\r\n";
  var parts = content.split(/\r?\n/);
  for (var i = 0; i < parts.length; i++) {
    if (!parts[i] || parts[i].trim().length == 0) {
      continue;
    }
  
    //LRC content
    var regex = /^\[(\d{1,2}:\d{1,2}([.,]\d{1,3})?)\](.*)(\r?\n)*$/gi;
    var match = regex.exec(parts[i]);
    if (match) {
      var caption = { };
      caption.type = "caption";
      caption.start = helper.toMilliseconds(match[1]);
      caption.end = caption.start + 2000;
      caption.duration = caption.end - caption.start;
      caption.content = match[3];
      caption.text = caption.content;
      captions.push(caption);
      
      //Update previous
      if (prev) {
        prev.end = caption.start;
        prev.duration = prev.end - prev.start;
      }
      prev = caption;
      continue;
    }
    
    //LRC meta
    var meta = /^\[([\w\d]+):([^\]]*)\](\r?\n)*$/gi.exec(parts[i]);
    if (meta) {
      var caption = { };
      caption.type = "meta";
      caption.tag = meta[1];
      if (meta[2]) {
        caption.data = meta[2];
      }
      captions.push(caption);
      continue;
    }
    
    if (options.verbose) {
      console.log("WARN: Unknown part", parts[i]);
    }
  }
  return captions;
};

/******************************************************************************************
 * Builds captions in LRC format: https://en.wikipedia.org/wiki/LRC_%28file_format%29
 ******************************************************************************************/
function build(captions, options) {
  var content = "";
  var lyrics = false;
  var eol = options.eol || "\r\n";
  for (var i = 0; i < captions.length; i++) {
    var caption = captions[i];
    if (caption.type == "meta") {
      if (caption.tag && caption.data) {
        content += "[" + caption.tag + ":" + caption.data.replace(/[\r\n]+/g, " ") + "]" + eol;
      }
      continue;
    }
    
    if (typeof caption.type === "undefined" || caption.type == "caption") {
      if (!lyrics) {
        content += eol; //New line when lyrics start
        lyrics = true;
      }
      content += "[" + helper.toTimeString(caption.start) + "]" + caption.text + eol;
      continue;
    }
    
    if (options.verbose) {
      console.log("SKIP:", caption);
    }
  }
  
  return content;
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect(content) {
  if (typeof content === "string") {
    if (/\r?\n\[(\d+:\d{1,2}([.,]\d{1,3})?)\](.*)\r?\n/.test(content)) {
      /*
      [04:48.28]Sister, perfume?
      */
      //return "lrc";
      return true;
    }
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
module.exports = {
  name: FORMAT_NAME,
  helper: helper,
  detect: detect,
  parse: parse,
  build: build
};
},{}],"/format/sbv.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "sbv";

var helper = {
  toMilliseconds: function(s) {
    var match = /^\s*(\d{1,2}):(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(s);
    var hh = parseInt(match[1]);
    var mm = parseInt(match[2]);
    var ss = parseInt(match[3]);
    var ff = match[5] ? parseInt(match[5]) : 0;
    var ms = hh * 3600 * 1000 + mm * 60 * 1000 + ss * 1000 + ff;
    return ms;
  },
  toTimeString: function(ms) {
    var hh = Math.floor(ms / 1000 / 3600);
    var mm = Math.floor(ms / 1000 / 60 % 60);
    var ss = Math.floor(ms / 1000 % 60);
    var ff = Math.floor(ms % 1000);
    var time = (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss + "." + (ff < 100 ? "0" : "") + (ff < 10 ? "0" : "") + ff;
    return time;
  }
};

/******************************************************************************************
 * Parses captions in SubViewer format (.sbv)
 ******************************************************************************************/
function parse(content, options) {
  var captions = [ ];
  var eol = options.eol || "\r\n";
  var parts = content.split(/\r?\n\s+\r?\n/);
  for (var i = 0; i < parts.length; i++) {
    var regex = /^(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\s*[,;]\s*(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\r?\n([\s\S]*)(\r?\n)*$/gi;
    var match = regex.exec(parts[i]);
    if (match) {
      var caption = { };
      caption.type = "caption";
      caption.start = helper.toMilliseconds(match[1]);
      caption.end = helper.toMilliseconds(match[3]);
      caption.duration = caption.end - caption.start;
      var lines = match[5].split(/\[br\]|\r?\n/gi);
      caption.content = lines.join(eol);
      caption.text = caption.content.replace(/\>\>\s*[^:]+:\s*/g, ""); //>> SPEAKER NAME: 
      captions.push(caption);
      continue;
    }
    
    if (options.verbose) {
      console.log("WARN: Unknown part", parts[i]);
    }
  }
  return captions;
};

/******************************************************************************************
 * Builds captions in SubViewer format (.sbv)
 ******************************************************************************************/
function build(captions, options) {
  var content = "";
  var eol = options.eol || "\r\n";
  for (var i = 0; i < captions.length; i++) {
    var caption = captions[i];
    if (typeof caption.type === "undefined" || caption.type == "caption") {
      content += helper.toTimeString(caption.start) + "," + helper.toTimeString(caption.end) + eol;
      content += caption.text + eol;
      content += eol;
      continue;
    }
    if (options.verbose) {
      console.log("SKIP:", caption);
    }
  }
  
  return content;
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect(content) {
  if (typeof content !== "string") {
    throw new Error("Expected string content!");
  }
  
  if (/\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?\s*[,;]\s*\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?/g.test(content)) {
    /*
    00:04:48.280,00:04:50.510
    Sister, perfume?
    */
    return "sbv";
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
module.exports = {
  name: FORMAT_NAME,
  helper: helper,
  detect: detect,
  parse: parse,
  build: build
};
},{}],"/format/smi.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "smi";

var helper = {
  htmlEncode: function(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\</g, '&lt;')
      .replace(/\>/g, '&gt;')
      //.replace(/\s/g, '&nbsp;')
      .replace(/\r?\n/g, '<BR>');
  },
  htmlDecode: function(html, eol){
    return html
      .replace(/\<BR\s*\/?\>/gi, eol || '\r\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }
};

/******************************************************************************************
 * Parses captions in SAMI format (.smi)
 ******************************************************************************************/
function parse(content, options) {
  var captions = [ ];
  var eol = options.eol || "\r\n";
  
  var title = /\<TITLE[^\>]*\>([\s\S]*)\<\/TITLE\>/gi.exec(content);
  if (title) {
    var caption = { };
    caption.type = "meta";
    caption.name = "title";
    caption.data = title[1].replace(/^[\s\r\n]*/g, "").replace(/[\s\r\n]*$/g, "");
    captions.push(caption);
  }
  
  var style = /\<STYLE[^\>]*\>([\s\S]*)\<\/STYLE\>/gi.exec(content);
  if (style) {
    var caption = { };
    caption.type = "meta";
    caption.name = "style";
    caption.data = style[1];
    captions.push(caption);
  }
  
  var sami = content
    .replace(/^[\s\S]*\<BODY[^\>]*\>/gi, "") //Remove content before body
    .replace(/\<\/BODY[^\>]*\>[\s\S]*$/gi, ""); //Remove content after body
    
  var prev = null;
  var parts = sami.split(/\<SYNC/gi);
  for (var i = 0; i < parts.length; i++) {
    if (!parts[i] || parts[i].trim().length == 0) {
      continue;
    }
    
    var part = '<SYNC' + parts[i];
    
    //<SYNC Start = 1000>
    var match = /^\<SYNC[^\>]+Start\s*=\s*["']?(\d+)["']?[^\>]*\>([\s\S]*)/gi.exec(part);
    if (match) {
      var caption = { };
      caption.type = "caption";
      caption.start = parseInt(match[1]);
      caption.end = caption.start + 2000;
      caption.duration = caption.end - caption.start;
      caption.content = match[2].replace(/^\<\/SYNC[^\>]*>/gi, "");
      
      var blank = true;
      var p = /^\<P[^\>]+Class\s*=\s*["']?([\w\d\-_]+)["']?[^\>]*\>([\s\S]*)/gi.exec(caption.content);
      if (!p) {
        p = /^\<P([^\>]*)\>([\s\S]*)/gi.exec(caption.content);
      }
      if (p) {
        var html = p[2].replace(/\<P[\s\S]+$/gi, ""); //Remove string after another <P> tag
        html = html.replace(/\<BR\s*\/?\>/gi, eol).replace(/\<[^\>]+\>/g, ""); //Remove all tags
        html = html.replace(/^[\s\r\n]+/g, "").replace(/[\s\r\n]+$/g, ""); //Trim new lines and spaces
        blank = (html.replace(/&nbsp;/gi, " ").replace(/[\s\r\n]+/g, "").length == 0);
        caption.text = helper.htmlDecode(html, eol);
      }
      
      if (!options.preserveSpaces && blank) {
        if (options.verbose) {
          console.log("INFO: Skipping white space caption at " + caption.start);
        }
      }
      else {
        captions.push(caption);
      }
      
      //Update previous
      if (prev) {
        prev.end = caption.start;
        prev.duration = prev.end - prev.start;
      }
      prev = caption;
      continue;
    }
    
    if (options.verbose) {
      console.log("WARN: Unknown part", parts[i]);
    }
  }
  
  return captions;
};

/******************************************************************************************
 * Builds captions in SAMI format (.smi)
 ******************************************************************************************/
function build(captions, options) {
  var eol = options.eol || "\r\n";
  
  var content = "";
  content += '<SAMI>' + eol;
  content += '<HEAD>' + eol;
  content += '<TITLE>' + (options.title || "") + '</TITLE>' + eol;
  content += '<STYLE TYPE="text/css">' + eol;
  content += '<!--' + eol;
  content += 'P { font-family: Arial; font-weight: normal; color: white; background-color: black; text-align: center; }' + eol;
  content += '.LANG { Name: ' + (options.langName || "English") + '; lang: ' + (options.langCode || "en-US") + '; SAMIType: CC; }' + eol;
  content += '-->' + eol;
  content += '</STYLE>' + eol;
  content += '</HEAD>' + eol;
  content += '<BODY>' + eol;
  
  for (var i = 0; i < captions.length; i++) {
    var caption = captions[i];
    if (caption.type == "meta") {
      continue;
    }
    
    if (typeof caption.type === "undefined" || caption.type == "caption") {
      //Start of caption
      content += '<SYNC Start=' + caption.start + '>' + eol;
      content += '  <P Class=LANG>' + helper.htmlEncode(caption.text || "") + (options.closeTags ? '</P>' : "") + eol;
      if (options.closeTags) {
        content += '</SYNC>' + eol;
      }
      
      //Blank line indicates the end of caption
      content += '<SYNC Start=' + caption.end + '>' + eol;
      content += '  <P Class=LANG>' + '&nbsp;' + (options.closeTags ? '</P>' : "") + eol;
      if (options.closeTags) {
        content += '</SYNC>' + eol;
      }
      
      continue;
    }
    
    if (options.verbose) {
      console.log("SKIP:", caption);
    }
  }

  content += '</BODY>' + eol;
  content += '</SAMI>' + eol;
  
  return content;
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect(content) {
  if (typeof content === "string") {
    if (/\<SAMI[^\>]*\>[\s\S]*\<BODY[^\>]*\>/g.test(content)) {
      /*
      <SAMI>
      <BODY>
      <SYNC Start=...
      ...
      </BODY>
      </SAMI>
      */
      return "smi";
    }
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
module.exports = {
  name: FORMAT_NAME,
  helper: helper,
  detect: detect,
  parse: parse,
  build: build
};
},{}],"/format/srt.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "srt";

var helper = {
  toMilliseconds: function(s) {
    var match = /^\s*(\d{1,2}):(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(s);
    var hh = parseInt(match[1]);
    var mm = parseInt(match[2]);
    var ss = parseInt(match[3]);
    var ff = match[5] ? parseInt(match[5]) : 0;
    var ms = hh * 3600 * 1000 + mm * 60 * 1000 + ss * 1000 + ff;
    return ms;
  },
  toTimeString: function(ms) {
    var hh = Math.floor(ms / 1000 / 3600);
    var mm = Math.floor(ms / 1000 / 60 % 60);
    var ss = Math.floor(ms / 1000 % 60);
    var ff = Math.floor(ms % 1000);
    var time = (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss + "," + (ff < 100 ? "0" : "") + (ff < 10 ? "0" : "") + ff;
    return time;
  }
};

/******************************************************************************************
 * Parses captions in SubRip format (.srt)
 ******************************************************************************************/
function parse(content, options) {
  var captions = [ ];
  var eol = options.eol || "\r\n";
  var parts = content.split(/\r?\n\s+\r?\n/g);
  for (var i = 0; i < parts.length; i++) {
    var regex = /^(\d+)\r?\n(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\s*\-\-\>\s*(\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?)\r?\n([\s\S]*)(\r?\n)*$/gi;
    var match = regex.exec(parts[i]);
    if (match) {
      var caption = { };
      caption.type = "caption";
      caption.index = parseInt(match[1]);
      caption.start = helper.toMilliseconds(match[2]);
      caption.end = helper.toMilliseconds(match[4]);
      caption.duration = caption.end - caption.start;
      var lines = match[6].split(/\r?\n/);
      caption.content = lines.join(eol);
      caption.text = caption.content
        .replace(/\<[^\>]+\>/g, "") //<b>bold</b> or <i>italic</i>
        .replace(/\{[^\}]+\}/g, "") //{b}bold{/b} or {i}italic{/i}
        .replace(/\>\>\s*[^:]*:\s*/g, ""); //>> SPEAKER NAME: 
      captions.push(caption);
      continue;
    }
    
    if (options.verbose) {
      console.log("WARN: Unknown part", parts[i]);
    }
  }
  return captions;
};

/******************************************************************************************
 * Builds captions in SubRip format (.srt)
 ******************************************************************************************/
function build(captions, options) {
  var srt = "";
  var eol = options.eol || "\r\n";
  for (var i = 0; i < captions.length; i++) {
    var caption = captions[i];
    if (typeof caption.type === "undefined" || caption.type == "caption") {
      srt += (i + 1).toString() + eol;
      srt += helper.toTimeString(caption.start) + " --> " + helper.toTimeString(caption.end) + eol;
      srt += caption.text + eol;
      srt += eol;
      continue;
    }
    if (options.verbose) {
      console.log("SKIP:", caption);
    }
  }
  
  return srt;
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect(content) {
  if (typeof content === "string") {
    if (/\d+\r?\n\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?\s*\-\-\>\s*\d{1,2}:\d{1,2}:\d{1,2}([.,]\d{1,3})?/g.test(content)) {
      /*
      3
      00:04:48,280 --> 00:04:50,510
      Sister, perfume?
      */
      return FORMAT_NAME;
    }
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
module.exports = {
  name: FORMAT_NAME,
  helper: helper,
  detect: detect,
  parse: parse,
  build: build
};
},{}],"/format/ssa.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "ssa";

var helper = {
  toMilliseconds: function(s) {
    var match = /^\s*(\d+:)?(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(s);
    var hh = match[1] ? parseInt(match[1].replace(":", "")) : 0;
    var mm = parseInt(match[2]);
    var ss = parseInt(match[3]);
    var ff = match[5] ? parseInt(match[5]) : 0;
    var ms = hh * 3600 * 1000 + mm * 60 * 1000 + ss * 1000 + ff * 10;
    return ms;
  },
  toTimeString: function(ms) {
    var hh = Math.floor(ms/ 1000 / 3600);
    var mm = Math.floor(ms/ 1000 / 60 % 60);
    var ss = Math.floor(ms/ 1000 % 60);
    var ff = Math.floor(ms % 1000 / 10); //2 digits
    var time = hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss + "." + (ff < 10 ? "0" : "") + ff;
    return time;
  }
};

/******************************************************************************************
 * Parses captions in SubStation Alpha format (.ssa)
 ******************************************************************************************/
function parse(content, options) {
  var meta;
  var columns = null;
  var captions = [ ];
  var eol = options.eol || "\r\n";
  var parts = content.split(/\r?\n\s*\r?\n/);
  for (var i = 0; i < parts.length; i++) {
    var regex = /^\s*\[([^\]]+)\]\r?\n([\s\S]*)(\r?\n)*$/gi;
    var match = regex.exec(parts[i]);
    if (match) {
      var tag = match[1];
      var lines = match[2].split(/\r?\n/);
      for (var l = 0; l < lines.length; l++) {
        var line = lines[l];
        if (/^\s*;/.test(line)) {
          continue; //Skip comment
        }
        var m = /^\s*([^:]+):\s*(.*)(\r?\n)?$/.exec(line);
        if (m) {
          if (tag == "Script Info") {
            if (!meta) {
              meta = { };
              meta.type = "meta";
              meta.data = { };
              captions.push(meta);
            }
            var name = m[1].trim();
            var value = m[2].trim();
            meta.data[name] = value;
            continue;
          }
          if (tag == "V4 Styles" || tag == "V4+ Styles") {
            var name = m[1].trim();
            var value = m[2].trim();
            if (name == "Format") {
              columns = value.split(/\s*,\s*/g);
              continue;
            }
            if (name == "Style") {
              var values = value.split(/\s*,\s*/g);
              var caption = { };
              caption.type = "style";
              caption.data = { };
              for (var c = 0; c < columns.length && c < values.length; c++) {
                caption.data[columns[c]] = values[c];
              }
              captions.push(caption);
              continue;
            }
          }
          if (tag == "Events") {
            var name = m[1].trim();
            var value = m[2].trim();
            if (name == "Format") {
              columns = value.split(/\s*,\s*/g);
              continue;
            }
            if (name == "Dialogue") {
              var values = value.split(/\s*,\s*/g);
              var caption = { };
              caption.type = "caption";
              caption.data = { };
              for (var c = 0; c < columns.length && c < values.length; c++) {
                caption.data[columns[c]] = values[c];
              }
              caption.start = helper.toMilliseconds(caption.data["Start"]);
              caption.end = helper.toMilliseconds(caption.data["End"]);
              caption.duration = caption.end - caption.start;
              caption.content = caption.data["Text"];
              
              //Work-around for missing text (when the text contains ',' char)
              function getPosition(s, search, index) {
                return s.split(search, index).join(search).length;
              }
              var indexOfText = getPosition(value, ',', columns.length - 1) + 1;
              caption.content = value.substr(indexOfText);
              caption.data["Text"] = caption.content;
              
              caption.text = caption.content
                .replace(/\\N/g, eol) //"\N" for new line
                .replace(/\{[^\}]+\}/g, ""); //{\pos(400,570)}
              captions.push(caption);
              continue;
            }
          }
        }
      }
    }
    
    if (options.verbose) {
      console.log("WARN: Unknown part", parts[i]);
    }
  }
  return captions;
};

/******************************************************************************************
 * Builds captions in SubStation Alpha format (.ssa)
 ******************************************************************************************/
function build(captions, options) {
  var eol = options.eol || "\r\n";
  var ass = options.format == "ass";
  
  var content = "";
  content += "[Script Info]" + eol;
  content += "; Script generated by subsrt " + eol;
  content += "ScriptType: v4.00" + (ass ? "+" : "") + eol;
  content += "Collisions: Normal" + eol;
  content += eol;
  if (ass) {
    content += "[V4+ Styles]" + eol;
    content += "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding" + eol;
    content += "Style: DefaultVCD, Arial,28,&H00B4FCFC,&H00B4FCFC,&H00000008,&H80000008,-1,0,0,0,100,100,0.00,0.00,1,1.00,2.00,2,30,30,30,0" + eol;
  }
  else {
    content += "[V4 Styles]" + eol;
    content += "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding" + eol;
    content += "Style: DefaultVCD, Arial,28,11861244,11861244,11861244,-2147483640,-1,0,1,1,2,2,30,30,30,0,0" + eol;
  }
  content += eol;
  content += "[Events]" + eol;
  content += "Format: " + (ass ? "Layer" : "Marked") + ", Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text" + eol;
  
  for (var i = 0; i < captions.length; i++) {
    var caption = captions[i];
    if (caption.type == "meta") {
      continue;
    }
    
    if (typeof caption.type === "undefined" || caption.type == "caption") {
      content += "Dialogue: " + (ass ? "0" : "Marked=0") + "," + helper.toTimeString(caption.start) + "," + helper.toTimeString(caption.end) + ",DefaultVCD, NTP,0000,0000,0000,," + caption.text.replace(/\r?\n/g, "\\N") + eol;
      continue;
    }
    
    if (options.verbose) {
      console.log("SKIP:", caption);
    }
  }
  
  return content;
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect(content) {
  if (typeof content !== "string") {
    throw new Error("Expected string content!");
  }
  
  if (/^[\s\r\n]*\[Script Info\]\r?\n/g.test(content) && /[\s\r\n]*\[Events\]\r?\n/g.test(content)) {
    /*
    [Script Info]
    ...
    [Events]
    */
    
    //Advanced (V4+) styles for ASS format
    return content.indexOf("[V4+ Styles]") > 0 ? "ass" : "ssa";
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
module.exports = {
  name: FORMAT_NAME,
  helper: helper,
  detect: detect,
  parse: parse,
  build: build
};
},{}],"/format/sub.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "sub";
var DEFAULT_FPS = 25;

/******************************************************************************************
 * Parses captions in MicroDVD format: https://en.wikipedia.org/wiki/MicroDVD
 ******************************************************************************************/
function parse(content, options) {
  var fps = options.fps > 0 ? options.fps : DEFAULT_FPS;
  var captions = [ ];
  var eol = options.eol || "\r\n";
  var parts = content.split(/\r?\n/g);
  for (var i = 0; i < parts.length; i++) {
    var regex = /^\{(\d+)\}\{(\d+)\}(.*)$/gi;
    var match = regex.exec(parts[i]);
    if (match) {
      var caption = { };
      caption.type = "caption";
      caption.index = i + 1;
      caption.frame = {
        start: parseInt(match[1]),
        end: parseInt(match[2])
      };
      caption.frame.count = caption.frame.end - caption.frame.start;
      caption.start = Math.round(caption.frame.start / fps);
      caption.end = Math.round(caption.frame.end / fps);
      caption.duration = caption.end - caption.start;
      var lines = match[3].split(/\|/g);
      caption.content = lines.join(eol);
      caption.text = caption.content.replace(/\{[^\}]+\}/g, ""); //{0}{25}{c:$0000ff}{y:b,u}{f:DeJaVuSans}{s:12}Hello!
      captions.push(caption);
      continue;
    }
    
    if (options.verbose) {
      console.log("WARN: Unknown part", parts[i]);
    }
  }
  return captions;
};

/******************************************************************************************
 * Builds captions in MicroDVD format: https://en.wikipedia.org/wiki/MicroDVD
 ******************************************************************************************/
function build(captions, options) {
  var fps = options.fps > 0 ? options.fps : DEFAULT_FPS;
  
  var sub = "";
  var eol = options.eol || "\r\n";
  for (var i = 0; i < captions.length; i++) {
    var caption = captions[i];
    if (typeof caption.type === "undefined" || caption.type == "caption") {
      var startFrame = typeof caption.frame == "object" && caption.frame.start >= 0 ? caption.frame.start : caption.start * fps;
      var endFrame = typeof caption.frame == "object" && caption.frame.end >= 0 ? caption.frame.end : caption.end * fps;
      var text = caption.text.replace(/\r?\n/, "|");
      sub += "{" + startFrame + "}" + "{" + endFrame + "}" + text + eol;
      continue;
    }
    
    if (options.verbose) {
      console.log("SKIP:", caption);
    }
  }
  
  return sub;
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect(content) {
  if (typeof content === "string") {
    if (/^\{\d+\}\{\d+\}(.*)/.test(content)) {
      /*
      {7207}{7262}Sister, perfume?
      */
      return FORMAT_NAME;
    }
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
module.exports = {
  name: FORMAT_NAME,
  detect: detect,
  parse: parse,
  build: build
};
},{}],"/format/vtt.js":[function(require,module,exports){
'use strict';

var FORMAT_NAME = "vtt";

var helper = {
  toMilliseconds: function(s) {
    var match = /^\s*(\d{1,2}:)?(\d{1,2}):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(s);
    var hh = match[1] ? parseInt(match[1].replace(":", "")) : 0;
    var mm = parseInt(match[2]);
    var ss = parseInt(match[3]);
    var ff = match[5] ? parseInt(match[5]) : 0;
    var ms = hh * 3600 * 1000 + mm * 60 * 1000 + ss * 1000 + ff;
    return ms;
  },
  toTimeString: function(ms) {
    var hh = Math.floor(ms / 1000 / 3600);
    var mm = Math.floor(ms / 1000 / 60 % 60);
    var ss = Math.floor(ms / 1000 % 60);
    var ff = Math.floor(ms % 1000);
    var time = (hh < 10 ? "0" : "") + hh + ":" + (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss + "," + (ff < 100 ? "0" : "") + (ff < 10 ? "0" : "") + ff;
    return time;
  }
};

/******************************************************************************************
 * Parses captions in WebVTT format (Web Video Text Tracks Format)
 ******************************************************************************************/
function parse(content, options) {
  var index = 1;
  var captions = [ ];
  var eol = options.eol || "\r\n";
  var parts = content.split(/\r?\n\s+\r?\n/);
  for (var i = 0; i < parts.length; i++) {
    //WebVTT data
    var regex = /^([^\r\n]+\r?\n)?((\d{1,2}:)?\d{1,2}:\d{1,2}([.,]\d{1,3})?)\s*\-\-\>\s*((\d{1,2}:)?\d{1,2}:\d{1,2}([.,]\d{1,3})?)\r?\n([\s\S]*)(\r?\n)*$/gi;
    var match = regex.exec(parts[i]);
    if (match) {
      var caption = { };
      caption.type = "caption";
      caption.index = index++;
      if (match[1]) {
        caption.cue = match[1].replace(/[\r\n]*/gi, "");
      }
      caption.start = helper.toMilliseconds(match[2]);
      caption.end = helper.toMilliseconds(match[5]);
      caption.duration = caption.end - caption.start;
      var lines = match[8].split(/\r?\n/);
      caption.content = lines.join(eol);
      caption.text = caption.content
        .replace(/\<[^\>]+\>/g, "") //<b>bold</b> or <i>italic</i>
        .replace(/\{[^\}]+\}/g, ""); //{b}bold{/b} or {i}italic{/i}
      captions.push(caption);
      continue;
    }
    
    //WebVTT meta
    var meta = /^([A-Z]+)(\r?\n([\s\S]*))?$/.exec(parts[i]);
    if (!meta) {
      //Try inline meta
      meta = /^([A-Z]+)\s+([^\r\n]*)?$/.exec(parts[i]);
    }
    if (meta) {
      var caption = { };
      caption.type = "meta";
      caption.name = meta[1];
      if (meta[3]) {
        caption.data = meta[3];
      }
      captions.push(caption);
      continue;
    }
    
    if (options.verbose) {
      console.log("WARN: Unknown part", parts[i]);
    }
  }
  return captions;
};

/******************************************************************************************
 * Builds captions in WebVTT format (Web Video Text Tracks Format)
 ******************************************************************************************/
function build(captions, options) {
  var eol = options.eol || "\r\n";
  var content = "WEBVTT" + eol + eol;
  for (var i = 0; i < captions.length; i++) {
    var caption = captions[i];
    if (caption.type == "meta") {
      if (caption.name == "WEBVTT") continue;
      content += caption.name + eol;
      content += caption.data ? caption.data + eol : "";
      content += eol;
      continue;
    }
    
    if (typeof caption.type === "undefined" || caption.type == "caption") {
      content += (i + 1).toString() + eol;
      content += helper.toTimeString(caption.start) + " --> " + helper.toTimeString(caption.end) + eol;
      content += caption.text + eol;
      content += eol;
      continue;
    }
    
    if (options.verbose) {
      console.log("SKIP:", caption);
    }
  }
  
  return content;
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
function detect(content) {
  if (typeof content !== "string") {
    throw new Error("Expected string content!");
  }
  
  if (/^[\s\r\n]*WEBVTT\r?\n/g.test(content)) {
    /*
    WEBVTT
    ...
    */
    return "vtt";
  }
};

/******************************************************************************************
 * Export
 ******************************************************************************************/
module.exports = {
  name: FORMAT_NAME,
  helper: helper,
  detect: detect,
  parse: parse,
  build: build
};
},{}],"subsrt":[function(require,module,exports){
'use strict';

var subsrt = {
  format: { }
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/******************************************************************************************
 * Loads the subtitle format parsers and builders
 ******************************************************************************************/
(function init() {
  //Load in the predefined order
  var formats = [ "vtt", "lrc", "smi", "ssa", "ass", "sub", "srt", "sbv", "json" ];
  for (var i = 0; i < formats.length; i++) {
    var f = formats[i];
    var handler = require('/format/' + f + '.js');
    subsrt.format[handler.name] = handler;
  }
})();

/******************************************************************************************
 * Gets a list of supported subtitle formats.
 ******************************************************************************************/
subsrt.list = function() {
  return Object.keys(subsrt.format);
};

/******************************************************************************************
 * Detects a subtitle format from the content.
 ******************************************************************************************/
subsrt.detect = function(content) {
  var formats = subsrt.list();
  for (var i = 0; i < formats.length; i++) {
    var f = formats[i];
    var handler = subsrt.format[f];
    if (typeof handler == "undefined") {
      continue;
    }
    if (typeof handler.detect != "function") {
      continue;
    }
    //Function 'detect' can return true or format name
    var d = handler.detect(content);
    if (d === true) { //Logical true
      return f;
    }
    if (f == d) { //Format name
      return d;
    }
  }
};

/******************************************************************************************
 * Parses a subtitle content.
 ******************************************************************************************/
subsrt.parse = function(content, options) {
  options = options || { };
  var format = options.format || subsrt.detect(content);
  if (!format || format.trim().length == 0) {
    throw new Error("Cannot determine subtitle format!");
  }
  
  var handler = subsrt.format[format];
  if (typeof handler == "undefined") {
    throw new Error("Unsupported subtitle format: " + format);
  }
  
  var func = handler.parse;
  if (typeof func != "function") {
    throw new Error("Subtitle format does not support 'parse' op: " + format);
  }
  
  return func(content, options);
};

/******************************************************************************************
 * Builds a subtitle content
 ******************************************************************************************/
subsrt.build = function(captions, options) {
  options = options || { };
  var format = options.format || "srt";
  if (!format || format.trim().length == 0) {
    throw new Error("Cannot determine subtitle format!");
  }
  
  var handler = subsrt.format[format];
  if (typeof handler == "undefined") {
    throw new Error("Unsupported subtitle format: " + format);
  }
  
  var func = handler.build;
  if (typeof func != "function") {
    throw new Error("Subtitle format does not support 'build' op: " + format);
  }
  
  return func(captions, options);
};

/******************************************************************************************
 * Converts subtitle format
 ******************************************************************************************/
subsrt.convert = function(content, options) {
  if (typeof options == "string") {
    options = { to: options };
  }
  options = options || { };
  
  var opt = clone(options);
  delete opt.format;
  
  if (opt.from) {
    opt.format = opt.from;
  }
  
  var captions = subsrt.parse(content, opt);
  if (opt.resync) {
    captions = subsrt.resync(captions, opt.resync);
  }
  
  opt.format = opt.to || options.format;
  var result = subsrt.build(captions, opt);
  
  return result;
};

/******************************************************************************************
 * Shifts the time of the captions.
 ******************************************************************************************/
subsrt.resync = function(captions, options) {
  options = options || { };
  
  var func, ratio, frame, offset;
  if (typeof options == "function") {
    func = options; //User's function to handle time shift
  }
  else if (typeof options == "number") {
    offset = options; //Time shift (+/- offset)
    func = function(a) {
      return [ a[0] + offset, a[1] + offset ];
    };
  }
  else if (typeof options == "object") {
    offset = (options.offset || 0) * (options.frame ? options.fps || 25 : 1);
    ratio = options.ratio || 1.0;
    frame = options.frame;
    func = function(a) {
      return [ Math.round(a[0] * ratio + offset), Math.round(a[1] * ratio + offset) ];
    };
  }
  else {
    throw new Error("Argument 'options' not defined!");
  }
  
  var resynced = [ ];
  for (var i = 0; i < captions.length; i++) {
    var caption = clone(captions[i]);
    if (typeof caption.type === "undefined" || caption.type == "caption") {
      if (frame) {
        var shift = func([ caption.frame.start, caption.frame.end ]);
        if (shift && shift.length == 2) {
          caption.frame.start = shift[0];
          caption.frame.end = shift[1];
          caption.frame.count = caption.frame.end - caption.frame.start;
        }
      }
      else {
        var shift = func([ caption.start, caption.end ]);
        if (shift && shift.length == 2) {
          caption.start = shift[0];
          caption.end = shift[1];
          caption.duration = caption.end - caption.start;
        }
      }
    }
    resynced.push(caption);
  }
  
  return resynced;
};

module.exports = subsrt;
},{}]},{},[]);
