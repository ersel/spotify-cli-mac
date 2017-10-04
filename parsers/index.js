'use strict';

const moment = require('moment');
// custom moment plugin for formatting track duractions
require('moment-duration-format');

const SearchResultParsers = {
	'albums': albumParserFn,
	'artists': artistParserFn,
	'playlists': playlistParserFn,
	'tracks': trackParserFn
};

function albumParserFn(resultType, data){
	return data.body[resultType].items.map((resultEntry, index) => {
		var resultIndex = index + 1;
		var albumName = resultEntry.name;
		var artistNames = resultEntry.artists.map((artist) => artist.name ).join(', ');
		var spotifyURI = resultEntry.uri;

		return {
			resultIndex,
			albumName,
			artistNames,
			spotifyURI
		};
	});
}

function artistParserFn(resultType, data){
	return data.body[resultType].items.map((resultEntry, index) => {
		var resultIndex = index + 1;
		var name = resultEntry.name;
		var followers = resultEntry.followers.total;
		var spotifyURI = resultEntry.uri;

		return {
			resultIndex,
			name,
			followers,
			spotifyURI
		};
	});
}

function playlistParserFn(resultType, data){
	return data.body[resultType].items.map((resultEntry, index) => {
		var resultIndex = index + 1;
		var name = resultEntry.name;
		var noOfTracks = resultEntry.tracks.total;
		var spotifyURI = resultEntry.uri;

		return {
			resultIndex,
			name,
			noOfTracks,
			spotifyURI
		};
	});
}

function trackParserFn(resultType, data){
	// Added to reuse this function for recommendations as well
	var tracks = [];
	if (data.body[resultType].items) {
		tracks = data.body[resultType].items;
	}
	else {
		tracks = data.body[resultType];
	}

	return tracks.map((resultEntry, index) => {
		var resultIndex = index + 1;
		var trackName = resultEntry.name;
		var albumName = resultEntry.album.name;
		var artistNames = resultEntry.artists.map((artist) => artist.name ).join(', ');
		var duration = moment.duration(resultEntry.duration_ms, 'milliseconds').format();
		var spotifyURI = resultEntry.uri;

		return {
			resultIndex,
			trackName,
			albumName,
			artistNames,
			duration,
			spotifyURI
		};
	});
}

function parseSearchResults(resultType, data){
	if(SearchResultParsers[resultType]){
		return SearchResultParsers[resultType](resultType, data);
	}
	else {
		throw new Error(`${resultType} can not be parsed.`);
	}
}

module.exports = parseSearchResults;
