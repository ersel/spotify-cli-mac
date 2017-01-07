'use strict';

const moment = require('moment');
// custom moment plugin for formatting track duractions
require("moment-duration-format");

const SearchResultParsers = {
	'albums': albumParserFn,
	'artists': artistParserFn,
	'playlists': playlistParserFn,
	'tracks': trackParserFn,
}

function albumParserFn(resultType, data){
	throw new Error('not implemented');
}

function artistParserFn(resultType, data){
	throw new Error('not implemented');
}

function playlistParserFn(resultType, data){
	throw new Error('not implemented');
}

function trackParserFn(resultType, data){
	return data.body[resultType].items.map((resultEntry, index) => {
		var resultIndex = index + 1;
		var trackName = resultEntry.name;
		var albumName = resultEntry.album.name;
		var artistNames = resultEntry.artists.map((artist) => artist.name ).join(", ");
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
	} else {
		throw new Error(`${resultType} can not be parsed.`);
	}
}


module.exports = parseSearchResults;
