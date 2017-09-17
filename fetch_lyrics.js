const fetchLyrics = (geniusAPIClient, artist, song) => {
	let query = encodeURIComponent(artist + ' ' + song);
	geniusAPIClient.search(query).then(results => {
		if(results.length){
			geniusAPIClient.song(results[0].id, {fetchLyrics: true}).then(lyrics => {
				console.log(`${artist} - ${song} Lyrics`);
				console.log(lyrics.lyrics);
			});
		}
		else {
			console.log(`No lyrics found for ${artist} - ${song}`);
		}
	});
};

module.exports = {
	fetchLyrics: fetchLyrics
};
