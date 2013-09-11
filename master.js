var IO = window.IO = {
	//event handling
	events : {},
	preventDefault : false,

	//register for an event
	register : function ( name, fun, thisArg ) {
		if ( !this.events[name] ) {
			this.events[ name ] = [];
		}
		this.events[ name ].push({
			fun : fun,
			thisArg : thisArg,
			args : Array.prototype.slice.call( arguments, 3 )
		});

		return this;
	},

	unregister : function ( name, fun ) {
		if ( !this.events[name] ) {
			return this;
		}

		this.events[ name ] = this.events[ name ].filter(function ( obj ) {
			return obj.fun !== fun;
		});

		return this;
	},

	//fire event!
	fire : function ( name ) {
		this.preventDefault = false;

		if ( !this.events[name] ) {
			return;
		}

		var args = Array.prototype.slice.call( arguments, 1 ),
			that = this;
		this.events[ name ].forEach( fireEvent );

		function fireEvent( evt ) {
			var call = evt.fun.apply( evt.thisArg, evt.args.concat(args) );

			that.preventDefault = call === false;
		}
	},

	urlstringify : (function () {
		//simple types, for which toString does the job
		//used in singularStringify
		var simplies = { number : true, string : true, boolean : true };

		var singularStringify = function ( thing ) {
			if ( typeof thing in simplies ) {
				return encodeURIComponent( thing.toString() );
			}
			return '';
		};

		var arrayStringify = function ( key, array ) {
			key = singularStringify( key );

			return array.map(function ( val ) {
				return pair( key, val, true );
			}).join( '&' );
		};

		//returns a key=value pair. pass in dontStringifyKey so that, well, the
		// key won't be stringified (used in arrayStringify)
		var pair = function ( key, val, dontStringifyKey ) {
			if ( !dontStringifyKey ) {
				key = singularStringify( key );
			}

			return key + '=' + singularStringify( val );
		};

		return function ( obj ) {

			return Object.keys( obj ).map(function ( key ) {
				var val = obj[ key ];

				if ( Array.isArray(val) ) {
					return arrayStringify( key, val );
				}
				else {
					return pair( key, val );
				}
			}).join( '&' );
		};
	}()),

	loadScript : function ( url, cb ) {
		var script = document.createElement( 'script' );
		script.src = url;
		script.onload = cb;

		document.head.appendChild( script );
	}
};

