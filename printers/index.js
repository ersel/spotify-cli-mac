'use strict';

const chalk = require('chalk');
const emoji = require('node-emoji');
const ProgressBar = require('progress');

const SearchResultPrinters = {
	'albums': albumPrinterFn,
	'artists': artistPrinterFn,
	'playlists': playlistPrinterFn,
	'tracks': trackPrinterFn
};

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
		);
	});
}

function playlistPrinterFn(data){
	data.forEach((result) => {
		console.log(
			chalk.green(result.resultIndex + ': ') +
			chalk.blue('Playlist: ') +
			chalk.green(result.name)  +
			chalk.blue(' Tracks: ') +
			chalk.green(result.noOfTracks)
		);
	});
}

function trackPrinterFn(data){
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
	}
	else {
		throw new Error(`${resultType} can not be printed.`);
	}
}

function printDurationProgress(result){
	var statusButton = result.status === 'playing' ? ':arrow_forward:' : ':double_vertical_bar:';
	statusButton = emoji.emojify(statusButton);
	new ProgressBar(`${statusButton}  ${result.status} [:bar] ${result.position} of ${result.duration}`, {
		complete: '=',
		incomplete: ' ',
		width: 50,
		total: result.durationSecs
	}).tick(result.positionSecs);
	console.log();
}

function printPlayerStatus(result){
	var artist = `:microphone:  ${chalk.green('Artist:')} ${chalk.green(result.artist)}`;
	var track = `:musical_score:  ${chalk.green('Track:')} ${chalk.green(result.track)}`;
	var album = `:cd:  ${chalk.green('Album:')} ${chalk.green(result.album)}`;
	console.log(emoji.emojify(artist));
	console.log(emoji.emojify(track));
	console.log(emoji.emojify(album));
	console.log();
	printDurationProgress(result);
}

function printNext(result){
	var nextTrack = `:fast_forward:  Playing next track: ${chalk.green(result.track)} :musical_score:`;
	console.log(emoji.emojify(nextTrack));
	console.log();
	printPlayerStatus(result);
}

function printPrevious(result){
	var previousTrack = `:rewind:  Playing previous track: ${chalk.green(result.track)} :musical_score:`;
	console.log(emoji.emojify(previousTrack));
	console.log();
	printPlayerStatus(result);
}

function printVolume(volume){
	new ProgressBar(`Volume: [:bar] ${chalk.green(volume)}`, {
		complete: '=',
		incomplete: ' ',
		width: 50,
		total: 100
	}).tick(volume);
	console.log();
}

function printMute(volume){
	var mute = `:no_bell:  Spotify muted.`;
	console.log(emoji.emojify(mute));
	printVolume(volume);
}

function printUnmute(volume){
	var unmute = `:bell:  Spotify unmuted.`;
	console.log(emoji.emojify(unmute));
	printVolume(volume);
}

function printSetVolume(volume){
	var setVolume = `:headphones:  Volume set to ${volume}`;
	console.log(emoji.emojify(setVolume));
	printVolume(volume);
}

function printVolumeIncrease(change, volume){
	var increaseVolume = `:speaker:  Volume increased by ${change}`;
	console.log(emoji.emojify(increaseVolume));
	printVolume(volume);
}

function printVolumeDecrease(change, volume){
	var decreaseVolume = `:speaker:  Volume decreased by ${~change}`;
	console.log(emoji.emojify(decreaseVolume));
	printVolume(volume);
}

function printToggleShuffle(status){
	var description = status ? `${chalk.green('turned ON.')}` : `${chalk.red('turned OFF.')}`;
	var toggleShuffle = `:twisted_rightwards_arrows:  Shuffle ${description}`;
	console.log(emoji.emojify(toggleShuffle));
}

function printToggleRepeat(status){
	var description = status ? `${chalk.green('turned ON.')}` : `${chalk.red('turned OFF.')}`;
	var toggleRepeat = `:repeat:  Repeat ${description}`;
	console.log(emoji.emojify(toggleRepeat));
}

function printConfig(){
	console.log(
		chalk.green('Config set!')
	);
}

module.exports = {
	printSearchResults,
	printPlayerStatus,
	printNext,
	printPrevious,
	printVolume,
	printMute,
	printUnmute,
	printSetVolume,
	printVolumeIncrease,
	printVolumeDecrease,
	printToggleShuffle,
	printToggleRepeat,
	printConfig
};
