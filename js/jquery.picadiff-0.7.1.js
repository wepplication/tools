/*! picadiff - v0.7.1 - 2014-03-06
* https://github.com/picapica-net/jQuery.picadiff
* Copyright (c) 2014 Jan Graßegger; Licensed MIT */
/* global DIFF_INSERT */
/* global DIFF_DELETE */
/* global DIFF_EQUAL */

/**
 * Class for controling the alignment (number of linebreaks) of a text and the
 * wrapping of a text.
 * @module lib/Alignment
 */
var Alignment = function(){
  this.linecount = 0;
  this.wordcount = 0;
  this.charcount = 0;
  this.maxchars = 10;
  this.line = "";
};


/**
 * Appends a text with word wrapping after specified number of characters
*/

Alignment.prototype.append = function(text, classname){
  var textsplit = text.split(" ");
  if(classname) {
    this.line += '<span class="'+classname+'">';
  }
  for(var i in textsplit){
    this.charcount += textsplit[i].length + 1;
    this.wordcount += 1;
    if(this.charcount> this.maxchars){
      this.line += "<br>";
      this.linecount += 1;
      this.charcount = textsplit[i].length;
      this.wordcount = 1;
    }

    this.line += textsplit[i] + " ";

  }
  this.line = this.line.trim();
  if(classname) {
    this.line += "</span> ";
  }
};

/**
 * Appends a text with character wrapping after specified number of characters
*/
Alignment.prototype.appendStrict = function(text, classname){
  var textsplit = text.split("");
  if(classname){
    this.line += '<span class="'+classname+'">';
  }
  for(var i in textsplit){
    if(this.charcount > 0 && this.charcount % this.maxchars === 0){
      this.line += "<br>";
      this.linecount += 1;
      this.charcount = 0;
    }
    if(!(/^\s/g.test(textsplit[i]) && this.charcount === 0)){
      this.charcount += 1;
    }
    this.line += textsplit[i];
  }
  if(classname) {
    this.line += "</span>";
  }
};


/**
 * Sets the specified linecount. Corresponding to the linecount, linebreaks are
 * added to the text.
*/
Alignment.prototype.setLineCountTo = function(linecount){
  if(linecount === 0) { return; }
  while(this.linecount <= linecount){
    this.line += "<br>";
    this.wordcount = 0;
    this.charcount = 0;
    this.linecount += 1;
  }
};


/**
 * Sets the charactercount of the current line to a specified number.
 * Corresponding to the number of characters, nonbreaking spaces are added to
 * the current line.
*/
Alignment.prototype.setCharCountTo = function(charcount){
  while(this.charcount <= charcount){
    this.line += "&nbsp;";
    this.charcount +=1;
  }
};

/**
 * Class that extends the diff_match_patch class of the google framework with a
 * wordbased approach and
 * @module lib/DiffHandler
*/

function DiffHandler(){
	diff_match_patch.call(this);
}

DiffHandler.prototype = Object.create(diff_match_patch.prototype);
DiffHandler.prototype.constructor = DiffHandler;


/**
 * Returns a HTML representation of the diff where the two texts are represented
 * in one.
 * @return {String} containing the html representation of the diff
*/
DiffHandler.prototype.diff_html = function(diffs){
	var html = [];
	var pattern_amp = /&/g;
	var pattern_lt = /</g;
	var pattern_gt = />/g;
	var pattern_para = /\n/g;
	var editopen=false;
	for (var x = 0; x < diffs.length; x++) {
		var op = diffs[x][0];    // Operation (insert, delete, equal)
		var data = diffs[x][1];  // Text of change.
		var text = data.replace(pattern_amp, '&amp;').replace(pattern_lt, '&lt;')
			.replace(pattern_gt, '&gt;').replace(pattern_para, '&para;<br>');
		var html_string = "";
		switch (op) {
		case DIFF_INSERT:
			if(!editopen) { html_string += '<span class="edit">'; }

			html_string += '<span class="insertion">' + text + '</span>';

			if(editopen){ html_string += '</span>'; }
			editopen = !editopen;
			break;

		case DIFF_DELETE:
			if(!editopen) {html_string += '<span class="edit">'; }

			html_string += '<span class="deletion">' + text + '</span>';

			if(editopen){ html_string += '</span>'; }
			editopen = !editopen;
			break;

		case DIFF_EQUAL:
			if(editopen){
				html_string += '</span>';
				editopen = false;
			}
			html_string += '<span class="equal">' + text.trim() + '</span> ';
			break;
		}

		html[x] = html_string;
	}
	return html.join('');
};


/**
 * Constructs an array that indicates, which parts (influenced by intervalllength)
 * are equal in respect to the diff.
 * @return {Array} representation of the diff, indicating the equal parts
*/
DiffHandler.prototype.equal_line = function(diffs, intervalLength){
	var dataline = [];
	var index = 0;
	var currentvalue = 0;
	for(var x = 0; x < diffs.length; x++){
		var op = diffs[x][0];
		var data = diffs[x][1];
		for (var i = 0; i < data.length; i++){
			index++;
			if(op === 'DIFF_EQUAL') {currentvalue++; }

			if(index%intervalLength === 0){
				dataline[index/intervalLength-1]=(currentvalue===0)?0:currentvalue;
				currentvalue = 0;
			}
		}


	}
	return dataline;
};