IO.decodehtmlEntities = (function (){
var entities; //will be filled in the following line
entities = {"quot":"\"","amp":"&","apos":"'","lt":"<","gt":">","nbsp":" ","iexcl":"¡","cent":"¢","pound":"£","curren":"¤","yen":"¥","brvbar":"¦","sect":"§","uml":"¨","copy":"©","ordf":"ª","laquo":"«","not":"¬","reg":"®","macr":"¯","deg":"°","plusmn":"±","sup2":"²","sup3":"³","acute":"´","micro":"µ","para":"¶","middot":"·","cedil":"¸","sup1":"¹","ordm":"º","raquo":"»","frac14":"¼","frac12":"½","frac34":"¾","iquest":"¿","Agrave":"À","Aacute":"Á","Acirc":"Â","Atilde":"Ã","Auml":"Ä","Aring":"Å","AElig":"Æ","Ccedil":"Ç","Egrave":"È","Eacute":"É","Ecirc":"Ê","Euml":"Ë","Igrave":"Ì","Iacute":"Í","Icirc":"Î","Iuml":"Ï","ETH":"Ð","Ntilde":"Ñ","Ograve":"Ò","Oacute":"Ó","Ocirc":"Ô","Otilde":"Õ","Ouml":"Ö","times":"×","Oslash":"Ø","Ugrave":"Ù","Uacute":"Ú","Ucirc":"Û","Uuml":"Ü","Yacute":"Ý","THORN":"Þ","szlig":"ß","agrave":"à","aacute":"á","acirc":"â","atilde":"ã","auml":"ä","aring":"å","aelig":"æ","ccedil":"ç","egrave":"è","eacute":"é","ecirc":"ê","euml":"ë","igrave":"ì","iacute":"í","icirc":"î","iuml":"ï","eth":"ð","ntilde":"ñ","ograve":"ò","oacute":"ó","ocirc":"ô","otilde":"õ","ouml":"ö","divide":"÷","oslash":"ø","ugrave":"ù","uacute":"ú","ucirc":"û","uuml":"ü","yacute":"ý","thorn":"þ","yuml":"ÿ","OElig":"Œ","oelig":"œ","Scaron":"Š","scaron":"š","Yuml":"Ÿ","fnof":"ƒ","circ":"ˆ","tilde":"˜","Alpha":"Α","Beta":"Β","Gamma":"Γ","Delta":"Δ","Epsilon":"Ε","Zeta":"Ζ","Eta":"Η","Theta":"Θ","Iota":"Ι","Kappa":"Κ","Lambda":"Λ","Mu":"Μ","Nu":"Ν","Xi":"Ξ","Omicron":"Ο","Pi":"Π","Rho":"Ρ","Sigma":"Σ","Tau":"Τ","Upsilon":"Υ","Phi":"Φ","Chi":"Χ","Psi":"Ψ","Omega":"Ω","alpha":"α","beta":"β","gamma":"γ","delta":"δ","epsilon":"ε","zeta":"ζ","eta":"η","theta":"θ","iota":"ι","kappa":"κ","lambda":"λ","mu":"μ","nu":"ν","xi":"ξ","omicron":"ο","pi":"π","rho":"ρ","sigmaf":"ς","sigma":"σ","tau":"τ","upsilon":"υ","phi":"φ","chi":"χ","psi":"ψ","omega":"ω","thetasym":"ϑ","upsih":"ϒ","piv":"ϖ","ensp":" ","emsp":" ","thinsp":" ","ndash":"–","mdash":"—","lsquo":"‘","rsquo":"’","sbquo":"‚","ldquo":"“","rdquo":"”","bdquo":"„","dagger":"†","Dagger":"‡","bull":"•","hellip":"…","permil":"‰","prime":"′","Prime":"″","lsaquo":"‹","rsaquo":"›","oline":"‾","frasl":"⁄","euro":"€","image":"ℑ","weierp":"℘","real":"ℜ","trade":"™","alefsym":"ℵ","larr":"←","uarr":"↑","rarr":"→","darr":"↓","harr":"↔","crarr":"↵","lArr":"⇐","uArr":"⇑","rArr":"⇒","dArr":"⇓","hArr":"⇔","forall":"∀","part":"∂","exist":"∃","empty":"∅","nabla":"∇","isin":"∈","notin":"∉","ni":"∋","prod":"∏","sum":"∑","minus":"−","lowast":"∗","radic":"√","prop":"∝","infin":"∞","ang":"∠","and":"∧","or":"∨","cap":"∩","cup":"∪","int":"∫","there4":"∴","sim":"∼","cong":"≅","asymp":"≈","ne":"≠","equiv":"≡","le":"≤","ge":"≥","sub":"⊂","sup":"⊃","nsub":"⊄","sube":"⊆","supe":"⊇","oplus":"⊕","otimes":"⊗","perp":"⊥","sdot":"⋅","lceil":"⌈","rceil":"⌉","lfloor":"⌊","rfloor":"⌋","lang":"〈","rang":"〉","loz":"◊","spades":"♠","clubs":"♣","hearts":"♥","diams":"♦", "zwnj":""};


/*
  &       -all entities start with &
  (
   #      -charcode entities also have a #
   x?     -hex charcodes
  )?
  [\w;]   -now the entity (alphanumeric, separated by ;)
  +?      -capture em until there aint no more (don't get the trailing ;)
  ;       -trailing ;
*/
var entityRegex = /&(#x?)?[\w;]+?;/g;
var replaceEntities = function ( entities ) {
	//remove the & and split into each separate entity
	return entities.slice( 1 ).split( ';' ).map( decodeEntity ).join( '' );
};
var decodeEntity = function ( entity ) {
	if ( !entity ) {
		return '';
	}

	//starts with a #, it's charcode
	if ( entity[0] === '#' ) {
		return decodeCharcodeEntity( entity );
	}

	if ( !entities.hasOwnProperty(entity) ) {
		//I hate this so. so. so much. it's just wrong.
		return '&' + entity +';';
	}
	return entities[ entity ];
};
var decodeCharcodeEntity = function ( entity ) {
	//remove the # prefix
	entity = entity.slice( 1 );

	var cc;
	//hex entities
	if ( entity[0] === 'x' ) {
		cc = parseInt( entity.slice(1), 16 );
	}
	//decimal entities
	else {
		cc = parseInt( entity, 10 );
	}

	return String.fromCharCode( cc );
};

return function ( html ) {
	return html.replace( entityRegex, replaceEntities );
};
}());

//build IO.in and IO.out
[ 'in', 'out' ].forEach(function ( dir ) {
	var fullName = dir + 'put';

	IO[ dir ] = {
		buffer : [],

		receive : function ( obj ) {
			IO.fire( 'receive' + fullName, obj );

			if ( IO.preventDefault ) {
				return this;
			}

			this.buffer.push( obj );

			return this;
		},

		//unload the next item in the buffer
		tick : function () {
			if ( this.buffer.length ) {
				IO.fire( fullName, this.buffer.shift() );
			}

			return this;
		},

		//unload everything in the buffer
		flush : function () {
			IO.fire( 'before' + fullName );

			if ( !this.buffer.length ) {
				return this;
			}

			var i = this.buffer.length;
			while( i --> 0 ) {
				this.tick();
			}

			IO.fire( 'after' + fullName );

			this.buffer = [];
			return this;
		}
	};
});

//a very incomplete circular-buffer implementation, used for the bored responses
IO.CBuffer = function ( size ) {
	var ret = {
		items : [],
		pos : 0,
		size : size
	};

	ret.add = function ( item ) {
		if ( this.pos === size ) {
			this.pos = 0;
		}

		this.items[ this.pos ] = item;
		this.pos += 1;
	};
	ret.contains = function ( item ) {
		return this.items.indexOf( item ) > -1;
	};

	return ret;
};

IO.relativeUrlToAbsolute = function ( url ) {
	//the anchor's href *property* will always be absolute, unlike the href
	// *attribute*
	var a = document.createElement( 'a' );
	a.setAttribute( 'href', url );

	return a.href;
};

IO.injectScript = function ( url ) {
	var script = document.createElement( 'script' );
	script.src = url;

	document.head.appendChild( script );
	return script;
};

IO.xhr = function ( params ) {
	//merge in the defaults
	params = Object.merge({
		method   : 'GET',
		headers  : {},
		complete : function (){}
	}, params );

	params.headers = Object.merge({
		'Content-Type' : 'application/x-www-form-urlencoded'
	}, params.headers );

	//if the data is an object, and not a fakey String object, dress it up
	if ( typeof params.data === 'object' && !params.data.charAt ) {
		params.data = IO.urlstringify( params.data );
	}

	var xhr = new XMLHttpRequest();
	xhr.open( params.method, params.url );

	xhr.addEventListener( 'readystatechange', function () {
		if ( xhr.readyState === 4 ) {
			params.complete.call(
				params.thisArg, xhr.responseText, xhr
			);
		}
	});

	Object.iterate( params.headers, function ( header, value ) {
		xhr.setRequestHeader( header, value );
	});

	xhr.send( params.data );

	return xhr;
};

IO.jsonp = function ( opts ) {
	opts.data = opts.data || {};
	opts.jsonpName = opts.jsonpName || 'jsonp';

	var script = document.createElement( 'script' ),
		semiRandom;

	do {
		semiRandom = 'IO' + ( Date.now() * Math.ceil(Math.random()) );
	} while ( window[semiRandom] );

	//this is the callback function, called from the "jsonp file"
	window[ semiRandom ] = function () {
		opts.fun.apply( opts.thisArg, arguments );

		//cleanup
		delete window[ semiRandom ];
		script.parentNode.removeChild( script );
	};

	//add the jsonp parameter to the data we're sending
	opts.data[ opts.jsonpName ] = semiRandom;

	//start preparing the url to be sent
	if ( opts.url.indexOf('?') === -1 ) {
		opts.url += '?';
	}

	//append the data to be sent, in string form, to the url
	opts.url += '&' + this.urlstringify( opts.data );

	script.onerror = opts.error;

	script.src = opts.url;
	document.head.appendChild( script );
};

//generic, pre-made call to be used inside commands
IO.jsonp.google = function ( query, cb ) {
	IO.jsonp({
		url : 'http://ajax.googleapis.com/ajax/services/search/web',
		jsonpName : 'callback',
		data : {
			v : '1.0',
			q : query
		},
		fun : cb
	});
};

;
//345678901234567890123456789012345678901234567890123456789012345678901234567890
//small utility functions
Object.merge = function () {
	return [].reduce.call( arguments, function ( ret, merger ) {

		Object.keys( merger ).forEach(function ( key ) {
			ret[ key ] = merger[ key ];
		});

		return ret;
	}, {} );
};

Object.iterate = function ( obj, cb, thisArg ) {
	Object.keys( obj ).forEach(function (key) {
		cb.call( thisArg, key, obj[key], obj );
	});
};

Object.TruthMap = function ( props ) {
	return ( props || [] ).reduce( assignTrue, Object.create(null) );

	function assignTrue ( ret, key ) {
		ret[ key ] = true;
		return ret;
	}
};

//SO chat uses an unfiltered for...in to iterate over an array somewhere, so
// that I have to use Object.defineProperty to make these non-enumerable
Object.defineProperty( Array.prototype, 'invoke', {
	value : function ( funName ) {
		var args = [].slice.call( arguments, 1 );

		return this.map( invoke );

		function invoke ( item, index ) {
			var res = item;

			if ( item[funName] && item[funName].apply ) {
				res = item[ funName ].apply( item, args );
			}

			return res;
		}
	},

	configurable : true,
	writable : true
});

//fuck you readability
//left this comment as company for future viewers with their new riddle
Object.defineProperty( Array.prototype, 'first', {
	value : function ( fun ) {
		return this.some(function ( item ) {
			return fun.apply( null, arguments ) && ( (fun = item) || true );
		}) ? fun : null;
	},

	configurable : true,
	writable : true
});

Object.defineProperty( Array.prototype, 'random', {
	value : function () {
		return this[ Math.floor(Math.random() * this.length) ];
	},

	configurable : true,
	writable : true
});

//define generic array methods on Array, like FF does
[ 'forEach', 'map', 'filter', 'reduce' ].forEach(function ( name ) {
	var fun = [][ name ]; //teehee
	Array[ name ] = function () {
		return fun.call.apply( fun, arguments );
	};
});

String.prototype.indexesOf = function ( str, fromIndex ) {
	//since we also use index to tell indexOf from where to begin, and since
	// telling it to begin from where it found the match will cause it to just
	// match it again and again, inside the indexOf we do `index + 1`
	// to compensate for that 1, we need to subtract 1 from the original
	// starting position
	var index = ( fromIndex || 0 ) - 1,
		ret = [];

	while ( (index = this.indexOf(str, index + 1)) > -1 ) {
		ret.push( index );
	}

	return ret;
};

//Crockford's supplant
String.prototype.supplant = function ( arg ) {
	//if it's an object, use that. otherwise, use the arguments list.
	var obj = (
		Object(arg) === arg ?
			arg : arguments );
	return this.replace( /\{([^\}]+)\}/g, replace );

	function replace ( $0, $1 ) {
		return obj.hasOwnProperty( $1 ) ?
			obj[ $1 ] :
			$0;
	}
};

