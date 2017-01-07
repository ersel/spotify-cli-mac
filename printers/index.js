'use strict';

const chalk = require('chalk');

const SearchResultPrinters = {
	'albums': albumPrinterFn,
	'artists': artistPrinterFn,
	'playlists': playlistPrinterFn,
	'tracks': trackPrinterFn,
}

function albumPrinterFn(data){
	data.forEach((result) => {
		console.log(
			chalk.green(result.resultIndex + ': ') +
			chalk.blue('Album: ') +
			chalk.green(result.albumName)  +
			chalk.blue(' Artist: ') +
			chalk.green(result.artistNames)
		);
	});
}

function artistPrinterFn(data){
	data.forEach((result) => {
		console.log(
			chalk.green(result.resultIndex + ': ') +
			chalk.blue('Artist: ') +
			chalk.green(result.name)  +
			chalk.blue(' Followers: ') +
			chalk.green(result.followers)
		)
	})
}

function playlistPrinterFn(data){
	data.forEach((result) => {
		console.log(
			chalk.green(result.resultIndex + ': ') +
			chalk.blue('Playlist: ') +
			chalk.green(result.name)  +
			chalk.blue(' Tracks: ') +
			chalk.green(result.noOfTracks)
		)
	})
}

function trackPrinterFn(data){
	// TODO: some tabbing would make it better
	// but this will do for now
	data.forEach((result) => {
		console.log(
			chalk.green(result.resultIndex + ': ') +
			chalk.blue('Track: ') +
			chalk.green(result.trackName + ' (' + result.duration + ')')  +
			chalk.blue(' Artist: ') +
			chalk.green(result.artistNames) +
			chalk.blue(' Album: ') +
			chalk.green(result.albumName)
		);
	});
}

function printSearchResults(resultType, data){
	if(SearchResultPrinters[resultType]){
		return SearchResultPrinters[resultType](data);
	} else {
		throw new Error(`${resultType} can not be printed.`)
	}
}

module.exports = printSearchResults;