var dataArraytoString = function(datarr){
	var returnvalue = "";
	for(var i in datarr){
		returnvalue += datarr[i] + " ";
	}
	return returnvalue;
};

var dataArraytoString2D = function(datarr, dim){
	var returnvalue = "";
	for(var i in datarr){
		returnvalue += datarr[i][dim] + " ";
	}
	return returnvalue;
};

/**
 * Constructs a HTML representation of the diff with alignment of the equal
 * source and dissertation lines. Linebreaks are set after the specified number
 * of characters, with word wrapping-
 * @return {Object} aligned dissertation text and source text
*/
DiffHandler.prototype.alligned_texts = function(diffs, maxchars){
	var source_line = new Alignment();
	var diss_line = new Alignment();

	source_line.maxchars=maxchars;
	diss_line.maxchars=maxchars;

	for(var x = 0; x < diffs.length; x++){
		var op = diffs[x][0];
		var data = diffs[x][1];

		switch(op){
		case DIFF_INSERT:
			diss_line.append(dataArraytoString(data), "insertion");
			break;
		case DIFF_DELETE:
			source_line.append(dataArraytoString(data), "deletion");
			break;
		case DIFF_EQUAL:
			var disstext = dataArraytoString2D(data,1);
			var sourcetext = dataArraytoString2D(data,0);
			if(disstext.length>10){
				var maximumLines = Math.max(source_line.linecount, diss_line.linecount);
				source_line.setLineCountTo(maximumLines);
				diss_line.setLineCountTo(maximumLines);
				source_line.append(sourcetext, "equal");
				diss_line.append(disstext, "equal");
			} else{
				diss_line.append(disstext, "insertion");
				source_line.append(sourcetext, "deletion");
			}

			break;
		}
	}

	return {"diss_html":diss_line.line, "source_html":source_line.line};

};

/**
 * Constructs a HTML representation of the diff with alignment of the equal
 * source and dissertation lines. Linebreaks are set after the specified number
 * of characters, strict, with character wrapping.-
 * @return {Object} aligned dissertation text and source text
*/
DiffHandler.prototype.alligned_texts_strict = function(diffs, maxchars){
	var source_line = new Alignment();
	var diss_line = new Alignment();

	source_line.maxchars = maxchars;
	diss_line.maxchars = maxchars;

	for(var x = 0; x < diffs.length; x++){
		var op = diffs[x][0];
		var data = diffs[x][1];

		switch(op){
			case DIFF_INSERT:
				//diss_line.append(data, "insertion");
				diss_line.appendStrict(data, "insertion");
				break;
			case DIFF_DELETE:
				//source_line.append(data, "deletion");
				source_line.appendStrict(data, "deletion");
				break;
			case DIFF_EQUAL:
				if(data.length>10){
					var maximumLines = Math.max(source_line.linecount, diss_line.linecount);
					source_line.setLineCountTo(maximumLines);
					diss_line.setLineCountTo(maximumLines);
					source_line.appendStrict(data, "equal");
					diss_line.appendStrict(data, "equal");
				} else{
					source_line.appendStrict(data, "deletion");
					diss_line.appendStrict(data, "insertion");
				}

				break;
		}
	}

	return {"diss_html":diss_line.line, "source_html":source_line.line};
};