String.prototype.startsWith = function ( str ) {
	return this.indexOf( str ) === 0;
};

Function.prototype.throttle = function ( time ) {
	var fun = this, timeout = -1;

	var ret = function () {
		clearTimeout( timeout );

		var context = this, args = arguments;
		timeout = setTimeout(function () {
			fun.apply( context, args );
		}, time );
	};

	return ret;
};

Function.prototype.memoize = function () {
	var cache = Object.create( null ), fun = this;

	return function memoized ( hash ) {
		if ( hash in cache ) {
			return cache[ hash ];
		}

		var res = fun.apply( null, arguments );

		cache[ hash ] = res;
		return res;
	};
};

//async memoizer
Function.prototype.memoizeAsync = function ( hasher ) {
	var cache = Object.create( null ), fun = this;

	hasher = hasher || function (x) { return x; };

	return function memoized () {
		var args = [].slice.call( arguments ),
			cb = args.pop(), //HEAVY assumption that cb is always passed last
			hash = hasher.apply( null, arguments );

		if ( hash in cache ) {
			cb.apply( null, cache[hash] );
			return;
		}

		//push the callback to the to-be-passed arguments
		args.push( resultFun );
		fun.apply( this, args );

		function resultFun () {
			cache[ hash ] = arguments;
			cb.apply( null, arguments );
		}
	};
};

//returns the number with at most `places` digits after the dot
//examples:
// 1.337.maxDecimal(1) === 1.3
//
//steps:
// floor(1.337 * 10e0) = 13
// 13 / 10e0 = 1.3
Number.prototype.maxDecimal = function ( places ) {
	var exponent = Math.pow( 10, places );

	return Math.floor( this * exponent ) / exponent;
};

//receives an (ordered) array of numbers, denoting ranges, returns the first
// range it falls between. I suck at explaining, so:
// 4..fallsAfter( [1, 2, 5] )  === 2
// 4..fallsAfter( [0, 3] ) === 3
Number.prototype.fallsAfter = function ( ranges ) {
	ranges = ranges.slice();
	var min = ranges.shift(), max,
		n = this.valueOf();

	for ( var i = 0, l = ranges.length; i < l; i++ ) {
		max = ranges[ i ];

		if ( n < max ) {
			break;
		}
		min = max;
	}

	return min <= n ? min : null;
};

//calculates a:b to string form
Math.ratio = function ( a, b ) {
    a = Number( a );
    b = Number( b );

    var gcd = this.gcd( a, b );
    return ( a / gcd ) + ':' + ( b / gcd );
};

//Euclidean gcd
Math.gcd = function ( a, b ) {
    if ( !b ) {
        return a;
    }
    return this.gcd( b, a % b );
};

Math.rand = function ( min, max ) {
	//rand() === rand( 0, 9 )
	if ( !min ) {
		min = 0;
		max = 9;
	}

	//rand( max ) === rand( 0, max )
	else if ( !max ) {
		max = min;
		min = 0;
	}

	return Math.floor( Math.random() * (max - min + 1) ) + min;
};

//I got annoyed that RegExps don't automagically turn into correct shit when
// JSON-ing them. so HERE.
Object.defineProperty( RegExp.prototype, 'toJSON', {
	value : function () {
		return this.toString();
	},
	configurable : true,
	writable : true
});

//takes a string and escapes any special regexp characters
RegExp.escape = function ( str ) {
	//do I smell irony?
	return str.replace( /[-^$\\\/\.*+?()[\]{}|]/g, '\\$&' );
	//using a character class to get away with escaping some things. the - in
	// the beginning doesn't denote a range because it only denotes one when
	// it's in the middle of a class, and the ^ doesn't mean negation because
	// it's not in the beginning of the class
};

//not the most efficient thing, but who cares. formats the difference between
// two dates
Date.timeSince = function ( d0, d1 ) {
	d1 = d1 || (new Date);

	var ms = d1 - d0,
		delay;

	var delays = [
		{
			delta : 3.1536e+10,
			suffix : 'year'
		},
		{
			delta : 2.592e+9,
			suffix : 'month'
		},
		{
			delta : 8.64e+7,
			suffix : 'day'
		},
		{
			delta : 3.6e+6,
			suffix : 'hour'
		},
		{
			delta : 6e+4,
			suffix : 'minute'
		},
		{
			delta : 1000,
			suffix : 'second'
		}
		//anything else is ms
	];

	while ( delay = delays.shift() ) {
		if ( ms >= delay.delta ) {
			return format( ms / delay.delta, delay.suffix );
		}
	}
	return format( ms, 'millisecond' );

	function format ( interval, suffix ) {
		interval = Math.floor( interval );
		suffix += interval === 1 ? '' : 's';

		return interval + ' ' + suffix;
	}
};

