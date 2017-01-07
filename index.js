'use strict';

const program = require('commander');
const osascript = require('node-osascript');
const spotify = require('spotify-web-api-node');
const _ = require('lodash');
const prompt = require('prompt');
const parseSearchResults = require('./parsers/');
const printSearchResults = require('./printers/');

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
					osascript.execute('tell application "Spotify" to play track uri', { uri : selectedSpotifyURI },function(err, result, raw){
						  if (err) return console.error(err)
						  console.log(result, raw)
					})
				})
			}, function(err) {
				console.error(err);
			});
	});

program.parse(process.argv);