jQuery.extend(diff_match_patch.prototype, {
  normalize_word : function(word){
    //normalises wikipedia references like "wikipedia[12]" => "wikipedia"
    var openingSquareBracket = /\[(\w+|[a-z]+)\]$/gi;

    //filters all non-alphanumeric characters
    var alphanumericRegExp = /\W/gi;

    var normalized_word = word.toLowerCase();
    normalized_word = normalized_word.replace(openingSquareBracket, '').replace(alphanumericRegExp, '');
    return word;
  },

  /**
   * Transforms a given array of words into a character string. Each desinct
   * word is encoded as the same character.
  */
  words_to_characters : function(textarr){
    var textchars = "";

    for(var i in textarr){
      var word = textarr[i];
      var normalized_word = this.normalize_word(word);
      var character;
      if(this.word_dict.hasOwnProperty(normalized_word)){
        character = this.word_dict[normalized_word];
        textchars += character;
        if(this.char_dict[character].length !== (this.textnumber + 1)) {
          this.char_dict[character].push([]);
        }
        var wordlist = this.char_dict[character][this.textnumber];
        wordlist.push(word);
        continue;
      }

      character = String.fromCharCode(this.charcode);
      this.word_dict[normalized_word] = character;
      this.char_dict[character] = [];
      this.char_dict[character].push([]);
      this.char_dict[character][this.textnumber] = [word];
      this.charcode += 1;
      textchars += character;
    }

    this.textnumber += 1;

    return textchars;
  },
  split_text : function(text){
    text = text.replace(/\r|\n/g, ' ').replace(/\s+/g, ' ').trim();
    if(text.length === 0) { return []; }
    return text.split(/\s/g);
  },
  /**
   * Computes the diff on wordbase. This is an extention of the character based
   * diff computation of the google_diff_match_patch framework.
   * @return {Array} word based diff consisting of arrays, in which the first
   * element represents the operation (-1: DIFF_DELETE, 1: DIFF_INSERT,
   * 0:DIFF_EQUAL) and the second element the text of that was applied by this
   * operation.
  */
  diff_wordbased : function(text1, text2, lebool){
    var textarr1 = this.split_text(text1);
    var textarr2 = this.split_text(text2);
    this.word_dict = {};
    this.charcode = 21;
    this.textnumber = 0;

    this.char_dict= {};
    var textchars1 = this.words_to_characters(textarr1);
    var textchars2 = this.words_to_characters(textarr2);

    var diffs = this.diff_main(textchars1, textchars2, lebool);
    var result = [];
    for(var x = 0; x < diffs.length; x++){
      var op = diffs[x][0];
      var data = diffs[x][1];
      var encodedstring = [];
      var datarr = data.split("");
      for(var i in datarr){
        var character = datarr[i];
        var character_entry = this.char_dict[character];
        var nextword = [];
        switch(op){
          case DIFF_DELETE:
            nextword = character_entry[0][0];
            character_entry[0].splice(0,1);
            break;
          case DIFF_INSERT:
            nextword = character_entry[1][0];
            character_entry[1].splice(0,1);
            break;
          case DIFF_EQUAL:
            nextword.push(character_entry[0][0]);
            nextword.push(character_entry[1][0]);
            character_entry[0].splice(0,1);
            character_entry[1].splice(0,1);
        }
        encodedstring.push(nextword);
        i += 1;
      }
      result.push([op,encodedstring]);
    }

    return result;
  }
});



;(function ( $ ) {
  /**
   * @class Represents a single reference.
   */
  var CompareData =  function(referenceData, options){
    /* global DiffHandler */
    this.dmp =  new DiffHandler();
    this.dmp.Diff_Timeout = options ? options.timeout || 0 : 0;

    for(var key in referenceData){
      this[key] = referenceData[key];
    }
  };

  CompareData.prototype = {
    /**
     * Wordbased diff with
     * @return {Array}  EXPLAIN_PROTOCOL
     */
    getDiff :function(){
      //lazy loading diffs
      if(!this.diff){
        var left = this.left;
        var right = this.right;
        this.diff = this.dmp.diff_wordbased(left, right,false);
        //dmp.diff_cleanupSemantic(this.diff);
      }
      return this.diff;
    },
    /**
     * Diff as aligned html
     * @param  {Number} maxchars Max line length
     * @return {String}
     */
    getHtmlTexts : function(maxchars){
      var diff = this.getDiff();
      return this.dmp.alligned_texts(diff, maxchars);
    },
    /**
     * Diff as strict aligned html
     * @param  {Number} maxchars line length
     * @return {String}
     */
    getHtmlTextStrict : function(maxchars){
      var diff = this.getDiff();
      return this.dmp.alligned_texts_strict(diff, maxchars);

    }
  };

  /*
   * Plugin functions
   */
	$.fn.picadiff = function(options){
		//check if WebFont API is present
		if(window['WebFont'] !== undefined) {
			/* global WebFont */
			WebFont.load({google: {families: ['Source Code Pro']}});
		}
		return this.each(function(){
			var $this = $(this).addClass('picadiff');

      var settings = {
        leftContainer     : '.left',
        rightContainer    : '.right',
        titleContainer    : '.picadiff-title',
        contentContainer  : '.picadiff-content',
        lineLength        : 40,
        wrap              : false


      };
      // If options exist, lets merge them
      // with our default settings
      if ( options ) {
        $.extend( settings, options );
      }

      var referenceData = {
        leftTitle : settings.leftTitle  || $this.find(settings.titleContainer+' '+settings.leftContainer).text(),
        left    : settings.leftContent  || $this.find(settings.contentContainer+' '+settings.leftContainer).text(),
        rightTitle  : settings.rightTitle || $this.find(settings.titleContainer+' '+settings.rightContainer).text(),
        right   : settings.rightContent || $this.find(settings.contentContainer+' '+settings.rightContainer).text()
      };

      var compareData = new CompareData(referenceData, settings);

      var lineLength = settings.lineLength;
      var html_texts = settings.wrap ? compareData.getHtmlTextStrict(lineLength) :
        compareData.getHtmlTexts(lineLength);

      var left = html_texts.source_html;
      var right = html_texts.diss_html;

      $(settings.contentContainer+" "+settings.leftContainer).html(left);
      $(settings.contentContainer+" "+settings.rightContainer).html(right);
      $(settings.titleContainer+" "+settings.leftContainer).html(compareData.leftTitle);
      $(settings.titleContainer+" "+settings.rightContainer).html(compareData.rightTitle);
    });
  };

})( jQuery );
