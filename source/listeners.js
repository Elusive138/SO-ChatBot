(function () {

bot.listen( /(@bob.*sleep)|(sleep.*@bob)/i, function ( msg ) {
	return "***NO***";
});

}());