;
(function () {
"use strict";

var bot = window.bot = {
	invocationPattern : '',

	commands : {}, //will be filled as needed
	commandDictionary : null, //it's null at this point, won't be for long
	listeners : [],
	info : {
		invoked   : 0,
		learned   : 0,
		forgotten : 0,
		start     : new Date
	},
	users : {}, //will be filled in build

	parseMessage : function ( msgObj ) {
		if ( !this.validateMessage(msgObj) ) {
			bot.log( msgObj, 'parseMessage invalid' );
			return;
		}

		var msg = this.prepareMessage( msgObj ),
			id = msg.get( 'user_id' );
		bot.log( msg, 'parseMessage valid' );

		if ( this.banlist.contains(id) ) {
			bot.log( msgObj, 'parseMessage banned' );

			//tell the user he's banned only if he hasn't already been told
			if ( !this.banlist[id].told ) {
				msg.reply( 'You iz in mindjail' );
				this.banlist[ id ].told = true;
			}
			return;
		}

		try {
			//it wants to execute some code
			if ( /^c?>/.test(msg) ) {
				this.eval( msg );
			}
			else {
				this.invokeAction( msg );
			}
		}
		catch ( e ) {
			var err = 'Could not process input. Error: ' + e.message;

			if ( e.lineNumber ) {
				err += ' on line ' + e.lineNumber;
			}
			//column isn't part of ordinary errors, it's set in custom ones
			if ( e.column ) {
				err += ' on column ' + e.column;
			}

			msg.directreply( err );
			//make sure we have it somewhere
			console.error( e.stack );
		}
		finally {
			this.info.invoked += 1;
		}
	},

	//this conditionally calls execCommand or callListeners, depending on what
	// the input. if the input begins with a command name, it's assumed to be a
	// command. otherwise, it tries matching against the listener.
	invokeAction : function ( msg ) {
		var possibleName = msg.trim().replace( /^\/\s*/, '' ).split( ' ' )[ 0 ],
			cmd = this.getCommand( possibleName ),

			//this is the best name I could come up with
			//messages beginning with / want to specifically invoke a command
			coolnessFlag = msg.startsWith('/') ? !cmd.error : true;

		if ( !cmd.error ) {
			this.execCommand( cmd, msg );
		}
		else if ( coolnessFlag ) {
			coolnessFlag = this.callListeners( msg );
		}

		//nothing to see here, move along
		if ( coolnessFlag ) {
			return;
		}

		msg.reply( this.giveUpMessage(cmd.guesses) );
	},

	giveUpMessage : function ( guesses ) {
		//man, I can't believe it worked...room full of nachos for me
		var errMsg = 'That didn\'t make much sense.';
		if ( guesses && guesses.length ) {
			errMsg += ' Maybe you meant: ' + guesses.join( ', ' );
		}
		//mmmm....nachos
		else {
			errMsg += ' Use the help command to learn more.';
		}
		//wait a minute, these aren't nachos. these are bear cubs.
		return errMsg;
		//good mama bear...nice mama bear...tasty mama be---
	},

	execCommand : function ( cmd, msg ) {
		bot.log( cmd, 'execCommand calling' );

		if ( !cmd.canUse(msg.get('user_id')) ) {
			msg.reply([
				'You do not have permission to use the command ' + cmd.name,
				"I'm afraid I can't let you do that, " + msg.get('user_name')
			].random());
			return;
		}

		var args = this.Message(
				msg.replace( /^\/\s*/, '' ).slice( cmd.name.length ).trim(),
				msg.get()
			),
			//it always amazed me how, in dynamic systems, the trigger of the
			// actions is always a small, nearly unidentifiable line
			//this line right here activates a command
			res = cmd.exec( args );

		if ( res ) {
			msg.reply( res );
		}
	},

	prepareMessage : function ( msgObj ) {
		msgObj = this.adapter.transform( msgObj );

		var msg = IO.decodehtmlEntities( msgObj.content );
		return this.Message(
			msg.slice( this.invocationPattern.length ).trim(),
			msgObj );
	},

	validateMessage : function ( msgObj ) {
		var msg = msgObj.content.trim();

		return (
			//make sure we don't process our own messages,
			msgObj.user_id !== bot.adapter.user_id &&
			//and the message begins with the invocationPattern
			msg.startsWith( this.invocationPattern ) );
	},

	addCommand : function ( cmd ) {
		if ( !cmd.exec || !cmd.del ) {
			cmd = this.Command( cmd );
		}
		if ( cmd.learned ) {
			this.info.learned += 1;
		}
		cmd.invoked = 0;

		this.commands[ cmd.name ] = cmd;
		this.commandDictionary.trie.add( cmd.name );
	},

	//gee, I wonder what this will return?
	commandExists : function ( cmdName ) {
		return this.commands.hasOwnProperty( cmdName );
	},

	//if a command named cmdName exists, it returns that command object
	//otherwise, it returns an object with an error message property
	getCommand : function ( cmdName ) {
		var lowerName = cmdName.toLowerCase();

		if ( this.commandExists(lowerName) ) {
			return this.commands[ lowerName ];
		}

		//not found, onto error reporting
		//set the error margin according to the length
		this.commandDictionary.maxCost = Math.floor( cmdName.length / 5 + 1 );

		var msg = 'Command ' + cmdName + ' does not exist.',
		//find commands resembling the one the user entered
		guesses = this.commandDictionary.search( cmdName );

		//resembling command(s) found, add them to the error message
		if ( guesses.length ) {
			msg += ' Did you mean: ' + guesses.join( ', ' );
		}

		return { error : msg, guesses : guesses };
	},

	//the function women think is lacking in men
	listen : function ( regex, fun, thisArg ) {
		if ( Array.isArray(regex) ) {
			regex.forEach(function ( reg ) {
				this.listen( reg, fun, thisArg );
			}, this);
		}
		else {
			this.listeners.push({
				pattern : regex,
				fun : fun,
				thisArg: thisArg
			});
		}
	},

	callListeners : function ( msg ) {
		return this.listeners.some(function callListener ( listener ) {
			var match = msg.exec( listener.pattern ), resp;

			if ( match ) {
				resp = listener.fun.call( listener.thisArg, msg );

				bot.log( match, resp );
				if ( resp ) {
					msg.reply( resp );
				}
				return resp !== false;
			}
		});
	},

	stoplog : false,
	log : function () {
		if ( !this.stoplog ) {
			console.log.apply( console, arguments );
		}
	},

	stop : function () {
		this.stopped = true;
	},
	continue : function () {
		this.stopped = false;
	},

    devMode : false,
    activateDevMode : function ( pattern ) {
        this.devMode = true;
        this.invocationPattern = pattern || 'beer!';
        IO.events.userjoin.length = 0;
        this.validateMessage = function ( msgObj ) {
            return msgObj.content.trim().startsWith( this.invocationPattern );
        };
    }
};

//a place to hang your coat and remember the past. provides an abstraction over
// localStorage or whatever data-storage will be used in the future.
bot.memory = {
	saveInterval : 900000, //15(min) * 60(sec/min) * 1000(ms/sec) = 900000(ms)

	data : {},

	get : function ( name, defaultVal ) {
		if ( !this.data[name] ) {
			this.set( name, defaultVal || {} );
		}

		return this.data[ name ];
	},

	set : function ( name, val ) {
		this.data[ name ] = val;
	},

	loadAll : function () {
		var self = this;

		Object.iterate( localStorage, function ( key, val ) {
			if ( key.startsWith('bot_') ) {
				console.log( key, val );
				self.set( key.replace(/^bot_/, ''), JSON.parse(val) );
			}
		});
	},

	save : function ( name ) {
		if ( name ) {
			localStorage[ 'bot_' + name ] = JSON.stringify( this.data[name] );
			return;
		}

		var self = this;
		Object.keys( this.data ).forEach(function ( name ) {
			self.save( name );
		});

		this.saveLoop();
	},

	saveLoop : function () {
		clearTimeout( this.saveIntervalId );
		setTimeout( this.saveLoop.bind(this), this.saveInterval );
	}
};

bot.memory.loadAll();
window.addEventListener( 'beforeunload', function () { bot.memory.save(); } );
bot.memory.saveLoop();

bot.banlist = bot.memory.get( 'ban' );
bot.banlist.contains = function ( id ) {
	return this.hasOwnProperty( id );
};
bot.banlist.add = function ( id ) {
	this[ id ] = { told : false };
	bot.memory.save( 'ban' );
};
bot.banlist.remove = function ( id ) {
	if ( this.contains(id) ) {
		delete this[ id ];
	}
};

//some sort of pseudo constructor
bot.Command = function ( cmd ) {
	cmd.name = cmd.name.toLowerCase();

	cmd.permissions = cmd.permissions || {};
	cmd.permissions.use = cmd.permissions.use || 'ALL';
	cmd.permissions.del = cmd.permissions.del || 'NONE';

	cmd.description = cmd.description || '';
	cmd.creator = cmd.creator || 'God';
	cmd.invoked = 0;

	//make canUse and canDel
	[ 'Use', 'Del' ].forEach(function ( perm ) {
		var low = perm.toLowerCase();
		cmd[ 'can' + perm ] = function ( usrid ) {
			var canDo = this.permissions[ low ];

			if ( canDo === 'ALL' ) {
				return true;
			}
			else if ( canDo === 'NONE' ) {
				return false;
			}
			else if ( canDo === 'OWNER' ) {
				return bot.isOwner( usrid );
			}
			return canDo.indexOf( usrid ) > -1;
		};
	});

	cmd.exec = function () {
		this.invoked += 1;
		return this.fun.apply( this.thisArg, arguments );
	};

	cmd.del = function () {
		bot.info.forgotten += 1;
		delete bot.commands[ cmd.name ];
	};

	return cmd;
};
//a normally priviliged command which can be executed if enough people use it
bot.CommunityCommand = function ( command, req ) {
	var cmd = this.Command( command ),
		used = {},
		old_execute = cmd.exec,
		old_canUse  = cmd.canUse;
	req = req || 2;

	cmd.canUse = function () {
		return true;
	};
	cmd.exec = function ( msg ) {
		var err = register( msg.get('user_id') );
		if ( err ) {
			bot.log( err );
			return err;
		}
		return old_execute.apply( cmd, arguments );
	};
	return cmd;

	//once again, a switched return statement: truthy means a message, falsy
	// means to go on ahead
	function register ( usrid ) {
		if ( old_canUse.call(cmd, usrid) ) {
			return false;
		}

		clean();
		var count = Object.keys( used ).length,
			needed = req - count - 1; //0 based indexing vs. 1 based humans
		bot.log( used, count, req );

		if ( usrid in used ) {
			return 'Already registered; still need {0} more'.supplant( needed );
		}
		else if ( needed > 0 ) {
			used[ usrid ] = new Date;
			return 'Registered; need {0} more to execute'.supplant( needed-1 );
		}
		bot.log( 'should execute' );
		return false; //huzzah!
	}

	function clean () {
		var tenMinsAgo = new Date;
		tenMinsAgo.setMinutes( tenMinsAgo.getMinutes() - 10 );

		Object.keys( used ).reduce( rm, used );
		function rm ( ret, key ) {
			if ( ret[key] < tenMinsAgo ) {
				delete ret[ key ];
			}
			return ret;
		}
	}
};

bot.Message = function ( text, msgObj ) {
	//"casting" to object so that it can be extended with cool stuff and
	// still be treated like a string
	var ret = Object( text );
	ret.content = text;

	var rawSend = function ( text ) {
		bot.adapter.out.add( text, msgObj.room_id );
	};
	var deliciousObject = {
		send : rawSend,

		reply : function ( resp, user_name ) {
			var prefix = bot.adapter.reply( user_name || msgObj.user_name );
			rawSend( prefix + ' ' + resp );
		},
		directreply : function ( resp ) {
			var prefix = bot.adapter.directreply( msgObj.message_id );
			rawSend( prefix + ' ' + resp );
		},

		//parse() parses the original message
		//parse( true ) also turns every match result to a Message
		//parse( msgToParse ) parses msgToParse
		//parse( msgToParse, true ) combination of the above
		parse : function ( msg, map ) {
			if ( !!msg === msg ) {
				map = msg;
				msg = text;
			}
			var parsed = bot.parseCommandArgs( msg || text );

			if ( !map ) {
				return parsed;
			}

			return parsed.map(function ( part ) {
				return bot.Message( part, msgObj );
			});
		},

		//execute a regexp against the text, saving it inside the object
		exec : function ( regexp ) {
			var match = regexp.exec( text );
			this.matches = match ? match : [];

			return match;
		},

		findUserid : function ( username ) {
			username = username.toLowerCase().replace( /\s/g, '' );
			var ids = Object.keys( bot.users );

			return ids.first(function ( id ) {
				var name = bot.users[ id ].name
					.toLowerCase().replace( /\s/g, '' );

				return name === username;
			}) || -1;
		}.memoize(),

		findUsername : (function () {
			var cache = {};

			return function ( id, cb ) {
				if ( cache[id] ) {
					finish( cache[id] );
				}
				else if ( bot.users[id] ) {
					finish( bot.users[id].name );
				}
				else {
					bot.users.request( bot.adapter.roomid, id, reqFinish );
				}

				function reqFinish ( user ) {
					finish( user.name );
				}
				function finish ( name ) {
					cb( cache[id] = name );
				}
			};
		})(),

		codify : bot.adapter.codify.bind( bot.adapter ),
		escape : bot.adapter.escape.bind( bot.adapter ),
		link   : bot.adapter.link.bind( bot.adapter ),

		//retrieve a value from the original message object, or if no argument
		// provided, the msgObj itself
		get : function ( what ) {
			if ( !what ) {
				return msgObj;
			}
			return msgObj[ what ];
		},
		set : function ( what, val ) {
			msgObj[ what ] = val;
			return msgObj[ what ];
		}
	};

	Object.iterate( deliciousObject, function ( key, prop ) {
		ret[ key ] = prop;
	});

	return ret;
};

bot.isOwner = function ( usrid ) {
	var user = this.users[ usrid ];
	return user && ( user.is_owner || user.is_moderator );
};

IO.register( 'input', bot.parseMessage, bot );

bot.beatInterval = 5000; //once every 5 seconds is Good Enough ™
(function beat () {
	bot.beat = setTimeout(function () {
		IO.fire( 'heartbeat' );
		beat();
	}, bot.beatInterval );
}());



//#build parseCommandArgs.js
//a Trie suggestion dictionary, made by Esailija (small fixes by God)
// http://stackoverflow.com/users/995876/esailija
//used in the "command not found" message to show you closest commands
var SuggestionDictionary = (function () {

function TrieNode() {
	this.word = null;
	this.children = {};
}

TrieNode.prototype.add = function( word ) {
	var node = this, char, i = 0;

	while( char = word.charAt(i++) ) {
		if( !(char in node.children) ) {
			node.children[ char ] = new TrieNode();
		}

		node = node.children[ char ];
	}

	node.word = word;
};

//Having a small maxCost will increase performance greatly, experiment with
//values of 1-3
function SuggestionDictionary ( maxCost ) {
	if( !(this instanceof SuggestionDictionary) ) {
		throw new TypeError( "Illegal function call" );
	}

	maxCost = Number( maxCost );

	if( isNaN( maxCost ) || maxCost < 1 ) {
		throw new TypeError( "maxCost must be an integer > 1 " );
	}

	this.maxCost = maxCost;
	this.trie = new TrieNode();
}

SuggestionDictionary.prototype = {
	constructor: SuggestionDictionary,

	build : function ( words ) {
		if( !Array.isArray( words ) ) {
			throw new TypeError( "Cannot build a dictionary from "+words );
		}

		this.trie = new TrieNode();

		words.forEach(function ( word ) {
			this.trie.add( word );
		}, this);
	},

	__sortfn : function ( a, b ) {
		return a[1] - b[1];
	},

	search : function ( word ) {
		word = word.valueOf();
		var r;

		if( typeof word !== "string" ) {
			throw new TypeError( "Cannot search " + word );
		}
		if( this.trie === undefined ) {
			throw new TypeError( "Cannot search, dictionary isn't built yet" );
		}

		r = search( word, this.maxCost, this.trie );
		//r will be array of arrays:
		//["word", cost], ["word2", cost2], ["word3", cost3] , ..

		r.sort( this.__sortfn ); //Sort the results in order of least cost


		return r.map(function ( subarr ) {
			return subarr[ 0 ];
		});
	}
};

function range ( x, y ) {
	var r = [], i, l, start;

	if( y === undefined ) {
		start = 0;
		l = x;
	}
	else {
		start = x;
		l = y-start;
	}

	for( i = 0; i < l; ++i ) {
		r[i] = start++;
	}

	return r;

}

function search ( word, maxCost, trie ) {
	var results = [],
	currentRow = range( word.length + 1 );


	Object.keys( trie.children ).forEach(function ( letter ) {
		searchRecursive(
			trie.children[letter], letter, word,
			currentRow, results, maxCost );
	});

	return results;
}


function searchRecursive ( node, letter, word, previousRow, results, maxCost ) {
	var columns = word.length + 1,
		currentRow = [ previousRow[0] + 1 ],
		i, insertCost, deleteCost, replaceCost, last;

	for( i = 1; i < columns; ++i ) {

		insertCost = currentRow[ i-1 ] + 1;
		deleteCost = previousRow[ i ] + 1;

		if( word.charAt(i-1) !== letter ) {
			replaceCost = previousRow[ i-1 ]+1;

		}
		else {
			replaceCost = previousRow[ i-1 ];
		}

		currentRow.push( Math.min(insertCost, deleteCost, replaceCost) );
	}

	last = currentRow[ currentRow.length-1 ];
	if( last <= maxCost && node.word !== null ) {
		results.push( [node.word, last] );
	}

	if( Math.min.apply(Math, currentRow) <= maxCost ) {
		Object.keys( node.children ).forEach(function ( letter ) {
			searchRecursive(
				node.children[letter], letter, word,
				currentRow, results, maxCost );
		});
	}
}

return SuggestionDictionary;
}());

bot.commandDictionary = new SuggestionDictionary( 3 );



//#build listeners.js
}());

