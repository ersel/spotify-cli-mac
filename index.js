'use strict';

const program = require('commander');
const osascript = require('node-osascript');
const spotify = require('spotify-web-api-node');
const _ = require('lodash');
const prompt = require('prompt');
const parseSearchResults = require('./parsers/');
const printSearchResults = require('./printers/');
const spotifyClient = require('./osascripts/');

const spotifyApi = new spotify();

const SearchOptions = {
	'track': {
		'fn': spotifyApi.searchTracks.bind(spotifyApi),
		'type': 'tracks'
	},
	't': {
		'fn': spotifyApi.searchTracks.bind(spotifyApi),
		'type': 'tracks'
	},
	'artist': {
		'fn': spotifyApi.searchArtists.bind(spotifyApi),
		'type': 'artists'
	},
	'ar': {
		'fn': spotifyApi.searchArtists.bind(spotifyApi),
		'type': 'artists'
	},
	'album': {
		'fn': spotifyApi.searchAlbums.bind(spotifyApi),
		'type': 'albums'
	},
	'al': {
		'fn': spotifyApi.searchAlbums.bind(spotifyApi),
		'type': 'albums'
	},
	'playlist': {
		'fn': spotifyApi.searchPlaylists.bind(spotifyApi),
		'type': 'playlists'
	},
	'p': {
		'fn': spotifyApi.searchPlaylists.bind(spotifyApi),
		'type': 'playlists'
	}
};

program
	.version('0.0.1')
	.command('search <type> [query...]')
	.action((type, query) => {
		// search for tracks by default
		var searchFn = SearchOptions['track'].fn;
		var searchQry = `${type} ${query.join(' ')}`;
		var resultType = SearchOptions['track'].type;

		if (SearchOptions[type]){
			searchFn = SearchOptions[type].fn;
			searchQry = query.join(' ');
			resultType = SearchOptions[type].type;
		}

		searchFn(searchQry)
			.then(function(data) {
				var results = parseSearchResults(resultType, data);
				printSearchResults(resultType, results);
				prompt.start();
				prompt.get(['selection'], function (err, result) {
					var selectedSpotifyURI = results[result.selection-1].spotifyURI;
					spotifyClient.play(selectedSpotifyURI).then((result) => {
						console.log(result);
					});
			});
		});
	});

program
	.command('status')
	.action(() => {
		spotifyClient.status().then((result) => {
			console.log(result);
		})
	})


program
	.command('play')
	.action(() => {
		spotifyClient.play().then((result) => {
			console.log(result);
		})
	})


program
	.command('pause')
	.action(() => {
		spotifyClient.pause().then((result) => {
			console.log(result);
		})
	})

program
	.command('next')
	.action(() => {
		spotifyClient.next().then((result) => {
			console.log(result);
		})
	})

program
	.command('previous')
	.action(() => {
		spotifyClient.previous().then((result) => {
			console.log(result);
		})
	})

program
	.command('mute')
	.action(() => {
		spotifyClient.mute().then((result) => {
			console.log(result);
		})
	})

program
	.command('unmute')
	.action(() => {
		spotifyClient.unmute().then((result) => {
			console.log(result);
		})
	})

program
	.command('volume')
	.action(() => {
		spotifyClient.getVolume().then((result) => {
			console.log(result);
		})
	})

program
	.command('+ [deltaVolume]')
	.action((deltaVolume) => {
		var changeInVolume = deltaVolume ? deltaVolume : 10;
		spotifyClient.setVolume(changeInVolume).then((result) => {
			console.log(result);
		})
	})

program
	.command('- [deltaVolume]')
	.action((deltaVolume) => {
		var changeInVolume = deltaVolume ? -deltaVolume : -10;
		spotifyClient.setVolume(changeInVolume).then((result) => {
			console.log(result);
		})
	})

program.parse(process.argv);
