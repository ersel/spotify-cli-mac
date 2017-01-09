'use strict';

const chalk = require('chalk');
const emoji = require('node-emoji');
const ProgressBar = require('progress');

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

function printDurationProgress(result){
	var statusButton = result.status == 'playing' ? ':arrow_forward:' : ':double_vertical_bar:'
	statusButton = emoji.emojify(statusButton);
	new ProgressBar(`${statusButton}  ${result.status} [:bar] ${result.position} of ${result.duration}`, {
		complete: '=',
		incomplete: ' ',
		width: 50,
		total: result.durationSecs,
	}).tick(result.positionSecs);
	console.log()
}

function printPlayerStatus(result){
	var artist = `:microphone:  ${chalk.green('Artist:')} ${chalk.green(result.artist)}`;
	var track = `:musical_score:  ${chalk.green('Track:')} ${chalk.green(result.track)}`;
	var album = `:cd:  ${chalk.green('Album:')} ${chalk.green(result.album)}`;
	console.log(emoji.emojify(artist))
	console.log(emoji.emojify(track))
	console.log(emoji.emojify(album))
	console.log()
	printDurationProgress(result);
}

function printNext(result){
	var nextTrack = `:fast_forward:  Playing next track: ${chalk.green(result.track)} :musical_score:`
	console.log(emoji.emojify(nextTrack))
	console.log()
	printPlayerStatus(result);
}

function printPrevious(result){
	var previousTrack = `:rewind:  Playing previous track: ${chalk.green(result.track)} :musical_score:`
	console.log(emoji.emojify(previousTrack))
	console.log()
	printPlayerStatus(result);
}

module.exports = {
	printSearchResults,
	printPlayerStatus,
	printNext,
	printPrevious
}