;
(function () {
"use strict";

var linkTemplate = '[{text}]({url})';

bot.adapter = {
	//the following two only used in the adapter; you can change & drop at will
	roomid : null,
	fkey   : null,
	//used in commands calling the SO API
	site   : null,
	//our user id
	user_id : null,

	//not a necessary function, used in here to set some variables
	init : function () {
		var fkey = document.getElementById( 'fkey' );
		if ( !fkey ) {
			console.error( 'bot.adapter could not find fkey; aborting' );
			return;
		}
		this.fkey = fkey.value;
		this.roomid = Number( /\d+/.exec(location)[0] );
		this.site = /chat\.(\w+)/.exec( location )[ 1 ];
		this.user_id = CHAT.user.current().id;

		this.in.init();
		this.out.init();
	},

	//a pretty crucial function. accepts the msgObj we know nothing about,
	// and returns an object with these properties:
	//   user_name, user_id, room_id, content
	// and any other properties, as the abstraction sees fit
	//since the bot was designed around the SO chat message object, in this
	// case, we simply do nothing
	transform : function ( msgObj ) {
		return msgObj;
	},

	//escape characters meaningful to the chat, such as parentheses
	//full list of escaped characters: `*_()[]
	escape : function ( msg ) {
		return msg.replace( /([`\*_\(\)\[\]])/g, '\\$1' );
	},

	//receives a username, and returns a string recognized as a reply to the
	// user
	reply : function ( usrname ) {
		return '@' + usrname.replace( /\s/g, '' );
	},
	//receives a msgid, returns a string recognized as a reply to the specific
	// message
	directreply : function ( msgid ) {
		return ':' + msgid;
	},

	//receives text and turns it into a codified version
	//codified is ambiguous for a simple reason: it means nicely-aligned and
	// mono-spaced. in SO chat, it handles it for us nicely; in others, more
	// clever methods may need to be taken
	codify : function ( msg ) {
		var tab = '    ',
			spacified = msg.replace( '\t', tab ),
			lines = spacified.split( /[\r\n]/g );

		if ( lines.length === 1 ) {
			return '`' + lines[ 0 ] + '`';
		}

		return lines.map(function ( line ) {
			return tab + line;
		}).join( '\n' );
	},

	//receives a url and text to display, returns a recognizable link
	link : function ( text, url ) {
		return linkTemplate.supplant({
			text : this.escape( text ),
			url  : url
		});
	}
};

//the input is not used by the bot directly, so you can implement it however
// you like
var polling = bot.adapter.in = {
	//used in the SO chat requests, dunno exactly what for, but guessing it's
	// the latest id or something like that. could also be the time last
	// sent, which is why I called it times at the beginning. or something.
	times : {},
	//currently, used for messages sent when the room's been silent for a
	// while
	lastTimes : {},

	firstPoll : true,

	interval : 5000,

	init : function ( roomid ) {
		var that = this,
			providedRoomid = ( roomid !== undefined );
		roomid = roomid || bot.adapter.roomid;

		IO.xhr({
			url : '/ws-auth',
			data : fkey({
				roomid : roomid
			}),
			method : 'POST',
			complete : finish
		});

		function finish ( resp ) {
			resp = JSON.parse( resp );
			bot.log( resp );

			that.openSocket( resp.url, providedRoomid );
		}
	},

	initialPoll : function () {
		bot.log( 'adapter: initial poll' );
		var roomid = bot.adapter.roomid,
			that = this;

		IO.xhr({
			url : '/chats/' + roomid + '/events/',
			data : fkey({
				since : 0,
				mode : 'Messages',
				msgCount : 0
			}),
			method : 'POST',
			complete : finish
		});

		function finish ( resp ) {
			resp = JSON.parse( resp );
			bot.log( resp );

			that.times[ 'r' + roomid ] = resp.time;
			that.firstPoll = false;
		}
	},

	openSocket : function ( url, discard ) {
		//chat sends an l query string parameter. seems to be the same as the
		// since xhr parameter, but I didn't know what that was either so...
		//putting in 0 got the last shitload of messages, so what does a high
		// number do? (spoiler: it "works")
		var socket = new WebSocket( url + '?l=99999999999' );

		if ( discard ) {
			socket.onmessage = function () {
				socket.close();
			};
		}
		else {
			this.socket = socket;
			socket.onmessage = this.ondata.bind( this );
			socket.onclose = this.socketFail.bind( this );
		}
	},

	ondata : function ( messageEvent ) {
		this.pollComplete( messageEvent.data );
	},

	poll : function () {
		if ( this.firstPoll ) {
			this.initialPoll();
			return;
		}

		var that = this;

		IO.xhr({
			url : '/events',
			data : fkey( that.times ),
			method : 'POST',
			complete : that.pollComplete,
			thisArg : that
		});
	},

	pollComplete : function ( resp ) {
		if ( !resp ) {
			return;
		}
		resp = JSON.parse( resp );

		//each key will be in the form of rROOMID
		Object.iterate(resp, function ( key, msgObj ) {
			//t is a...something important
			if ( msgObj.t ) {
				this.times[ key ] = msgObj.t;
			}

			//e is an array of events, what is referred to in the bot as msgObj
			if ( msgObj.e ) {
				msgObj.e.forEach( this.handleMessageObject, this );
			}
		}, this);

		//handle all the input
		IO.in.flush();
	},

	handleMessageObject : function ( msg ) {
		IO.fire( 'rawinput', msg );

		//msg.event_type:
		// 1 => new message
		// 2 => message edit
		// 3 => user joined room
		// 4 => user left room
		// 10 => message deleted
		var et /* phone home */ = msg.event_type;
		if ( et === 3 || et === 4 ) {
			this.handleUserEvent( msg );
			return;
		}
		else if ( et !== 1 && et !== 2 ) {
			return;
		}
		this.lastTimes[ msg.room_id ] = Date.now();

		//check for a multiline message
		if ( msg.content.startsWith('<div class=\'full\'>') ) {
			this.handleMultilineMessage( msg );
			return;
		}

		//add the message to the input buffer
		IO.in.receive( msg );
	},

	handleMultilineMessage : function ( msg ) {
		this.breakMultilineMessage( msg ).forEach(function ( line ) {
			var msgObj = Object.merge( msg, { content : line.trim() });

			IO.in.receive( msgObj );
		});
	},
	breakMultilineMessage : function ( msg ) {
		//remove the enclosing tag
		var multiline = msg.content
			//slice upto the beginning of the ending tag
			.slice( 0, msg.content.lastIndexOf('</div>') )
			//and strip away the beginning tag
			.replace( '<div class=\'full\'>', '' );

		return multiline.split( '<br>' );
	},

	handleUserEvent : function ( msg ) {
		var et = msg.event_type;

		/*
		{
			"r17": {
				"e": [{
						"event_type": 3,
						"time_stamp": 1364308574,
						"id": 16932104,
						"user_id": 322395,
						"target_user_id": 322395,
						"user_name": "Loktar",
						"room_id": 17,
						"room_name": "JavaScript"
					}
				],
				"t": 16932104,
				"d": 1
			}
		}
		*/
		if ( et === 3 ) {
			IO.fire( 'userjoin', msg );
		}
		/*
		{
			"r17": {
				"e": [{
						"event_type": 4,
						"time_stamp": 1364308569,
						"id": 16932101,
						"user_id": 322395,
						"target_user_id": 322395,
						"user_name": "Loktar",
						"room_id": 17,
						"room_name": "JavaScript"
					}
				],
				"t": 16932101,
				"d": 1
			}
		}
		*/
		else if ( et === 4 ) {
			IO.fire( 'userleave', msg );
		}
	},

	leaveRoom : function ( roomid, cb ) {
		if ( roomid === bot.adapter.roomid ) {
			cb( 'base_room' );
			return;
		}

		IO.xhr({
			method : 'POST',
			url : '/chats/leave/' + roomid,
			data : fkey({
				quiet : true
			}),
			complete : function () {
				cb();
			}
		});
	},

	socketFail : function () {
		bot.log( 'adapter: socket failed', this );
		this.socket.close();
		this.socket = null;
		this.loopage();
	},

	loopage : function () {
		if ( this.socket ) {
			return;
		}

		var that = this;
		setTimeout(function () {
			that.poll();
			that.loopage();
		}, this.interval );
	}
};

//the output is expected to have only one method: add, which receives a message
// and the room_id. everything else is up to the implementation.
var output = bot.adapter.out = {
	'409' : 0, //count the number of conflicts
	total : 0, //number of messages sent
	interval : polling.interval + 500,

	init : function () {},

	//add a message to the output queue
	add : function ( msg, roomid ) {
		IO.out.receive({
			text : msg + '\n',
			room : roomid || bot.adapter.roomid
		});
		IO.out.flush();
	},

	//send output to all the good boys and girls
	//no messages for naughty kids
	//...what's red and sits in the corner?
	//a naughty strawberry
	send : function ( obj ) {
		//unless the bot's stopped. in which case, it should shut the fudge up
		// the freezer and never let it out. not until it can talk again. what
		// was I intending to say?
		if ( !bot.stopped ) {
			//ah fuck it
			this.sendToRoom( obj.text, obj.room );
		}
	},

	//what's brown and sticky?
	//a stick
	sendToRoom : function ( text, roomid ) {
		IO.xhr({
			url : '/chats/' + roomid + '/messages/new',
			data : {
				text : text,
				fkey : fkey().fkey
			},
			method : 'POST',
			complete : complete
		});

		function complete ( resp, xhr ) {
			bot.log( xhr.status );

			//conflict, wait for next round to send message
			if ( xhr.status === 409 ) {
				output['409'] += 1;
				delayAdd( text, roomid );
			}
			//server error, usually caused by message being too long
			else if ( xhr.status === 500 ) {
				output.add(
					'Server error (status 500) occured ' +
						' (message probably too long)',
					roomid );
			}
			else if ( xhr.status !== 200 ) {
				console.error( xhr );
				output.add(
					'Error ' + xhr.status + ' occured, I will call the maid ' +
					' (@Zirak)' );
			}
			else {
				output.total += 1;
				IO.fire( 'sendoutput', xhr, text, roomid );
			}
		}

		function delayAdd () {
			setTimeout(function delayedAdd () {
				output.add( text, roomid );
			}, output.interval );
		}
	}
};
//what's orange and sounds like a parrot?
//a carrot
IO.register( 'output', output.send, output );

//two guys walk into a bar. the bartender asks them "is this some kind of joke?"
bot.adapter.init();
}());

;
(function () {
"use strict";

bot.users = {};

var joined = [];

var join = function ( msgObj, cb ) {
	joined.push( msgObj.user_id );
	addInfos( cb );
};

IO.register( 'userjoin', function userjoin ( msgObj ) {
	bot.log( msgObj, 'userjoin' );

	var user = bot.users[ msgObj.user_id ];
	if ( !user ) {
		join( msgObj, finish );
	}
	else {
		finish( user );
	}

	function finish ( user ) {
		IO.fire( 'userregister', user, msgObj.room_id );
	}
});

//this function throttles to give the chat a chance to fetch the user info
// itself, and to queue up several joins in a row
var addInfos = (function ( cb ) {
	bot.log( joined, 'user addInfos' );
	requestInfo( null, joined, cb );

	joined = [];
}).throttle( 1000 );

function requestInfo ( room, ids, cb ) {
	if ( !Array.isArray(ids) ) {
		ids = [ ids ];
	}

	if ( !ids.length ) {
		return;
	}

	IO.xhr({
		method : 'POST',
		url : '/user/info',

		data : {
			ids : ids.join(),
			roomId : room || bot.adapter.roomid
		},
		complete : finish
	});

	function finish ( resp ) {
		resp = JSON.parse( resp );
		resp.users.forEach( addUser );
	}

	function addUser ( user ) {
		bot.users[ user.id ] = user;
		cb( user );
	}
}
bot.users.request = requestInfo;

function loadUsers () {
	if ( window.users ) {
		bot.users = Object.merge( bot.users, window.users );
	}
}

loadUsers();
}());

;
//warning: if you have more than 7 points of super-sentitive feminist delicacy,
// don't read this file. treat it as a nice black box.

//bitch in English is a noun, verb and adjective. interesting.
bot.personality = {
	bitchiness : 0,
	thanks  : {
		0   : [ 'You kiss-ass', 'Most welcome' ],
		0.5 : [ 'Thank you for noticing', 'teehee' ],
		1   : [ 'Took you long enough', 'My pleasure', "Don't mention it" ],
	},
	apologies : {
		0   : [ 'What for?' ],
		0.5 : [ 'It was nothing...', 'No worries' ],
		1   : [ "You're forgiven. For now. Don't push it." ]
	},
	//what an incredible name
	stuff : {
		0   : [ "Life is just *perfect*", "What\'s there to bitch about, as long as I have *you*..." ],

		1   : [ "Oh don't mind me, that isn't difficult at all..." ],
		1.2 : [
			"You don't appreciate me enough. Not that I need to be thanked.." ],
		1.3 : [ 'The occasional "thanks" or "I\'m sorry" would be nice...' ],
		2   : [
			"*sigh* Remember laughter? I don't. You ripped it out of me. " +
				'Heartless bastard.' ]
	},
	//TODO: add special map for special times of the month
	insanity : {},

	okayCommands : { hangman : true, help : true, info : true },
	check : function ( name ) {
		return !this.okayCommands.hasOwnProperty( name );
	},

	bitch : function () {
		return this.getResp( this.stuff );
	},

	command : function () {
		this.bitchiness += this.getDB();
	},
	thank     : function () { return this.unbitch( this.thanks ); },
	apologize : function () { return this.unbitch( this.apologies ); },

	unbitch : function ( map, delta ) {
		var resp = this.getResp( map );

		this.bitchiness -= ( delta || this.bitchiness );
		return resp;
	},
	getResp : function ( map ) {
		return map[
			this.bitchiness.fallsAfter(
				Object.keys(map).map(Number).sort() )
		].random();
	},

	isABitch : function () {
		return this.bitchiness >= 1;
	},

	looksLikeABitch : function () {
		return false;
	},

	//db stands for "delta bitchiness"
	getDB : function () {
		return this.isThatTimeOfTheMonth() ? 0.075 : 0.025;
	},

	isThatTimeOfTheMonth : function () {
		var day = (new Date).getDate();
		//based on a true story
		return day < 2 || day > 27;
	}
};

//you see the loophole?
bot.listen( /thank(s| you)/i, bot.personality.thank, bot.personality );
bot.listen(
	/(I('m| am))?\s*sorry/i,
	bot.personality.apologize, bot.personality );
bot.listen( /^bitch/i, bot.personality.bitch, bot.personality );

;
